import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('preferences')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])

        # Required field
        email = body.get("email")
        if not email:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Missing email in request."})
            }

        # Remove email key to get the rest of the preferences
        preferences = {k: v for k, v in body.items() if k != "email"}

        # Save or overwrite the full item
        table.put_item(
            Item={
                "email": email,
                **preferences
            }
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Preferences saved successfully."})
        }

    except Exception as e:
        print("Error saving preferences:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error."})
        }

# Asyiq