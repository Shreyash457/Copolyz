#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Coochbehar Polyclinic
Tests all API endpoints with proper authentication and error handling
"""

import requests
import sys
import json
from datetime import datetime, timedelta
from typing import Optional

class PolyclinicAPITester:
    def __init__(self, base_url="https://doc-book-app-1.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        
        # Test data
        self.test_user_token = None
        self.admin_token = None
        self.test_user_id = None
        self.test_appointment_id = None
        self.doctor_id = None
        
        # Test results tracking
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name: str, method: str, endpoint: str, expected_status: int, 
                 data: dict = None, token: str = None) -> tuple:
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers = {}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   {method} {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PATCH':
                response = self.session.patch(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)
            else:
                print(f"   ❌ Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"   ✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.content else {}
                except json.JSONDecodeError:
                    response_data = {"raw_response": response.text}
                return True, response_data
            else:
                print(f"   ❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json() if response.content else {}
                    print(f"   Error: {error_data}")
                except json.JSONDecodeError:
                    print(f"   Raw error: {response.text}")
                
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'endpoint': url
                })
                return False, {}

        except Exception as e:
            print(f"   ❌ Failed - Exception: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e),
                'endpoint': url
            })
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test("Root API", "GET", "/", 200)
        if success:
            assert 'message' in response, "Root endpoint should return message"
            print(f"   Message: {response.get('message')}")

    def test_user_registration(self):
        """Test user registration"""
        test_email = f"test_patient_{datetime.now().strftime('%Y%m%d_%H%M%S')}@test.com"
        user_data = {
            "email": test_email,
            "password": "TestPassword123!",
            "name": "Test Patient",
            "phone": "9876543210",
            "is_guest": False
        }
        
        success, response = self.run_test("User Registration", "POST", "/auth/register", 200, user_data)
        if success:
            assert 'user' in response and 'token' in response, "Registration should return user and token"
            self.test_user_token = response['token']
            self.test_user_id = response['user']['id']
            print(f"   Registered user: {response['user']['name']}")
            print(f"   User ID: {self.test_user_id}")

    def test_duplicate_registration(self):
        """Test duplicate email registration (should fail)"""
        duplicate_data = {
            "email": f"test_patient_{datetime.now().strftime('%Y%m%d_%H%M%S')}@test.com",
            "password": "Test123!",
            "name": "Test User",
            "phone": "9876543210"
        }
        
        # First registration should succeed
        success, _ = self.run_test("First Registration", "POST", "/auth/register", 200, duplicate_data)
        
        if success:
            # Second registration with same email should fail
            self.run_test("Duplicate Registration", "POST", "/auth/register", 400, duplicate_data)

    def test_admin_login(self):
        """Test admin login with provided credentials"""
        admin_credentials = {
            "email": "admin@coochbehar.com",
            "password": "admin123"
        }
        
        success, response = self.run_test("Admin Login", "POST", "/auth/login", 200, admin_credentials)
        if success:
            assert 'user' in response and 'token' in response, "Login should return user and token"
            assert response['user']['role'] == 'admin', "User should have admin role"
            self.admin_token = response['token']
            print(f"   Admin user: {response['user']['name']}")

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_credentials = {
            "email": "nonexistent@test.com",
            "password": "wrongpassword"
        }
        
        self.run_test("Invalid Login", "POST", "/auth/login", 401, invalid_credentials)

    def test_get_user_profile(self):
        """Test getting current user profile"""
        if not self.test_user_token:
            print("   ⚠️  Skipped - No user token available")
            return
        
        success, response = self.run_test("Get User Profile", "GET", "/auth/me", 200, token=self.test_user_token)
        if success:
            assert 'id' in response and 'name' in response, "Profile should contain user details"
            print(f"   User profile: {response.get('name')} ({response.get('email')})")

    def test_get_doctors(self):
        """Test getting all doctors"""
        success, response = self.run_test("Get All Doctors", "GET", "/doctors", 200)
        if success:
            assert isinstance(response, list), "Doctors endpoint should return a list"
            if len(response) > 0:
                self.doctor_id = response[0]['id']
                print(f"   Found {len(response)} doctors")
                print(f"   First doctor: {response[0].get('name')} ({response[0].get('specialization')})")
                print(f"   Using doctor ID: {self.doctor_id}")
            else:
                print("   ⚠️  No doctors found in database")

    def test_get_single_doctor(self):
        """Test getting a specific doctor"""
        if not self.doctor_id:
            print("   ⚠️  Skipped - No doctor ID available")
            return
        
        success, response = self.run_test("Get Single Doctor", "GET", f"/doctors/{self.doctor_id}", 200)
        if success:
            assert 'id' in response and 'name' in response, "Doctor should contain details"
            print(f"   Doctor: {response.get('name')} - {response.get('specialization')}")

    def test_get_nonexistent_doctor(self):
        """Test getting a non-existent doctor (should fail)"""
        fake_id = "non-existent-doctor-id"
        self.run_test("Get Nonexistent Doctor", "GET", f"/doctors/{fake_id}", 404)

    def test_guest_appointment_booking(self):
        """Test booking appointment as guest"""
        if not self.doctor_id:
            print("   ⚠️  Skipped - No doctor ID available")
            return
        
        appointment_data = {
            "patient_name": "Guest Patient",
            "patient_email": "guest@test.com",
            "patient_phone": "8765432109",
            "doctor_id": self.doctor_id,
            "preferred_date": (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
            "symptoms": "Regular checkup and consultation"
        }
        
        success, response = self.run_test("Guest Appointment Booking", "POST", "/appointments", 200, appointment_data)
        if success:
            assert 'id' in response, "Appointment should have an ID"
            self.test_appointment_id = response['id']
            print(f"   Appointment ID: {self.test_appointment_id}")
            print(f"   Status: {response.get('status')}")

    def test_authenticated_appointment_booking(self):
        """Test booking appointment as authenticated user"""
        if not self.doctor_id or not self.test_user_token or not self.test_user_id:
            print("   ⚠️  Skipped - Missing required data")
            return
        
        appointment_data = {
            "patient_name": "Test Patient",
            "patient_email": "test@test.com",
            "patient_phone": "7654321098",
            "doctor_id": self.doctor_id,
            "preferred_date": (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d'),
            "symptoms": "Follow-up consultation",
            "patient_id": self.test_user_id
        }
        
        success, response = self.run_test("Authenticated Appointment", "POST", "/appointments", 200, 
                                        appointment_data, self.test_user_token)
        if success:
            assert 'id' in response, "Appointment should have an ID"
            print(f"   Appointment ID: {response['id']}")

    def test_get_user_appointments(self):
        """Test getting user's appointments"""
        if not self.test_user_token:
            print("   ⚠️  Skipped - No user token available")
            return
        
        success, response = self.run_test("Get User Appointments", "GET", "/appointments", 200, 
                                        token=self.test_user_token)
        if success:
            assert isinstance(response, list), "Appointments should be a list"
            print(f"   Found {len(response)} appointments for user")

    def test_get_admin_appointments(self):
        """Test getting all appointments as admin"""
        if not self.admin_token:
            print("   ⚠️  Skipped - No admin token available")
            return
        
        success, response = self.run_test("Get All Appointments (Admin)", "GET", "/appointments", 200, 
                                        token=self.admin_token)
        if success:
            assert isinstance(response, list), "Appointments should be a list"
            print(f"   Admin sees {len(response)} total appointments")

    def test_appointment_update_admin(self):
        """Test updating appointment status as admin"""
        if not self.admin_token or not self.test_appointment_id:
            print("   ⚠️  Skipped - Missing admin token or appointment ID")
            return
        
        update_data = {
            "status": "approved",
            "admin_notes": "Appointment approved by admin during testing"
        }
        
        success, response = self.run_test("Update Appointment (Admin)", "PATCH", 
                                        f"/appointments/{self.test_appointment_id}", 200, 
                                        update_data, self.admin_token)
        if success:
            assert response.get('status') == 'approved', "Status should be updated"
            print(f"   Updated status: {response.get('status')}")

    def test_appointment_update_unauthorized(self):
        """Test updating appointment without admin privileges (should fail)"""
        if not self.test_user_token or not self.test_appointment_id:
            print("   ⚠️  Skipped - Missing user token or appointment ID")
            return
        
        update_data = {
            "status": "completed",
            "admin_notes": "Unauthorized update attempt"
        }
        
        self.run_test("Unauthorized Appointment Update", "PATCH", 
                     f"/appointments/{self.test_appointment_id}", 403, 
                     update_data, self.test_user_token)

    def test_missing_doctor_appointment(self):
        """Test booking appointment with non-existent doctor"""
        appointment_data = {
            "patient_name": "Test Patient",
            "patient_email": "test@example.com",
            "patient_phone": "9999999999",
            "doctor_id": "non-existent-doctor-id",
            "preferred_date": (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d'),
            "symptoms": "Test symptoms"
        }
        
        self.run_test("Appointment with Missing Doctor", "POST", "/appointments", 404, appointment_data)

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🏥 Starting Coochbehar Polyclinic API Testing...")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic API tests
        self.test_root_endpoint()
        
        # Authentication tests
        self.test_user_registration()
        self.test_duplicate_registration()
        self.test_admin_login()
        self.test_invalid_login()
        self.test_get_user_profile()
        
        # Doctors API tests
        self.test_get_doctors()
        self.test_get_single_doctor()
        self.test_get_nonexistent_doctor()
        
        # Appointments API tests
        self.test_guest_appointment_booking()
        self.test_authenticated_appointment_booking()
        self.test_missing_doctor_appointment()
        self.test_get_user_appointments()
        self.test_get_admin_appointments()
        
        # Admin functionality tests
        self.test_appointment_update_admin()
        self.test_appointment_update_unauthorized()
        
        # Print final results
        self.print_results()

    def print_results(self):
        """Print final test results"""
        print("\n" + "=" * 60)
        print("🏥 TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        print(f"📈 Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"   • {test['name']}")
                if 'expected' in test and 'actual' in test:
                    print(f"     Expected: {test['expected']}, Got: {test['actual']}")
                if 'error' in test:
                    print(f"     Error: {test['error']}")
                print(f"     Endpoint: {test['endpoint']}")
        
        return len(self.failed_tests) == 0


def main():
    """Main test runner"""
    tester = PolyclinicAPITester()
    all_tests_passed = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if all_tests_passed else 1


if __name__ == "__main__":
    sys.exit(main())