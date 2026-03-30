from fastapi import FastAPI, APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import requests
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ.get('DB_NAME', 'copolyz_db')

# Configure MongoDB client with proper settings for Atlas
client = AsyncIOMotorClient(
    mongo_url,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=10000,
    socketTimeoutMS=10000
)
db = client[db_name]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'coochbehar-polyclinic-secret-key-2026')
JWT_ALGORITHM = 'HS256'

class UserRole(str, Enum):
    PATIENT = "patient"
    ADMIN = "admin"
    DOCTOR = "doctor"
    RECEPTIONIST = "receptionist"

class AppointmentStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class AppointmentType(str, Enum):
    NEW_CONSULTATION = "New Consultation"
    BLOOD_TEST = "Blood Test"
    ECG = "ECG"
    XRAY = "X-Ray"
    INJECTION = "Injection"
    DRESSING = "Dressing"
    MEDICINE = "Medicine"

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    phone: str
    role: UserRole = UserRole.PATIENT
    is_guest: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str
    is_guest: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Doctor(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    specialization: str
    qualifications: str
    image_url: Optional[str] = None
    available_days: List[str] = []
    accepts_online_booking: bool = True
    max_daily_appointments: Optional[int] = None  # None means unlimited
    categories: Optional[List[str]] = None  # For doctors in multiple categories
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlockedSlot(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str  # YYYY-MM-DD format
    time_slot: str  # e.g., "10:00 AM"
    reason: Optional[str] = None
    created_by: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlockedSlotCreate(BaseModel):
    date: str
    time_slot: str
    reason: Optional[str] = None

class DoctorCreate(BaseModel):
    name: str
    specialization: str
    qualifications: str
    available_days: List[str] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    accepts_online_booking: bool = True
    max_daily_appointments: Optional[int] = None
    categories: Optional[List[str]] = None

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialization: Optional[str] = None
    qualifications: Optional[str] = None
    available_days: Optional[List[str]] = None
    accepts_online_booking: Optional[bool] = None
    max_daily_appointments: Optional[int] = None
    categories: Optional[List[str]] = None

class StaffCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "admin"  # admin or receptionist

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: Optional[str] = None
    patient_name: str
    patient_email: Optional[str] = None
    patient_phone: str
    doctor_id: str
    doctor_name: str
    doctor_specialization: str
    appointment_type: AppointmentType = AppointmentType.NEW_CONSULTATION
    preferred_date: str
    preferred_time: Optional[str] = None
    symptoms: str
    duration_minutes: int = 15
    status: AppointmentStatus = AppointmentStatus.PENDING
    admin_notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AppointmentCreate(BaseModel):
    patient_name: str
    patient_email: Optional[str] = None
    patient_phone: str
    doctor_id: str
    appointment_type: AppointmentType = AppointmentType.NEW_CONSULTATION
    preferred_date: str
    preferred_time: Optional[str] = None
    symptoms: str = ""
    patient_id: Optional[str] = None

class AppointmentUpdate(BaseModel):
    status: AppointmentStatus
    admin_notes: Optional[str] = None

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    patient_name: str
    doctor_id: str
    appointment_id: str
    rating: int = Field(ge=1, le=5)
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    doctor_id: str
    appointment_id: str
    rating: int = Field(ge=1, le=5)
    comment: str


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user_data.model_dump()
    password = user_dict.pop('password')
    hashed_password = hash_password(password)
    
    user = User(**user_dict)
    user_doc = user.model_dump()
    user_doc['password'] = hashed_password
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    await db.users.insert_one(user_doc)
    
    token = create_token(user.id, user.email, user.role)
    return {"user": user.model_dump(), "token": token}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_doc.pop('password')
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**user_doc)
    token = create_token(user.id, user.email, user.role)
    return {"user": user.model_dump(), "token": token}

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user_doc = await db.users.find_one({"id": current_user['user_id']}, {"_id": 0, "password": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return User(**user_doc).model_dump()


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@api_router.post("/auth/change-password")
async def change_password(request: ChangePasswordRequest, current_user: dict = Depends(get_current_user)):
    # Get user with password
    user_doc = await db.users.find_one({"id": current_user['user_id']}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(request.current_password, user_doc['password']):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Validate new password
    if len(request.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    
    # Hash and update new password
    new_hashed = hash_password(request.new_password)
    await db.users.update_one(
        {"id": current_user['user_id']},
        {"$set": {"password": new_hashed}}
    )
    
    return {"message": "Password changed successfully"}


@api_router.get("/health")
async def health_check():
    try:
        # Try to ping the database
        await client.admin.command('ping')
        doctor_count = await db.doctors.count_documents({})
        return {
            "status": "healthy",
            "database": "connected",
            "doctor_count": doctor_count
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


@api_router.get("/doctors", response_model=List[Doctor])
async def get_doctors():
    doctors = await db.doctors.find({}, {"_id": 0}).to_list(1000)
    for doc in doctors:
        if isinstance(doc.get('created_at'), str):
            doc['created_at'] = datetime.fromisoformat(doc['created_at'])
    return doctors

@api_router.get("/doctors/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: str):
    doctor = await db.doctors.find_one({"id": doctor_id}, {"_id": 0})
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    if isinstance(doctor.get('created_at'), str):
        doctor['created_at'] = datetime.fromisoformat(doctor['created_at'])
    
    return Doctor(**doctor)

@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment_data: AppointmentCreate, background_tasks: BackgroundTasks):
    # Handle service bookings (X-ray, Blood Test, ECG) without a specific doctor
    if appointment_data.doctor_id == 'general-services':
        doctor_name = "General Services"
        doctor_specialization = appointment_data.appointment_type.value if hasattr(appointment_data.appointment_type, 'value') else str(appointment_data.appointment_type)
    else:
        doctor = await db.doctors.find_one({"id": appointment_data.doctor_id}, {"_id": 0})
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        # Check if doctor accepts online booking
        if not doctor.get('accepts_online_booking', True):
            raise HTTPException(status_code=400, detail="This doctor does not accept online bookings. Please call the clinic.")
        
        # Check if doctor has daily appointment limit
        max_daily = doctor.get('max_daily_appointments')
        if max_daily is not None:
            # Count existing appointments for this doctor on the requested date
            existing_count = await db.appointments.count_documents({
                "doctor_id": appointment_data.doctor_id,
                "preferred_date": appointment_data.preferred_date,
                "status": {"$nin": ["cancelled", "rejected"]}
            })
            if existing_count >= max_daily:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Dr. {doctor['name']} is fully booked for {appointment_data.preferred_date}. Maximum {max_daily} appointments per day."
                )
        
        doctor_name = doctor['name']
        doctor_specialization = doctor['specialization']
    
    # Check if the time slot is blocked
    if appointment_data.preferred_time:
        blocked = await db.blocked_slots.find_one({
            "date": appointment_data.preferred_date,
            "time_slot": appointment_data.preferred_time
        }, {"_id": 0})
        if blocked:
            raise HTTPException(
                status_code=400,
                detail=f"The time slot {appointment_data.preferred_time} on {appointment_data.preferred_date} is not available."
            )
    
    appointment_dict = appointment_data.model_dump()
    appointment = Appointment(
        **appointment_dict,
        doctor_name=doctor_name,
        doctor_specialization=doctor_specialization,
        duration_minutes=15
    )
    
    doc = appointment.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.appointments.insert_one(doc)
    
    # Send Telegram notification in background
    background_tasks.add_task(send_telegram_notification, appointment)
    
    return appointment


async def send_telegram_notification(appointment: Appointment):
    """Send Telegram notification to clinic about new appointment"""
    telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    telegram_chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not telegram_token or not telegram_chat_id:
        logger.warning("Telegram credentials not configured, skipping notification")
        return
    
    try:
        # Format the appointment type
        apt_type = appointment.appointment_type.value if hasattr(appointment.appointment_type, 'value') else str(appointment.appointment_type)
        
        # Create notification message
        message = f"""🏥 *New Appointment Booked!*

📋 *Patient Details:*
• Name: {appointment.patient_name}
• Phone: {appointment.patient_phone}

📅 *Appointment Details:*
• Type: {apt_type}
• Doctor: {appointment.doctor_name}
• Date: {appointment.preferred_date}
• Time: {appointment.preferred_time or 'Not specified'}

📝 *Notes:* {appointment.symptoms or 'None'}

---
_Booked at: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}_"""

        # Send message via Telegram API
        url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"
        payload = {
            "chat_id": telegram_chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=10)
            if response.status_code == 200:
                logger.info(f"Telegram notification sent for appointment {appointment.id}")
            else:
                logger.error(f"Failed to send Telegram notification: {response.text}")
                
    except Exception as e:
        logger.error(f"Error sending Telegram notification: {str(e)}")

@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments(current_user: dict = Depends(get_current_user)):
    query = {}
    if current_user['role'] == 'patient':
        query['patient_id'] = current_user['user_id']
    
    appointments = await db.appointments.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for apt in appointments:
        if isinstance(apt.get('created_at'), str):
            apt['created_at'] = datetime.fromisoformat(apt['created_at'])
        if isinstance(apt.get('updated_at'), str):
            apt['updated_at'] = datetime.fromisoformat(apt['updated_at'])
    
    return appointments

@api_router.patch("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(
    appointment_id: str,
    update_data: AppointmentUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user['role'] not in ['admin', 'doctor']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    appointment = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": update_dict}
    )
    
    updated = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    if isinstance(updated.get('updated_at'), str):
        updated['updated_at'] = datetime.fromisoformat(updated['updated_at'])
    
    return Appointment(**updated)


@api_router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, current_user: dict = Depends(get_current_user)):
    # Check if appointment exists and is completed
    appointment = await db.appointments.find_one({"id": review_data.appointment_id}, {"_id": 0})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if appointment['status'] != 'completed':
        raise HTTPException(status_code=400, detail="Can only review completed appointments")
    
    if appointment['patient_id'] != current_user['user_id']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if review already exists for this appointment
    existing_review = await db.reviews.find_one({"appointment_id": review_data.appointment_id}, {"_id": 0})
    if existing_review:
        raise HTTPException(status_code=400, detail="Review already submitted for this appointment")
    
    user_doc = await db.users.find_one({"id": current_user['user_id']}, {"_id": 0})
    
    review = Review(
        patient_id=current_user['user_id'],
        patient_name=user_doc['name'],
        doctor_id=review_data.doctor_id,
        appointment_id=review_data.appointment_id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    
    doc = review.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.reviews.insert_one(doc)
    return review

@api_router.get("/doctors/{doctor_id}/reviews", response_model=List[Review])
async def get_doctor_reviews(doctor_id: str):
    reviews = await db.reviews.find({"doctor_id": doctor_id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    
    return reviews

@api_router.get("/doctors/{doctor_id}/rating")
async def get_doctor_rating(doctor_id: str):
    reviews = await db.reviews.find({"doctor_id": doctor_id}, {"_id": 0, "rating": 1}).to_list(1000)
    
    if not reviews:
        return {"average_rating": 0, "total_reviews": 0}
    
    total_rating = sum(r['rating'] for r in reviews)
    average_rating = round(total_rating / len(reviews), 1)
    
    return {"average_rating": average_rating, "total_reviews": len(reviews)}


# ============ BLOCKED SLOTS MANAGEMENT ============

@api_router.get("/blocked-slots")
async def get_blocked_slots(date: Optional[str] = None):
    """Get all blocked slots, optionally filtered by date"""
    query = {}
    if date:
        query["date"] = date
    
    slots = await db.blocked_slots.find(query, {"_id": 0}).sort("date", 1).to_list(1000)
    return slots


@api_router.post("/blocked-slots")
async def create_blocked_slot(slot_data: BlockedSlotCreate, current_user: dict = Depends(get_current_user)):
    """Block a time slot (admin only)"""
    if current_user['role'] not in ['admin', 'doctor']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if slot already blocked
    existing = await db.blocked_slots.find_one({
        "date": slot_data.date,
        "time_slot": slot_data.time_slot
    }, {"_id": 0})
    
    if existing:
        raise HTTPException(status_code=400, detail="This time slot is already blocked")
    
    blocked_slot = BlockedSlot(
        date=slot_data.date,
        time_slot=slot_data.time_slot,
        reason=slot_data.reason,
        created_by=current_user['user_id']
    )
    
    doc = blocked_slot.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.blocked_slots.insert_one(doc)
    
    # Remove MongoDB's _id before returning (it gets added by insert_one)
    doc.pop('_id', None)
    
    return {"message": "Time slot blocked successfully", "slot": doc}


@api_router.delete("/blocked-slots/{slot_id}")
async def delete_blocked_slot(slot_id: str, current_user: dict = Depends(get_current_user)):
    """Unblock a time slot (admin only)"""
    if current_user['role'] not in ['admin', 'doctor']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.blocked_slots.delete_one({"id": slot_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blocked slot not found")
    
    return {"message": "Time slot unblocked successfully"}


@api_router.get("/availability/{date}")
async def get_availability(date: str):
    """Get available time slots for a specific date"""
    all_time_slots = [
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
        '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
    ]
    
    # Get blocked slots for this date
    blocked = await db.blocked_slots.find({"date": date}, {"_id": 0, "time_slot": 1}).to_list(100)
    blocked_times = [b['time_slot'] for b in blocked]
    
    # Get booked slots for this date (appointments that are not cancelled/rejected)
    booked = await db.appointments.find({
        "preferred_date": date,
        "status": {"$nin": ["cancelled", "rejected"]},
        "preferred_time": {"$ne": None}
    }, {"_id": 0, "preferred_time": 1}).to_list(1000)
    booked_times = [b['preferred_time'] for b in booked]
    
    available_slots = []
    for slot in all_time_slots:
        status = "available"
        if slot in blocked_times:
            status = "blocked"
        elif slot in booked_times:
            status = "booked"
        available_slots.append({"time": slot, "status": status})
    
    return {"date": date, "slots": available_slots}


@api_router.get("/doctors/{doctor_id}/availability/{date}")
async def get_doctor_availability(doctor_id: str, date: str):
    """Check if a doctor is available on a specific date (checks daily limits)"""
    doctor = await db.doctors.find_one({"id": doctor_id}, {"_id": 0})
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    max_daily = doctor.get('max_daily_appointments')
    
    if max_daily is None:
        return {
            "doctor_id": doctor_id,
            "doctor_name": doctor['name'],
            "date": date,
            "is_available": doctor.get('accepts_online_booking', True),
            "appointments_booked": 0,
            "max_daily_appointments": None,
            "message": "Available for booking" if doctor.get('accepts_online_booking', True) else "Does not accept online bookings"
        }
    
    # Count existing appointments
    existing_count = await db.appointments.count_documents({
        "doctor_id": doctor_id,
        "preferred_date": date,
        "status": {"$nin": ["cancelled", "rejected"]}
    })
    
    is_available = existing_count < max_daily and doctor.get('accepts_online_booking', True)
    
    return {
        "doctor_id": doctor_id,
        "doctor_name": doctor['name'],
        "date": date,
        "is_available": is_available,
        "appointments_booked": existing_count,
        "max_daily_appointments": max_daily,
        "message": f"Fully booked for {date}" if not is_available else f"{max_daily - existing_count} slots remaining"
    }


# ==================== DOCTOR MANAGEMENT ====================

@api_router.post("/doctors")
async def create_doctor(doctor_data: DoctorCreate, current_user: dict = Depends(get_current_user)):
    """Create a new doctor (admin only)"""
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can add doctors")
    
    doctor = Doctor(
        name=doctor_data.name,
        specialization=doctor_data.specialization,
        qualifications=doctor_data.qualifications,
        available_days=doctor_data.available_days,
        accepts_online_booking=doctor_data.accepts_online_booking,
        max_daily_appointments=doctor_data.max_daily_appointments,
        categories=doctor_data.categories
    )
    
    doc = doctor.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.doctors.insert_one(doc)
    doc.pop('_id', None)
    
    return {"message": "Doctor added successfully", "doctor": doc}


@api_router.put("/doctors/{doctor_id}")
async def update_doctor(doctor_id: str, doctor_data: DoctorUpdate, current_user: dict = Depends(get_current_user)):
    """Update a doctor's information (admin only)"""
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can update doctors")
    
    # Build update dict with only provided fields
    update_data = {k: v for k, v in doctor_data.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.doctors.update_one(
        {"id": doctor_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Get updated doctor
    updated_doctor = await db.doctors.find_one({"id": doctor_id}, {"_id": 0})
    
    return {"message": "Doctor updated successfully", "doctor": updated_doctor}


@api_router.delete("/doctors/{doctor_id}")
async def delete_doctor(doctor_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a doctor (admin only)"""
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete doctors")
    
    result = await db.doctors.delete_one({"id": doctor_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    return {"message": "Doctor deleted successfully"}


# ==================== STAFF MANAGEMENT ====================

@api_router.get("/staff")
async def get_all_staff(current_user: dict = Depends(get_current_user)):
    """Get all staff members (admin only)"""
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can view staff list")
    
    staff = await db.users.find(
        {"role": {"$in": ["admin", "receptionist"]}},
        {"_id": 0, "hashed_password": 0, "password": 0}
    ).to_list(100)
    
    return staff


@api_router.post("/staff")
async def create_staff(staff_data: StaffCreate, current_user: dict = Depends(get_current_user)):
    """Create a new staff member (admin only)"""
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can create staff accounts")
    
    # Check if email already exists
    existing = await db.users.find_one({"email": staff_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = bcrypt.hashpw(staff_data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    user = User(
        username=staff_data.username,
        email=staff_data.email,
        hashed_password=hashed_password,
        role=UserRole(staff_data.role) if staff_data.role in ['admin', 'receptionist'] else UserRole.ADMIN
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['role'] = doc['role'].value
    
    await db.users.insert_one(doc)
    doc.pop('_id', None)
    doc.pop('hashed_password', None)
    
    return {"message": "Staff account created successfully", "staff": doc}


@api_router.delete("/staff/{user_id}")
async def delete_staff(user_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a staff member (admin only)"""
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Only admins can delete staff accounts")
    
    # Prevent self-deletion
    if user_id == current_user['user_id']:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    result = await db.users.delete_one({"id": user_id, "role": {"$in": ["admin", "receptionist"]}})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Staff member not found")
    
    return {"message": "Staff account deleted successfully"}


@api_router.get("/")
async def root():
    return {"message": "Coochbehar Polyclinic API"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
