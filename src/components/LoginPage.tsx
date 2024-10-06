import React, { useState } from 'react';
import { Button, Card, Page, TextField } from '@shopify/polaris';
import { ShoppingBag } from 'lucide-react';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [storeUrl, setStoreUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/shopify/connect', { storeUrl });
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Error initiating Shopify OAuth:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center">
              <ShoppingBag size={48} className="text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-center">Shopify Sales App</h1>
            <p className="text-center text-gray-600">
              Sign in with your Shopify store to view your sales data.
            </p>
            <TextField
              label="Store URL"
              type="text"
              value={storeUrl}
              onChange={setStoreUrl}
              placeholder="yourstorename.myshopify.com"
            />
            <Button onClick={handleLogin} fullWidth loading={isLoading}>
              Connect Shopify Store
            </Button>
          </div>
        </Card>
      </div>
    </Page>
  );
};

export default LoginPage;