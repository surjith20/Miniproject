from flask import Blueprint, request, jsonify
from models.inspection_model import Inspection
from flask_jwt_extended import jwt_required

inspection_bp = Blueprint('inspections', __name__)

@inspection_bp.route('', methods=['GET'])
@jwt_required()
def get_inspections():
    inspections = Inspection.get_all()
    return jsonify([dict(row) for row in inspections]), 200

@inspection_bp.route('/schedule', methods=['POST'])
@jwt_required()
def schedule_inspection():
    data = request.get_json()
    # application_id, inspector_name, date
    if not data.get('application_id') or not data.get('date'):
        return jsonify({"message": "Missing data"}), 400
        
    Inspection.create(data['application_id'], data.get('inspector_name', 'Assigned Inspector'), data['date'])
    return jsonify({"message": "Inspection scheduled"}), 201

@inspection_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_inspection(id):
    data = request.get_json()
    status = data.get('status')
    remarks = data.get('remarks')
    
    if status and remarks:
        Inspection.update_result(id, status, remarks)
        return jsonify({"message": "Inspection updated"}), 200
    return jsonify({"message": "Incomplete data"}), 400
