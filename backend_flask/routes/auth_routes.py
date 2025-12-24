from flask import Blueprint, request, jsonify
from models.user_model import User
from flask_jwt_extended import create_access_token
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')

    if not name or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    if User.find_by_email(email):
        return jsonify({"message": "User already exists"}), 400

    user_id = User.create_user(name, email, password, role)
    if user_id:
        return jsonify({"message": "User registered successfully", "userId": user_id}), 201
    return jsonify({"message": "Error registering user"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user_row = User.find_by_email(email)
    if user_row and User.verify_password(user_row['password'], password):
        # Create JWT token
        token = create_access_token(identity=user_row['id'], additional_claims={"role": user_row['role']}, expires_delta=datetime.timedelta(days=1))
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user_row['id'],
                "name": user_row['name'],
                "role": user_row['role']
            }
        }), 200
    
    return jsonify({"message": "Invalid credentials"}), 401
