import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('cookies')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        session_token = body.get('sessionToken')

        if not session_token:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Session token required'})
            }

        response = table.get_item(Key={'sessionToken': session_token})

        if 'Item' not in response:
            return {
                'statusCode': 401,
                'body': json.dumps({'message': 'Invalid or expired session'})
            }

        session = response['Item']
        return {
            'statusCode': 200,
            'body': json.dumps({
                'email': session['email'],
                'fullName': session['fullName']
            })
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
