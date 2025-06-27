import json
import boto3
import uuid
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('CartItems')

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        user_id = body.get('user_id')
        item_name = body.get('item_name')
        quantity = int(body.get('quantity'))
        price = Decimal(str(body.get('price')))
        location = body.get('location')
        pickup_time = body.get('pickup_time')
        special_request = body.get('special_request', '')

        if not all([user_id, item_name, quantity, price, location, pickup_time]):
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing required fields"})
            }

        cart_item_id = str(uuid.uuid4())

        table.put_item(Item={
            'UserID': user_id,
            'CartItemID': cart_item_id,
            'ItemName': item_name,
            'Quantity': quantity,
            'Price': price,
            'Location': location,
            'PickupTime': pickup_time,
            'SpecialRequest': special_request
        })

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Item added to cart", "cart_item_id": cart_item_id})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
