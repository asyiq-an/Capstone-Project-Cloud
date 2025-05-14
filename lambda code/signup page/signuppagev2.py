import json
import boto3
from botocore.exceptions import ClientError
import hashlib
import os

# DynamoDB setup
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('userlogininfo')  # Replace with your DynamoDB table name

# Function to hash the password with SHA256 and a salt
def hash_password(password):
    salt = os.urandom(16)  # Generate a random salt
    salted_password = salt + password.encode('utf-8')  # Concatenate salt and password
    hashed_password = hashlib.sha256(salted_password).hexdigest()  # SHA256 hash the salted password
    return salt.hex(), hashed_password  # Return the salt and hashed password in hexadecimal

def lambda_handler(event, context):
    try:
        # Parse request body
        body = json.loads(event['body'])

        full_name = body.get('fullName')
        email = body.get('email')
        password = body.get('password')
        phone = body.get('phone')

        # Input validation
        if not all([full_name, email, password, phone]):
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Missing required fields'})
            }

        # Check if the email already exists
        response = table.get_item(Key={'email': email})
        if 'Item' in response:
            return {
                'statusCode': 409,  # Conflict
                'body': json.dumps({'message': 'Email already exists'})
            }

        # Hash the password with salt before storing
        salt, hashed_password = hash_password(password)

        # Insert new user
        table.put_item(
            Item={
                'email': email,
                'fullName': full_name,
                'password': hashed_password,
                'salt': salt,  # Store the salt along with the password
                'phone': phone
            }
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Signup successful'})
        }

    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'DynamoDB error', 'error': str(e)})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error', 'error': str(e)})
        }
