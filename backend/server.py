from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
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
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'coochbehar-polyclinic-secret-key-2026')
JWT_ALGORITHM = 'HS256'

class UserRole(str, Enum):
    PATIENT = "patient"
    ADMIN = "admin"
    DOCTOR = "doctor"

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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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
async def create_appointment(appointment_data: AppointmentCreate):
    doctor = await db.doctors.find_one({"id": appointment_data.doctor_id}, {"_id": 0})
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Check if doctor accepts online booking
    if not doctor.get('accepts_online_booking', True):
        raise HTTPException(status_code=400, detail="This doctor does not accept online bookings. Please call the clinic.")
    
    appointment_dict = appointment_data.model_dump()
    appointment = Appointment(
        **appointment_dict,
        doctor_name=doctor['name'],
        doctor_specialization=doctor['specialization'],
        duration_minutes=15
    )
    
    doc = appointment.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.appointments.insert_one(doc)
    return appointment

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
