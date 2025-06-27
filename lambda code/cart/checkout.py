import json
import boto3
import uuid
from datetime import datetime
from decimal import Decimal
import traceback

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('paiditems')

def lambda_handler(event, context):
    try:
        print("Received event:", event)
        
        if 'body' not in event or not event['body']:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing request body"})
            }
        
        body = json.loads(event['body'])
        cart_items = body.get('cartItems', [])

        if not cart_items:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Cart is empty."})
            }

        order_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        with table.batch_writer() as batch:
            for item in cart_items:
                try:
                    item_id = item.get("cart_item_id") or str(uuid.uuid4())
                    name = str(item.get("name", ""))
                    quantity = Decimal(str(item.get("quantity", 1)))
                    price = Decimal(str(item.get("price", 0)))
                    location = str(item.get("location", ""))
                    pickup_time = str(item.get("pickup_time", ""))
                    special_request = str(item.get("special_request", ""))
                except Exception as e:
                    print(f"Error parsing item fields: {e}")
                    return {
                        "statusCode": 400,
                        "body": json.dumps({"error": "Invalid item fields"})
                    }

                batch.put_item(
                    Item={
                        "order_id": order_id,
                        "item_id": item_id,
                        "name": name,
                        "quantity": quantity,
                        "price": price,
                        "location": location,
                        "pickup_time": pickup_time,
                        "special_request": special_request,
                        "timestamp": timestamp,
                    }
                )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Order saved successfully.", "order_id": order_id})
        }

    except Exception as e:
        print("Exception occurred:", str(e))
        print(traceback.format_exc())
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal server error."})
        }

# Asyiq