import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { saveAs } from 'file-saver'; // For downloading files

function DataAnalysis() {
  const [healthCheckStatus, setHealthCheckStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [selectedStations, setSelectedStations] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const companies = ['Company A', 'Company B', 'Company C', 'Company D', 'Company E', 'Company F', 'Company G'];

  // State for controlling visibility of lists
  const [showStations, setShowStations] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);

  // Mock data for stations
  const fetchStations = async () => {
    const stationData = Array.from({ length: 254 }, (_, i) => `Station ${i + 1}`);
    setStations(stationData);
  };

  // Mock data for charts
  const generateChartData = () => {
    return selectedStations.map((station, index) => ({
      name: station,
      value: Math.floor(Math.random() * 100), // Random data for demonstration
    }));
  };

  const [chartData, setChartData] = useState([]);

  // Fetch health check data based on filters
  const fetchHealthCheck = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (finishDate) queryParams.append('finishDate', finishDate);
      if (selectedStations.length > 0) queryParams.append('stations', selectedStations.join(','));
      if (selectedCompanies.length > 0) queryParams.append('companies', selectedCompanies.join(','));

      const url = `http://localhost:3000/admin/healthcheck?${queryParams.toString()}`;
      console.log('Fetching data from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setHealthCheckStatus(data);

      // Generate chart data based on selected stations
      setChartData(generateChartData());
    } catch (err) {
      console.error('Error fetching health check:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedFetchHealthCheck = debounce(fetchHealthCheck, 500);

  // Fetch stations on component mount
  useEffect(() => {
    fetchStations();
  }, []);

  // Refetch data on filter change
  useEffect(() => {
    debouncedFetchHealthCheck();
  }, [startDate, finishDate, selectedStations, selectedCompanies]);

  // Handle station checkbox change
  const handleStationCheckboxChange = (station) => {
    setSelectedStations((prevSelected) =>
      prevSelected.includes(station)
        ? prevSelected.filter((s) => s !== station) // Deselect
        : [...prevSelected, station] // Select
    );
  };

  // Handle company checkbox change
  const handleCompanyCheckboxChange = (company) => {
    setSelectedCompanies((prevSelected) =>
      prevSelected.includes(company)
        ? prevSelected.filter((c) => c !== company) // Deselect
        : [...prevSelected, company] // Select
    );
  };

  // Select/Deselect all stations
  const handleSelectAllStations = () => {
    setSelectedStations(selectedStations.length === stations.length ? [] : stations);
  };

  // Select/Deselect all companies
  const handleSelectAllCompanies = () => {
    setSelectedCompanies(selectedCompanies.length === companies.length ? [] : companies);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setStartDate('');
    setFinishDate('');
    setSelectedStations([]);
    setSelectedCompanies([]);
  };

  // Download chart data as CSV
  const downloadChartData = (data, filename) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      data.map((row) => `${row.name},${row.value}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        backgroundImage: 'url("https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2v")', // Use the provided image URL
        backgroundSize: 'cover', // Ensure the image covers the entire background
        backgroundPosition: 'center', // Center the background image
        minHeight: '100vh', // Ensure the background covers the entire viewport
        color: '#ffffff', // Set text color to white for better contrast
      }}
    >
      <h1>Data Analysis</h1>

      {/* Filters Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '20px',
          marginTop: '10px',
          flexWrap: 'wrap',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background for better readability
          padding: '10px',
          borderRadius: '8px',
        }}
      >
        {/* Start Date */}
        <label style={{ flexShrink: 0 }}>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </label>

        {/* Finish Date */}
        <label style={{ flexShrink: 0 }}>
          Finish Date:
          <input
            type="date"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </label>

        {/* Stations Filter */}
        <div style={{ flexShrink: 0, position: 'relative' }}>
          <label>
            Stations:
            <button
              onClick={() => setShowStations(!showStations)}
              style={{
                marginLeft: '5px',
                width: '60px', // Fixed width for the button
                textAlign: 'center', // Center the text inside the button
              }}
            >
              {showStations ? 'Hide' : 'Show'}
            </button>
          </label>
          {showStations && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px',
                marginTop: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
                minWidth: '200px',
              }}
            >
              {/* Select All Stations Checkbox */}
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedStations.length === stations.length}
                    onChange={handleSelectAllStations}
                    indeterminate={
                      selectedStations.length > 0 && selectedStations.length < stations.length
                    }
                  />
                  <strong>Select All</strong>
                </label>
              </div>
              {/* List of Stations */}
              {stations.map((station, index) => (
                <div key={index} style={{ whiteSpace: 'nowrap' }}>
                  <label>
                    <input
                      type="checkbox"
                      value={station}
                      checked={selectedStations.includes(station)}
                      onChange={() => handleStationCheckboxChange(station)}
                    />
                    {station}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Companies Filter */}
        <div style={{ flexShrink: 0, position: 'relative' }}>
          <label>
            Companies:
            <button
              onClick={() => setShowCompanies(!showCompanies)}
              style={{
                marginLeft: '5px',
                width: '60px', // Fixed width for the button
                textAlign: 'center', // Center the text inside the button
              }}
            >
              {showCompanies ? 'Hide' : 'Show'}
            </button>
          </label>
          {showCompanies && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px',
                marginTop: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
                minWidth: '200px',
              }}
            >
              {/* Select All Companies Checkbox */}
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedCompanies.length === companies.length}
                    onChange={handleSelectAllCompanies}
                    indeterminate={
                      selectedCompanies.length > 0 && selectedCompanies.length < companies.length
                    }
                  />
                  <strong>Select All</strong>
                </label>
              </div>
              {/* List of Companies */}
              {companies.map((company, index) => (
                <div key={index} style={{ whiteSpace: 'nowrap' }}>
                  <label>
                    <input
                      type="checkbox"
                      value={company}
                      checked={selectedCompanies.includes(company)}
                      onChange={() => handleCompanyCheckboxChange(company)}
                    />
                    {company}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={fetchHealthCheck}
          disabled={loading}
          style={{ padding: '5px 10px', flexShrink: 0, backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          Apply Filters
        </button>

        {/* Clear Filters Button */}
        <button
          onClick={handleClearFilters}
          style={{ padding: '5px 10px', flexShrink: 0, backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '4px' }}
        >
          Clear Filters
        </button>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Left Chart (Bar Chart) */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <h2>Bar Chart</h2>
          <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
          <button
            onClick={() => downloadChartData(chartData, 'bar_chart_data.csv')}
            style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            Download Bar Chart Data
          </button>
        </div>

        {/* Right Chart (Line Chart) */}
        <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <h2>Line Chart</h2>
          <LineChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
          <button
            onClick={() => downloadChartData(chartData, 'line_chart_data.csv')}
            style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            Download Line Chart Data
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && <p>Loading health check status...</p>}

      {/* Error State */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Success State */}
      {healthCheckStatus && (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px', borderRadius: '4px', marginTop: '20px' }}>
          <h2>Health Check Status</h2>
          <pre>{JSON.stringify(healthCheckStatus, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default DataAnalysis;