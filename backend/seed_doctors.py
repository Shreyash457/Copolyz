import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

doctors_data = [
    {
        "name": "Dr. Mithun Das",
        "specialization": "Medicine / Physician",
        "qualifications": "MBBS, MD (Medicine), MACP",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Aman Ghosh",
        "specialization": "Orthopaedic Surgery",
        "qualifications": "MBBS, D-Ortho",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Bikash Nandi",
        "specialization": "Dental",
        "qualifications": "BDS",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Subhajit Chakraborty",
        "specialization": "Dental",
        "qualifications": "BDS, MDS (Periodontist & Implantologist)",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Debasish Mallick",
        "specialization": "ENT",
        "qualifications": "MBBS, MS (ENT & Head Neck Surgery)",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Dipankar Das",
        "specialization": "ENT",
        "qualifications": "MBBS, MS (ENT & Head Neck Surgery)",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Dulal Chandra Barman",
        "specialization": "Dermatology",
        "qualifications": "MBBS, MD (Dermatology)",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Soumen Chakraborty",
        "specialization": "General Surgery",
        "qualifications": "MBBS, MS (Gen Surgery) - Laparoscopic Surgeon",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Santanu Bhattacharya",
        "specialization": "Psychiatry",
        "qualifications": "MBBS, MD, DPM (Neuro-Psychiatrist)",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Subhashish Chatterjee",
        "specialization": "Chest Specialist",
        "qualifications": "MBBS, DTCD, DMRD",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Sadhan Kumar Mal",
        "specialization": "Urology",
        "qualifications": "MBBS, MS, MCh (Urology)",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Anjan Kumar Saha",
        "specialization": "Paediatrics",
        "qualifications": "MBBS, MD (Paediatrics)",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Jinia Saha Roychowdhury",
        "specialization": "Paediatrics",
        "qualifications": "MBBS, MD (Paediatrics), MRCPCH (UK) - Neonatologist",
        "image_url": "https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=400"
    },
    {
        "name": "Dr. Kajal Pandit",
        "specialization": "Gynaecology / Obstetrics",
        "qualifications": "MBBS, DGO - Consultant Obstetrician & Gynaecologist",
        "image_url": "https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=400"
    },
    {
        "name": "Dr. Manas Sarkar",
        "specialization": "Gynaecology / Obstetrics",
        "qualifications": "MBBS, DGO - Consultant Obstetrician & Gynaecologist",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Deba Patni",
        "specialization": "Gynaecology / Obstetrics",
        "qualifications": "MBBS, DGO - Consultant Obstetrician & Gynaecologist",
        "image_url": "https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=400"
    },
    {
        "name": "Dr. Sourav Halder",
        "specialization": "Gynaecology / Obstetrics",
        "qualifications": "MBBS, DGO - Consultant Obstetrician & Gynaecologist",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Shatarshi De Das",
        "specialization": "Infertility Specialist",
        "qualifications": "Fellowship in Infertility",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    },
    {
        "name": "Dr. Prasenjit Saha",
        "specialization": "Pathology",
        "qualifications": "MD Pathology",
        "image_url": "https://images.unsplash.com/photo-1678940805950-73f2127f9d4e?w=400"
    }
]

async def seed_doctors():
    existing_count = await db.doctors.count_documents({})
    if existing_count > 0:
        print(f"Doctors already seeded ({existing_count} doctors found). Skipping...")
        return
    
    available_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    
    for doctor_data in doctors_data:
        doctor = {
            "id": str(uuid.uuid4()),
            "name": doctor_data["name"],
            "specialization": doctor_data["specialization"],
            "qualifications": doctor_data["qualifications"],
            "image_url": doctor_data["image_url"],
            "available_days": available_days,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.doctors.insert_one(doctor)
    
    print(f"Successfully seeded {len(doctors_data)} doctors!")

async def create_admin():
    existing_admin = await db.users.find_one({"role": "admin"}, {"_id": 0})
    if existing_admin:
        print("Admin user already exists. Skipping...")
        return
    
    import bcrypt
    password = "admin123"
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    admin = {
        "id": str(uuid.uuid4()),
        "email": "admin@coochbehar.com",
        "password": hashed,
        "name": "Admin User",
        "phone": "03582-469726",
        "role": "admin",
        "is_guest": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(admin)
    print("Admin user created: admin@coochbehar.com / admin123")

async def main():
    print("Starting database seeding...")
    await seed_doctors()
    await create_admin()
    client.close()
    print("Seeding complete!")

if __name__ == "__main__":
    asyncio.run(main())
