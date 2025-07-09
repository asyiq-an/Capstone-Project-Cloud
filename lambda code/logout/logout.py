import boto3
import json
import os

TABLE_NAME = os.environ.get("COOKIES_TABLE", "cookies")
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))
        email = body.get("email")

        if not email:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing email in request body"})
            }

        table.delete_item(
            Key={
                'email': email
            }
        )

        return {
            "statusCode": 200,
            
            "body": json.dumps({"message": "Session deleted"})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
