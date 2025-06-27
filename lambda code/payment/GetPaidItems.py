import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('paiditems')

# Helper function to convert Decimal to float or int
def decimal_default(obj):
    if isinstance(obj, Decimal):
        # Convert to float or int as appropriate
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    raise TypeError

def lambda_handler(event, context):
    print("Event received:", event)
    order_id = event.get("queryStringParameters", {}).get("order_id")
    print("Order ID:", order_id)

    if not order_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing order_id"})
        }

    try:
        response = table.query(
            KeyConditionExpression=Key('order_id').eq(order_id)
        )
        print("DynamoDB query response:", response)
        items = response.get('Items', [])

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"items": items}, default=decimal_default)
        }

    except Exception as e:
        print("Exception occurred:", repr(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error", "message": str(e)})
        }
# Asyiq