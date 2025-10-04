import  { useState } from 'react';
import ManageNotice from './ManageNotice';
import Notice from './Notice';



<<<<<<< HEAD
<<<<<<< HEAD
function DepartNotice() {
=======
function CollegeNotice() {
>>>>>>> vbuzzUpdatedFrontend/main
=======
function CollegeNotice() {
>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04
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
                   Add Notice
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
                    View Notice
                </button>
            </div>

            {/* Conditional Rendering */}
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
                {activeTab === 'add' && <ManageNotice  />}
                {activeTab === 'edit' && <Notice />}
            </div>
        </div>
    );
}

<<<<<<< HEAD
<<<<<<< HEAD
export default DepartNotice;
=======
export default CollegeNotice;
>>>>>>> vbuzzUpdatedFrontend/main
=======
export default CollegeNotice;
>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04


