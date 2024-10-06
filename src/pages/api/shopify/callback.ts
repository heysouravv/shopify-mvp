import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

if (!APP_URL) {
  throw new Error('Missing APP_URL environment variable');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shop, code } = req.query;

  if (!shop || !code) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Failed to get access token:', errorText);
      throw new Error(`Failed to get access token: ${tokenResponse.statusText}`);
    }

    const { access_token } = await tokenResponse.json();

    // Store the access token in Supabase
    const { data, error } = await supabase
      .from('shopify_stores')
      .upsert({
        shop_domain: shop,
        access_token: access_token,
      }, {
        onConflict: 'shop_domain'
      });

    if (error) {
      console.error('Error storing Shopify data:', error);
      throw new Error('Failed to store Shopify data');
    }

    // Set up webhooks (you'll need to implement this function)
    await setupWebhooks(shop as string, access_token);

    // Set a cookie to maintain the session
    res.setHeader('Set-Cookie', `shopify_shop=${shop}; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}`);

    // Redirect to the dashboard
    res.redirect(`${APP_URL}/dashboard/settings?connected=true&shop=${encodeURIComponent(shop as string)}`);
  } catch (error) {
    console.error('Error in Shopify OAuth process:', error);
    res.redirect(`${APP_URL}/dashboard/settings?error=${encodeURIComponent('Failed to complete Shopify OAuth process')}`);
  }
}

async function setupWebhooks(shop: string, accessToken: string) {
  // Implement webhook setup logic here
  console.log(`Setting up webhooks for ${shop}`);
  // Example webhook setup:
  // await createWebhook(shop, accessToken, 'orders/create', `${APP_URL}/api/webhooks/orders-create`);
}