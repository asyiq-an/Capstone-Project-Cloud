import json
import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('cookies')  # DynamoDB table name

def lambda_handler(event, context):
    try:
        # Parse JSON body
        body = json.loads(event.get('body', '{}'))
        session_id = body.get('sessionId')

        if not session_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'sessionId is required'})
            }

        # Scan the table for matching sessionId (since sessionId is not partition key)
        response = table.scan(
            FilterExpression=Attr('sessionId').eq(session_id)
        )

        items = response.get('Items', [])

        if not items:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Session not found'})
            }

        user = items[0]  # assuming unique sessionId

        # Prepare user info response
        user_info = {
            'email': user.get('email'),
            'createdAt': user.get('createdAt'),
            'fullName': user.get('fullName'),
            'phone': user.get('phone'),
            'sessionId': user.get('sessionId')
        }

        return {
            'statusCode': 200,
            'body': json.dumps(user_info)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
