<<<<<<< HEAD
import  { useState } from 'react';
import ManageDepartments from './CollegeAddDepart';
import DepartmentList from './CollegeListDepart';



function CollegeDepart() {
=======
import React, { useState } from 'react';
import ManageDepartments from './CollegeAddDepart';
import DepartmentList from './CollegeListDepart'; 



function Departments({colleges, programs}) {
>>>>>>> vbuzzUpdatedFrontend/main
    const [activeTab, setActiveTab] = useState('add'); // State to track which tab is active

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Tab Navigation */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button
                    onClick={() => setActiveTab('edit')}
                    style={{
                        padding: '5px 5px',
                        backgroundColor: activeTab === 'edit' ? '#007BFF' : '#f0f0f0',
                        color: activeTab === 'edit' ? '#fff' : '#000',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                   View Departments
                </button>
                <button
                    onClick={() => setActiveTab('add')}
                    style={{
                        padding: '5px 5px',
                        backgroundColor: activeTab === 'add' ? '#007BFF' : '#f0f0f0',
                        color: activeTab === 'add' ? '#fff' : '#000',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                    Add Departments
                </button>
            </div>

            {/* Conditional Rendering */}
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
<<<<<<< HEAD
                {activeTab === 'add' && <ManageDepartments  />}
                {activeTab === 'edit' && <DepartmentList />}
=======
                {activeTab === 'add' && <ManageDepartments colleges={colleges} programs={programs} />}
                {activeTab === 'edit' && <DepartmentList colleges={colleges} programs={programs}/>}
>>>>>>> vbuzzUpdatedFrontend/main
            </div>
        </div>
    );
}

<<<<<<< HEAD
export default CollegeDepart;
=======
export default Departments;
>>>>>>> vbuzzUpdatedFrontend/main
