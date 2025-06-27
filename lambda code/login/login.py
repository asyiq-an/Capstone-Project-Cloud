import json
import boto3
import hashlib
from botocore.exceptions import ClientError
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
user_table = dynamodb.Table('userlogininfo')
cookies_table = dynamodb.Table('cookies')  # assuming this table already exists

def hash_password_with_salt(password, salt_hex):
    salt = bytes.fromhex(salt_hex)
    salted_password = salt + password.encode('utf-8')
    hashed_password = hashlib.sha256(salted_password).hexdigest()
    return hashed_password

def lambda_handler(event, context):
    try:
        print("Received event:", event)

        body = json.loads(event.get('body', '{}'))
        email = body.get('email')
        password = body.get('password')
        session_id = body.get('sessionId', '')

        if not email or not password:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Email and password are required'})
            }

        response = user_table.get_item(Key={'email': email})
        if 'Item' not in response:
            return {
                'statusCode': 401,
                'body': json.dumps({'message': 'Invalid email or password'})
            }

        user = response['Item']
        stored_salt = user['salt']
        stored_hashed_password = user['password']

        input_hashed_password = hash_password_with_salt(password, stored_salt)

        if input_hashed_password != stored_hashed_password:
            return {
                'statusCode': 401,
                'body': json.dumps({'message': 'Invalid email or password'})
            }

        if session_id:
            # Update user record with the session ID
            user_table.update_item(
                Key={'email': email},
                UpdateExpression="SET lastLoginCookie = :cookie, lastLoginTimestamp = :ts",
                ExpressionAttributeValues={
                    ':cookie': session_id,
                    ':ts': datetime.utcnow().isoformat()
                }
            )

            # Store the session info in the cookies table
            cookies_table.put_item(
                Item={
                    'sessionId': session_id,
                    'email': email,
                    'fullName': user.get('fullName', ''),
                    'phone': user.get('phone', ''),
                    'createdAt': datetime.utcnow().isoformat()
                }
            )

            print(f"Updated user and cookie table for {email} with sessionId {session_id}")

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Login successful',
                'email': user['email'],
                'fullName': user.get('fullName', ''),
                'phone': user.get('phone', ''),
                'sessionId': session_id  # return it to client if needed
            }),
        }

    except ClientError as e:
        print(f"DynamoDB ClientError: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'DynamoDB error', 'error': str(e)})
        }

    except Exception as e:
        print(f"Internal error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error', 'error': str(e)})
        }
