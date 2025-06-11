import React, { useState } from 'react';

function AddDepartments({ collegeId, token, colleges, departments, programs }) {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    head: '',
    contact: '',
    email: '',
  });
  const [programForm, setProgramForm] = useState({
    name: '',
    type: '',
    level: '',
    duration: '',
    eligibility: '',
    syllabus: '',
  });

  // Handle form input change
  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({ ...prev, [name]: value }));
  };

  // Add new department
  const addDepartment = () => {
    const newDept = { ...departmentForm, id: Date.now(), programs: [] };
    setSelectedDepartment(newDept);
    departments.push(newDept);
    setDepartmentForm({ name: '', head: '', contact: '', email: '' });
  };

  // Show program details in a popup
  const showProgramDetails = (program) => {
    setSelectedProgram(program);
  };

  // Close program popup
  const closeProgramPopup = () => {
    setSelectedProgram(null);
  };

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-3xl font-bold mb-4">Manage Departments</h2>

      {/* Add Department Form */}
      <div className="bg-white p-4 rounded shadow-md mb-4">
        <h3 className="text-xl font-semibold mb-2">Add New Department</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={departmentForm.name}
            onChange={(e) => handleInputChange(e, setDepartmentForm)}
            placeholder="Department Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="head"
            value={departmentForm.head}
            onChange={(e) => handleInputChange(e, setDepartmentForm)}
            placeholder="Department Head"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="contact"
            value={departmentForm.contact}
            onChange={(e) => handleInputChange(e, setDepartmentForm)}
            placeholder="Contact Number"
            className="p-2 border rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={departmentForm.email}
            onChange={(e) => handleInputChange(e, setDepartmentForm)}
            placeholder="Email"
            className="p-2 border rounded"
            required
          />
        </div>
        <button onClick={addDepartment} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Add Department
        </button>
      </div>

      {/* Departments and Programs List in Table Format */}
      <div className="overflow-auto max-w-full max-h-screen">
        <table className="min-w-full border-collapse border border-gray-300 shadow-lg">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="border border-gray-300 px-2 py-1 text-sm">#</th>
              <th className="border border-gray-300 px-2 py-1 text-sm">Department Name</th>
              <th className="border border-gray-300 px-2 py-1 text-sm">Head</th>
              <th className="border border-gray-300 px-2 py-1 text-sm">Contact</th>
              <th className="border border-gray-300 px-2 py-1 text-sm">Email</th>
              <th className="border border-gray-300 px-2 py-1 text-sm">Programs</th>
              <th className="border border-gray-300 px-2 py-1 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
  {departments.map((dept, index) => (
    <tr key={dept.id} className="hover:bg-gray-50">
      <td className="border px-2 py-1 text-sm">{index + 1}</td>
      <td className="border px-2 py-1 text-sm">{dept.name}</td>
      <td className="border px-2 py-1 text-sm">
        {dept.head?.name || "N/A"} ({dept.head?.phone || "N/A"})
      </td>
      <td className="border px-2 py-1 text-sm">{dept.contact}</td>
      <td className="border px-2 py-1 text-sm">{dept.email}</td>
      <td className="border px-2 py-1 text-sm">
        {dept.programs.map((program, i) => (
          <span key={program.id} onClick={() => showProgramDetails(program)} className="text-blue-600 cursor-pointer">
            {i + 1}. {program.name} <br />
          </span>
        ))}
      </td>
      <td className="border px-2 py-1 text-sm">
        <button className="text-red-600">Delete</button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {/* Program Details Popup */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-bold mb-2">Program Details</h3>
            <p><strong>Name:</strong> {selectedProgram.name}</p>
            <p><strong>Type:</strong> {selectedProgram.type}</p>
            <p><strong>Level:</strong> {selectedProgram.level}</p>
            <p><strong>Duration:</strong> {selectedProgram.duration} years</p>
            <p><strong>Eligibility:</strong> {selectedProgram.eligibility}</p>
            <p><strong>Syllabus:</strong> <a href={selectedProgram.syllabus} target="_blank" className="text-blue-600">View</a></p>
            <button onClick={closeProgramPopup} className="mt-2 bg-red-600 text-white px-2 py-1 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddDepartments;
