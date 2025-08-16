import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DepartmentStudents({ departmentId, token, colleges, departments, programs }) {
  const [students, setStudents] = useState([]);
  const universityName = localStorage.getItem('universityName');
  const [graduationYears, setGraduationYears] = useState([]);
  const [filters, setFilters] = useState({
    graduationYear: '',
    collegeId: '',
    departmentId: '',
    programId: '',
  });
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    canApply: '',
    name: '',
    email: '',
    registered_number: '',
    phone: '',
    enrollment_year: '',
    graduation_year: '',
    username: '',
    password: '',
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/student/?universityName=${universityName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const studentData = res.data.students;
      setStudents(studentData);

      const uniqueGraduationYears = [
        ...new Set(studentData.map((student) => student.graduation_year)),
      ];
      setGraduationYears(uniqueGraduationYears);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [departmentId, token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`${BASE_URL}/student/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents((prev) => prev.filter((s) => s._id !== id));
      alert('Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student.');
    }
  };

  const handleEditClick = (student) => {
    setEditingStudentId(student._id);
    setEditFormData({
      canApply: student.canApply || '',
      name: student.name || '',
      email: student.email || '',
      registered_number: student.registered_number || '',
      phone: student.phone || '',
      enrollment_year: student.enrollment_year || '',
      graduation_year: student.graduation_year || '',
      username: student.credentials?.username || '',
      password: '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...editFormData };
      if (updatedData.password && updatedData.password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }
      if (!updatedData.password) delete updatedData.password;
      await axios.put(`${BASE_URL}/student/${editingStudentId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Student updated successfully!');
      setEditingStudentId(null);
      fetchStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student.');
    }
  };

  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setEditFormData({
      canApply: '',
      name: '',
      email: '',
      registered_number: '',
      phone: '',
      enrollment_year: '',
      graduation_year: '',
      username: '',
      password: '',
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getProgramName = (programId) => {
    const program = programs.find((p) => p._id === programId);
    return program ? program.name : 'N/A';
  };

  const filteredStudents = students.filter((s) => {
    const { graduationYear, collegeId, departmentId, programId } = filters;
    return (
      (!graduationYear || s.graduation_year === parseInt(graduationYear)) &&
      (!collegeId || s.collegeId === collegeId) &&
      (!departmentId || s.departmentId === departmentId) &&
      (!programId || s.programId === programId)
    );
  });

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Total Students: {filteredStudents.length}</h3>
      <h2 className="text-2xl font-semibold mb-4">Department Students</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <select name="graduationYear" value={filters.graduationYear} onChange={handleFilterChange} className="p-1 border rounded">
          <option value="">Select Graduation Year</option>
          {graduationYears.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select name="collegeId" value={filters.collegeId} onChange={handleFilterChange} className="p-1 border rounded">
          <option value="">Select College</option>
          {colleges.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select name="departmentId" value={filters.departmentId} onChange={handleFilterChange} className="p-1 border rounded">
          <option value="">Select Department</option>
          {departments
            .filter((d) => !filters.collegeId || d.college === filters.collegeId)
            .map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
        </select>
        <select name="programId" value={filters.programId} onChange={handleFilterChange} className="p-1 border rounded">
          <option value="">Select Program</option>
          {programs
            .filter((p) => !filters.departmentId || p.department === filters.departmentId)
            .map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-1 text-sm text-right">#</th>
              <th className="border px-1 text-sm">Name</th>
              <th className="border px-1 text-sm">Email</th>
              <th className="border px-1 text-sm">Reg No.</th>
              <th className="border px-1 text-sm">Phone</th>
              <th className="border px-1 text-sm">Program</th>
              <th className="border px-1 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="border px-1 text-sm text-right">{i + 1}</td>
                <td className="border px-1 text-sm">{s.name}</td>
                <td className="border px-1 text-sm">{s.email}</td>
                <td className="border px-1 text-sm">{s.registered_number}</td>
                <td className="border px-1 text-sm">{s.phone}</td>
                <td className="border px-1 text-sm">{getProgramName(s.programId)}</td>
                <td className="border px-1 text-sm">
                  <button onClick={() => handleEditClick(s)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded mr-1">Edit</button>
                  <button onClick={() => handleDelete(s._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingStudentId && (
        <div className="mt-6 p-4 border border-blue-300 rounded bg-blue-50">
          <h3 className="text-lg font-semibold mb-2">Edit Student</h3>
          <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} placeholder="Name" className="p-2 border rounded" required />
            <input type="email" name="email" value={editFormData.email} onChange={handleEditChange} placeholder="Email" className="p-2 border rounded" required />
            <input type="text" name="registered_number" value={editFormData.registered_number} onChange={handleEditChange} placeholder="Registration Number" className="p-2 border rounded" />
            <input type="text" name="phone" value={editFormData.phone} onChange={handleEditChange} placeholder="Phone" className="p-2 border rounded" />
            <input type="number" name="enrollment_year" value={editFormData.enrollment_year} onChange={handleEditChange} placeholder="Enrollment Year" className="p-2 border rounded" />
            <input type="number" name="graduation_year" value={editFormData.graduation_year} onChange={handleEditChange} placeholder="Graduation Year" className="p-2 border rounded" />
            <input type="text" name="username" value={editFormData.username} onChange={handleEditChange} placeholder="Username" className="p-2 border rounded" />
            <input type="password" name="password" value={editFormData.password} onChange={handleEditChange} placeholder="Password (leave empty to retain old)" className="p-2 border rounded" />
            <div className="col-span-full flex justify-end gap-2">
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default DepartmentStudents;
