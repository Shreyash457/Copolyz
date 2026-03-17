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
        "qualifications": "MBBS, MD (Medicine), MACP"
    },
    {
        "name": "Dr. Aman Ghosh",
        "specialization": "Orthopaedic Surgery",
        "qualifications": "MBBS, D-Ortho"
    },
    {
        "name": "Dr. Bikash Nandi",
        "specialization": "Dental",
        "qualifications": "BDS"
    },
    {
        "name": "Dr. Subhajit Chakraborty",
        "specialization": "Dental",
        "qualifications": "BDS, MDS (Periodontist & Implantologist)"
    },
    {
        "name": "Dr. Debasish Mallick",
        "specialization": "ENT",
        "qualifications": "MBBS, MS (ENT & Head Neck Surgery)"
    },
    {
        "name": "Dr. Dipankar Das",
        "specialization": "ENT",
        "qualifications": "MBBS, MS (ENT & Head Neck Surgery)"
    },
    {
        "name": "Dr. Dulal Chandra Barman",
        "specialization": "Dermatology",
        "qualifications": "MBBS, MD (Dermatology)"
    },
    {
        "name": "Dr. Soumen Chakraborty",
        "specialization": "General Surgery",
        "qualifications": "MBBS, MS (Gen Surgery) - Laparoscopic Surgeon"
    },
    {
        "name": "Dr. Santanu Bhattacharya",
        "specialization": "Psychiatry",
        "qualifications": "MBBS, MD, DPM (Neuro-Psychiatrist)"
    },
    {
        "name": "Dr. Subhashish Chatterjee",
        "specialization": "Chest Specialist",
        "qualifications": "MBBS, DTCD, DMRD"
    },
    {
        "name": "Dr. Sadhan Kumar Mal",
        "specialization": "Urology",
        "qualifications": "MBBS, MS, MCh (Urology)"
    },
    {
        "name": "Dr. Anjan Kumar Saha",
        "specialization": "Paediatrics",
        "qualifications": "MBBS, MD (Paediatrics)"
    },
    {
        "name": "Dr. Jinia Saha Roychowdhury",
        "specialization": "Paediatrics",
        "qualifications": "MBBS, MD (Paediatrics), MRCPCH (UK) - Neonatologist"
    },
    {
        "name": "Dr. Kajal Pandit",
        "specialization": "Gynaecology / Obstetrics",
        "qualifications": "MBBS, DGO - Consultant Obstetrician & Gynaecologist"
    },
    {
        "name": "Dr. Manas Sarkar",
        "specialization": "Gynaecology / Obstetrics",
        "qualifications": "MBBS, DGO - Consultant Obstetrician & Gynaecologist"
    },
    {
        "name": "Dr. Deba Patni",
        "specialization": "Gynaecology / Obstetrics",
        "qualifications": "MBBS, DGO - Consultant Obstetrician & Gynaecologist"
    },
    {
        "name": "Dr. Sourav Halder",
        "specialization": "Gynaecology / Obstetrics",
        "qualifications": "MBBS, DGO - Consultant Obstetrician & Gynaecologist"
    },
    {
        "name": "Dr. Shatarshi De Das",
        "specialization": "Infertility Specialist",
        "qualifications": "Fellowship in Infertility"
    },
    {
        "name": "Dr. Prasenjit Saha",
        "specialization": "Pathology",
        "qualifications": "MD Pathology"
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
