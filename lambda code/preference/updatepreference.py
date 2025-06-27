import json
import boto3

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = "preferences"

def lambda_handler(event, context):
    # 1) Parse incoming event body
    try:
        payload = json.loads(event['body'])
        item    = payload.get('Item', {})
    except (KeyError, TypeError, json.JSONDecodeError):
        return _respond(400, {"error": "Invalid request format; must include Item."})

    # 2) Ensure email is present
    email_wrapped = item.get('email')
    if not email_wrapped or 'S' not in email_wrapped:
        return _respond(400, {"error": "Missing or invalid email in Item."})
    email_val = email_wrapped['S']

    # 3) Extract all other attributes to update
    updates = {
        attr: wrapped['S']
        for attr, wrapped in item.items()
        if attr != 'email' and isinstance(wrapped, dict) and 'S' in wrapped
    }
    if not updates:
        return _respond(400, {"error": "No preference fields to update."})

    # 4) Build the UpdateExpression
    expr_names  = {f"#{k}": k for k in updates}
    expr_values = {f":{k}": v for k, v in updates.items()}
    set_clauses = ", ".join(f"#{k} = :{k}" for k in updates)
    update_expr = f"SET {set_clauses}"

    # 5) Perform the update
    table = dynamodb.Table(TABLE_NAME)
    try:
        resp = table.update_item(
            Key={'email': email_val},
            UpdateExpression=update_expr,
            ExpressionAttributeNames=expr_names,
            ExpressionAttributeValues=expr_values,
            ReturnValues="UPDATED_NEW"
        )
    except Exception as e:
        return _respond(500, {"error": str(e)})

    # 6) Return only newly‑updated attributes
    return _respond(200, resp.get('Attributes', {}))


def _respond(status_code, body_dict):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body_dict)
    }

# Asyiq