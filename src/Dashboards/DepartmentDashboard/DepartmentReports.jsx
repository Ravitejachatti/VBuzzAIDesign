import React from 'react';

function DepartmentReports({ departmentId }) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Department Reports</h2>
            <p>Generate and view reports for department ID: {departmentId}</p>
            {/* Add reporting functionality (e.g., attendance, performance) here */}
        </div>
    );
}

export default DepartmentReports;
