import React, { useState, useEffect } from 'react';

function DataAnalysis() {
  const [healthCheckStatus, setHealthCheckStatus] = useState(null); // To store the API response
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To handle errors

  // Function to call the API
  const fetchHealthCheck = async () => {
    try {
      setLoading(true); // Start loading
      console.log('Fetching health check status...');

      // Call the backend API on port 3000
      const response = await fetch('http://localhost:3001/admin/healthcheck'); // Update the URL with the correct backend server

      // Log the raw response object
      console.log('Raw Response:', response);

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text(); // Log the raw text response for debugging
        console.log('Raw Text Response:', text);
        throw new Error('Invalid JSON response');
      }

      const data = await response.json(); // Parse the JSON
      console.log('Parsed JSON Response:', data); // Log the JSON response

      setHealthCheckStatus(data); // Set state with the response data
      setError(null); // Clear any errors
    } catch (err) {
      console.error('Error fetching health check:', err.message); // Log the error message
      setError(err.message); // Set the error message for display
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Use useEffect to fetch data when the component loads
  useEffect(() => {
    fetchHealthCheck();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Data Analysis</h1>
      {loading && <p>Loading health check status...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {healthCheckStatus && (
        <div>
          <h2>Health Check Status</h2>
          <pre>{JSON.stringify(healthCheckStatus, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default DataAnalysis;
