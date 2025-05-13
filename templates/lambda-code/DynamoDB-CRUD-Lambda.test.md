This Python script is meant to be deployed as an **AWS Lambda function** integrated with **API Gateway** to perform CRUD (Create, Read, Update, Delete) operations on a **DynamoDB** table. Here's a step-by-step guide to help you **use this code**:

---

## 🧠 What this code does:

* Responds to HTTP requests from API Gateway (`GET`, `POST`, `PUT`, `DELETE`)
* Performs DynamoDB operations based on the HTTP method
* Returns JSON responses

---

## 🛠️ How to Use This Code

### 1. **Set Up DynamoDB Table**

Make sure you have a DynamoDB table already created. For example:

* Table Name: `Users`
* Primary Key: `UserID` (string)

---

### 2. **Create an AWS Lambda Function**

1. Go to AWS Lambda Console.
2. Click **"Create function"** → Choose **Author from scratch**.
3. Give it a name (e.g., `DynamoDBLambdaHandler`).
4. Choose **Python 3.x** as the runtime.
5. Create or select an existing **IAM Role** that has **LabRolesmtg**.
6. Click **Create function**.

---

### 3. **Add the Code**

* Paste your code in the **function code editor <3** (or upload a ZIP if you’re using packages).
* If you're using the **editor**, put the code into `lambda_function.py`.

---

### 4. **Set up API Gateway Trigger**

1. Click **Add trigger** → Select **API Gateway**.
2. Create a new API (REST API or HTTP API).
3. Deploy the API.

---

### 5. **Test the API**

Use a tool like **Postman**, **curl**, or your browser for testing:

### Example: GET request (Scan table)

```bash
curl "https://<your-api-id>.execute-api.<region>.amazonaws.com/<stage>?TableName=Users"
```

### Example: POST request (Put item)

```bash
curl -X POST "https://<your-api-id>.execute-api.<region>.amazonaws.com/<stage>" \
  -H "Content-Type: application/json" \
  -d '{"TableName": "Users", "Item": {"UserID": {"S": "123"}, "Name": {"S": "Alice"}}}'
```

### Example: DELETE request (Delete item)

```bash
curl -X DELETE "https://<your-api-id>.execute-api.<region>.amazonaws.com/<stage>" \
  -H "Content-Type: application/json" \
  -d '{"TableName": "Users", "Key": {"UserID": {"S": "123"}}}'
```

### Example: PUT request (Update item)

```bash
curl -X PUT "https://<your-api-id>.execute-api.<region>.amazonaws.com/<stage>" \
  -H "Content-Type: application/json" \
  -d '{"TableName": "Users", "Key": {"UserID": {"S": "123"}}, "UpdateExpression": "SET #n = :name", "ExpressionAttributeNames": {"#n": "Name"}, "ExpressionAttributeValues": {":name": {"S": "Updated Alice"}}}'
```

---

## ✅ Notes & Best Practices

* **IAM Permissions**: Ensure the Lambda role has `dynamodb:*` or appropriate permissions for your operations.
* **Security**: Add authentication (e.g., AWS IAM, JWT, API Key) to your API Gateway to avoid exposing it publicly.
* **Validation**: Add input validation and error handling for production use.

---

If you're still setting up your environment and need help with the IAM role, API Gateway stages, or payload structure, let me know and I can walk you through those too.
