import React from 'react';

function DepartmentInformation({ departmentId }) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Department Information</h2>
            <p>View and edit information for department ID: {departmentId}</p>
            {/* Add department information display and editing functionality here */}
        </div>
    );
}

export default DepartmentInformation;
