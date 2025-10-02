import React, { useEffect, useState } from 'react';
import { fetchRecords } from '@/utils/airtableService';

function Index() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  // Fetch data from Airtable
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchRecords('interns_selection_2025', '', 'Name', 'asc');
        setRecords(data);
        setFilteredRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false); // ✅ Stop loading after fetch
      }
    };

    fetch();
  }, []);

  // Apply filters whenever searchTerm or selectedYear changes
  useEffect(() => {
    let temp = [...records];

    if (searchTerm.trim() !== '') {
      temp = temp.filter((record) =>
        record.fields.Name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedYear !== 'All') {
      temp = temp.filter((record) => record.fields.year === selectedYear);
    }

    setFilteredRecords(temp);
  }, [searchTerm, selectedYear, records]);

  const yearOptions = ['All', ...new Set(records.map((r) => r.fields.year).filter(Boolean))];

  // ✅ Show spinner while loading
  if (loading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <div className="border-4 border-orange-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        <span className="ml-4 text-lg text-gray-600">Loading records...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Intern Hiring Registrations 2026</h1>

      <div className="mb-6 text-center">
        <p className="text-lg text-gray-700">
          Below is the list of all students who have registered for the Connect Intern Hiring 2026.
          <br />
          We will be contacting the shortlisted candidates soon. Stay tuned!
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
        <input
          type="text"
          placeholder="Search by Name"
          className="border p-2 rounded w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full md:w-48"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {yearOptions.map((year, index) => (
            <option key={index} value={year}>
              {year === 'All' ? 'All Years' : `Year ${year}`}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center mb-4 font-medium text-gray-800">
        Total Registrations: {filteredRecords.length}
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow space-y-4"
          >
            <h1 className="text-2xl font-bold text-center">{index + 1}</h1>
            <h2 className="text-xl font-bold mb-2 text-gray-800">{record.fields.Name}</h2>
            <p className="text-gray-600"><strong>Preferred Role:</strong> {record.fields.preferred_role}</p>
            <p className="text-gray-600"><strong>Department:</strong> {record.fields.department}</p>
            <p className="text-gray-600"><strong>Year:</strong> {record.fields.year}</p>
            <p className="text-gray-600"><strong>Hobby:</strong> {record.fields.hobby}</p>
            <p className="text-gray-600"><strong>Expectations:</strong> {record.fields.expectations}</p>
            <p className="text-gray-600"><strong>How did you hear:</strong> {record.fields.how_did_you_hear}</p>
            <p className="text-gray-600"><strong>Interesting Fact:</strong> {record.fields.interesting_fact}</p>
            <p className="text-gray-600"><strong>Other Communities:</strong> {record.fields.other_communities}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Index;
