import React, { useState } from 'react';

const ApplicationsTable = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: 'Ravi Kumar',
      program: 'B.Tech CSE',
      email: 'ravi@example.com',
      phone: '9876543210',
      education: '12th CBSE - 89%',
      skills: 'Python, React',
      marks: '',
      status: 'Pending',
      remarks: ''
    },
    {
      id: 2,
      name: 'Sneha Das',
      program: 'MBA',
      email: 'sneha@example.com',
      phone: '9994443210',
      education: 'BBA - 75%',
      skills: 'Marketing, Excel',
      marks: '',
      status: 'Pending',
      remarks: ''
    },
    // Add 4 more applicants similarly...
  ]);

  const handleInputChange = (id, field, value) => {
    const updated = applications.map(app =>
      app.id === id ? { ...app, [field]: value } : app
    );
    setApplications(updated);
  };

  const handleSave = (id) => {
    const applicant = applications.find(app => app.id === id);
    console.log('Saved Review for ID', id, applicant);
    alert(`Saved review for ${applicant.name}`);
  };

  return (
    <div>
      <h2>Admission Evaluation</h2>

        <div className="flex items-center justify-center h-screen">
  <p className="text-center text-3xl font-bold text-gray-600">
    This section is under development — check back later for updates.
  </p>
</div>
      {/* {applications.map(app => (
        <div key={app.id} style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '16px' }}>
          <h3>{app.name} ({app.program})</h3>
          <p><strong>Email:</strong> {app.email}</p>
          <p><strong>Phone:</strong> {app.phone}</p>
          <p><strong>Education:</strong> {app.education}</p>
          <p><strong>Skills:</strong> {app.skills}</p>

          <div style={{ marginTop: '10px' }}>
            <label>Marks (out of 100): </label>
            <input
              type="number"
              value={app.marks}
              onChange={(e) => handleInputChange(app.id, 'marks', e.target.value)}
              style={{ width: '80px', marginRight: '16px' }}
            />

            <label>Status: </label>
            <select
              value={app.status}
              onChange={(e) => handleInputChange(app.id, 'status', e.target.value)}
              style={{ marginRight: '16px' }}
            >
              <option value="Pending">Pending</option>
              <option value="Verified">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <label>Remarks: </label>
            <input
              type="text"
              value={app.remarks}
              onChange={(e) => handleInputChange(app.id, 'remarks', e.target.value)}
              style={{ width: '200px' }}
            />

            <button onClick={() => handleSave(app.id)} style={{ marginLeft: '16px' }}>
              Save Review
            </button>
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default ApplicationsTable;
