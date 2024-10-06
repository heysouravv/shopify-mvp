import { NextApiRequest, NextApiResponse } from 'next';

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_SCOPES = 'read_products,read_orders,read_customers';
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received POST request to /api/shopify/connect');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { storeUrl } = req.body;
  console.log('Received storeUrl:', storeUrl);

  if (!storeUrl) {
    console.error('Error: Store URL is required');
    return res.status(400).json({ error: 'Store URL is required' });
  }

  console.log('SHOPIFY_API_KEY:', SHOPIFY_API_KEY);
  console.log('SHOPIFY_SCOPES:', SHOPIFY_SCOPES);
  console.log('REDIRECT_URI:', REDIRECT_URI);

  const shopName = storeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  console.log('Processed shopName:', shopName);

  const authUrl = `https://${shopName}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SHOPIFY_SCOPES}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  console.log('Generated authUrl:', authUrl);

  res.status(200).json({ authUrl });
}