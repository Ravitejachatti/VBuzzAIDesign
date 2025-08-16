import React from 'react';

function ManageCourses({ departmentId, token }) {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Manage Courses</h2>
            <p>Manage courses for department ID: {departmentId}</p>
            <p>Token: {token}</p>
            {/* Add CRUD functionality for courses here */}
        </div>
    );
}

export default ManageCourses;
