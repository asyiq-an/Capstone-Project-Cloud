import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.client("dynamodb")
TABLE_NAME = "CartItems"

def lambda_handler(event, context):
    user_id = event.get("queryStringParameters", {}).get("user_id")
    
    if not user_id:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing user_id"})
        }

    try:
        response = dynamodb.query(
            TableName=TABLE_NAME,
            KeyConditionExpression="UserID = :uid",
            ExpressionAttributeValues={
                ":uid": {"S": user_id}
            }
        )

        items = response.get("Items", [])
        cart_items = []

        for item in items:
            cart_items.append({
                "cart_item_id": item.get("CartItemID", {}).get("S", ""),
                "item_id": item.get("ItemID", {}).get("S", ""),
                "name": item.get("ItemName", {}).get("S", ""),
                "quantity": int(item.get("Quantity", {}).get("N", "1")),
                "price": float(item.get("Price", {}).get("N", "0")),
                "special_request": item.get("SpecialRequest", {}).get("S", ""),
                "location": item.get("Location", {}).get("S", ""),
                "pickup_time": item.get("PickupTime", {}).get("S", "")
            })

        result = {
            "user_id": user_id,
            "cart": cart_items
        }

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(result)
        }

    except Exception as e:
        print(f"Error querying DynamoDB: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Failed to fetch cart"})
        }

# Asyiq