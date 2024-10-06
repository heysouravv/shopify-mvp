import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Page, Card, DataTable, Spinner, Button, Banner } from '@shopify/polaris';
import axios from 'axios';

interface SalesData {
  date: string;
  orders: number;
  revenue: number;
}

const Dashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setConnected(params.get('connected') === 'true');
    setError(params.get('error') || '');

    const fetchSalesData = async () => {
      try {
        // In a real app, you would make an API call to your backend, which would then use the Shopify API
        const response = await axios.get('/api/sales-data');
        setSalesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError('Failed to fetch sales data');
        setLoading(false);
      }
    };

    if (connected) {
      fetchSalesData();
    } else {
      setLoading(false);
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post('/api/shopify/logout');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      setError('Failed to log out');
    }
  };

  const rows = salesData.map((data) => [
    data.date,
    data.orders,
    `$${data.revenue.toFixed(2)}`,
  ]);

  return (
    <Page
      title="Sales Dashboard"
      primaryAction={
        connected && (
          <Button onClick={handleLogout} destructive>
            Disconnect Store
          </Button>
        )
      }
    >
      {error && (
        <Banner status="critical">
          <p>{error}</p>
        </Banner>
      )}
      {connected && (
        <Banner status="success" title="Store connected successfully">
          <p>Your Shopify store is now connected to the app.</p>
        </Banner>
      )}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="large" />
          </div>
        ) : connected ? (
          <DataTable
            columnContentTypes={['text', 'numeric', 'numeric']}
            headings={['Date', 'Orders', 'Revenue']}
            rows={rows}
          />
        ) : (
          <div className="text-center p-4">
            <p>Connect your Shopify store to view sales data.</p>
            <Button onClick={() => navigate('/')} primary>
              Connect Store
            </Button>
          </div>
        )}
      </Card>
    </Page>
  );
};

export default Dashboard;