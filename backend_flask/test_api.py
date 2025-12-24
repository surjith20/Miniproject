import requests
import json

BASE_URL = "http://127.0.0.1:5000/api"

def run_tests():
    print(f"Testing API at {BASE_URL}...")
    
    # 1. Health Check
    try:
        resp = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {resp.status_code} - {resp.json()}")
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return

    # 2. Register User
    email = f"test_{json.dumps(str(requests.utils.quote('user')))[1:-1]}_{id(object)}@example.com" # simplified random email
    # Let's just use a random email
    import random
    email = f"test_{random.randint(1000,9999)}@example.com"
    
    print(f"Registering user {email}...")
    resp = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Test User",
        "email": email,
        "password": "Password123",
        "role": "applicant"
    })
    print(f"Register: {resp.status_code}")
    
    # 3. Login
    print("Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": "Password123"
    })
    print(f"Login: {resp.status_code}")
    
    if resp.status_code == 200:
        token = resp.json()['token']
        headers = {'Authorization': f'Bearer {token}'}
        
        # 4. Create Application
        print("Creating Application...")
        resp = requests.post(f"{BASE_URL}/applications", json={
            "businessName": "Test Biz",
            "businessType": "commercial",
            "address": "123 Test St"
        }, headers=headers)
        print(f"Create App: {resp.status_code}")
        
        if resp.status_code == 201:
            app_id = resp.json().get('applicationId')
            print(f"Created Application ID: {app_id}")
            
            # 5. Get Application
            print("Fetching Application...")
            resp = requests.get(f"{BASE_URL}/applications/{app_id}", headers=headers)
            print(f"Get App: {resp.status_code} - Status: {resp.json().get('status')}")

if __name__ == "__main__":
    run_tests()
