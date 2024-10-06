import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from '@shopify/polaris';
import axios from 'axios';

const OAuthHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const shop = params.get('shop');

      if (code && shop) {
        try {
          // In a real app, you would make a request to your backend to exchange the code for an access token
          // For this example, we'll simulate a successful authentication
          console.log('Received OAuth code:', code);
          console.log('Shop:', shop);
          
          // Simulate API call to exchange code for access token
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Store the access token and shop in localStorage (in a real app, use more secure storage)
          localStorage.setItem('shopifyAccessToken', 'simulated_access_token');
          localStorage.setItem('shopifyShop', shop);

          // Redirect to dashboard
          navigate('/dashboard');
        } catch (error) {
          console.error('Error during OAuth:', error);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    handleOAuth();
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner size="large" />
    </div>
  );
};

export default OAuthHandler;