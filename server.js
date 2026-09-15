import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const tableName = process.env.DYNAMODB_TABLE || 'TaskStreaks';
const region = process.env.AWS_REGION || 'ap-south-1';

const client = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(client);

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true, table: tableName, region });
});

app.get('/data', async (req, res) => {
  const { userId, key } = req.query;

  if (!userId || !key) {
    return res.status(400).json({ error: 'userId and key are required' });
  }

  try {
    const command = new GetCommand({
      TableName: tableName,
      Key: {
        userId: String(userId),
        itemId: `key#${String(key)}`,
      },
    });

    const result = await ddbDocClient.send(command);
    return res.json({ value: result.Item ? result.Item.value : null });
  } catch (error) {
    console.error('Read error:', error);
    return res.status(500).json({ error: 'Failed to read data' });
  }
});

app.put('/data', async (req, res) => {
  const { userId, key, value } = req.body || {};

  if (!userId || !key) {
    return res.status(400).json({ error: 'userId and key are required' });
  }

  try {
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        userId: String(userId),
        itemId: `key#${String(key)}`,
        type: 'key-value',
        key: String(key),
        value,
        updatedAt: new Date().toISOString(),
      },
    });

    await ddbDocClient.send(command);
    return res.json({ ok: true });
  } catch (error) {
    console.error('Write error:', error);
    return res.status(500).json({ error: 'Failed to write data' });
  }
});

app.get('/items', async (req, res) => {
  const { userId, type } = req.query;

  if (!userId || !type) {
    return res.status(400).json({ error: 'userId and type are required' });
  }

  try {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'userId = :userId AND begins_with(itemId, :typePrefix)',
      ExpressionAttributeValues: {
        ':userId': String(userId),
        ':typePrefix': `${String(type)}#`,
      },
    });

    const result = await ddbDocClient.send(command);
    return res.json({ items: result.Items || [] });
  } catch (error) {
    console.error('Query error:', error);
    return res.status(500).json({ error: 'Failed to query items' });
  }
});

app.listen(port, () => {
  console.log(`TaskStreaks API listening on http://localhost:${port}`);
});
