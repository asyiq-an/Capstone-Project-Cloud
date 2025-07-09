import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('CartItems')  # Replace with your table name

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        user_id = body.get('user_id')

        if not user_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing user_id'})
            }

        # Step 1: Query all items for the user
        response = table.query(
            KeyConditionExpression=Key('UserID').eq(user_id)
        )

        items = response.get('Items', [])

        if not items:
            return {
                'statusCode': 200,
                'body': json.dumps({'message': 'Cart already empty'})
            }

        # Step 2: Batch delete items (max 25 per request)
        with table.batch_writer() as batch:
            for item in items:
                batch.delete_item(
                    Key={
                        'UserID': user_id,
                        'CartItemID': item['CartItemID']
                    }
                )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Cart cleared successfully'})
        }

    except Exception as e:
        print("Error:", e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to clear cart'})
        }

# Asyiq