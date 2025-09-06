import React, { useEffect } from 'react';
import { fetchRecords } from '@/utils/airtableService';

function Index() {
    const [records, setRecords] = React.useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await fetchRecords('interns_selection_2025', '', 'Name', 'asc');
                setRecords(data);
            } catch (error) {
                console.error('Error fetching records:', error);
            }
        };

        fetch();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {records.map((record, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow space-y-4"
                    >
                        <h1 className='text-2xl font-bold text-center'>{index + 1}</h1>
                        <h2 className="text-xl font-bold mb-2 text-gray-800 ">{record.fields.Name}</h2>
                        <p className="text-gray-600"><strong>Preferred Role:</strong> {record.fields.preferred_role}</p>
                        <p className="text-gray-600"><strong>Department:</strong> {record.fields.department}</p>
                        <p className="text-gray-600"><strong>Year:</strong> {record.fields.year}</p>
                        {/* <p className="text-gray-600"><strong>Admission No:</strong> {record.fields.Admission_No}</p> */}
                        {/* <p className="text-gray-600"><strong>Email:</strong> {record.fields.email}</p> */}
                        {/* <p className="text-gray-600"><strong>Phone Number:</strong> {record.fields.Phone_number}</p> */}
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
