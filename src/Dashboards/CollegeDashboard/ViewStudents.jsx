
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ViewStudents  ({ colleges, departments, programs,CollegeName   }) {
  const { universityName } = useParams();
  const [students, setStudents] = useState([]);
  const [graduationYears, setGraduationYears] = useState([]);
  const [college, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [department, setDepartments] = useState([]);
  const [program, setPrograms] = useState([]);
  const [programId, setProgramId] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    graduationYear: "",
    college: "",  // ✅ Default to passed college name
    department: "",
    programId: ""  // ✅ Add this
  });
  
  console.log("colleges:", colleges)
  console.log("Departments:", departments)
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    canApply: "",
    name: "",
    email: "",
    registered_number: "",
    phone: "",
    enrollment_year: "",
    graduation_year: "",
    username: "",
    password: "",
  });
  const token = localStorage.getItem("University authToken");

  

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/student/?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the headers
          },
        }
      );
      const studentData = res.data.students; // Access the students array
      console.log("Student Data in the list:", studentData)
      console.log("studetn can apply or not:", studentData[0]?.canApply)
      setStudents(studentData);

      const uniqueGraduationYears = [
        ...new Set(studentData.map((student) => student.graduation_year)),
      ];
      setGraduationYears(uniqueGraduationYears);

      const uniqueColleges = [
        ...new Set(studentData.map((student) => student.collegeId)),
      ];
      setColleges(uniqueColleges);

      const uniqueDepartments = [
        ...new Set(studentData.map((student) => student.departmentId)),
      ];
      setDepartments(uniqueDepartments);

      setFilteredStudents(studentData); // Initialize filtered students

      console.log("filtered student:", studentData)
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(
        `${BASE_URL}/student/${id}?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchStudents();
      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student.");
    }
  };
  

  const handleEditClick = (student) => {
    setEditingStudentId(student._id);
    setEditFormData({
      canApply: student.canApply || "",
      name: student.name || "",
      email: student.email || "",
      registered_number: student.registered_number || "",
      phone: student.phone || "",
      enrollment_year: student.enrollment_year || "",
      graduation_year: student.graduation_year || "",
      username: student.credentials?.username || "",
      password: "", // Do not pre-fill password for security reasons
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentId = editingStudentId;
      const updatedData = { ...editFormData };

      // Password Validation
      if (updatedData.password && updatedData.password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }

      if (!updatedData.password) {
        delete updatedData.password; // Exclude password if not updated
      }

      await axios.put(
        `${BASE_URL}/student/${studentId}?universityName=${universityName}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Student updated successfully!");
      setEditingStudentId(null);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student.");
    }
  };


  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setEditFormData({
      canApply: "",
      name: "",
      email: "",
      registered_number: "",
      phone: "",
      enrollment_year: "",
      graduation_year: "",
      username: "",
      password: "",
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Add this useEffect hook near your other state declarations
useEffect(() => {
  if (CollegeName && colleges.length > 0) {
    const defaultCollege = colleges.find(college => college.name === CollegeName);
    if (defaultCollege) {
      setSelectedCollege(defaultCollege._id);
    }
  }
}, [colleges, CollegeName]);



  // Update the student's canApply status in the filtered list
  const handleStatusUpdate = (studentId, canApply) => {
    setFilteredStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === studentId ? { ...student, canApply } : student
      )
    );
  };

  useEffect(() => {
    fetchStudents();
  }, [universityName]);

  useEffect(() => {
    const filtered = students.filter((student) => {
      const { graduationYear, college, department, programId } = filters;
      return (
        (!graduationYear || student.graduation_year === parseInt(graduationYear)) &&
        (!college || student.collegeId === college) &&
        (!department || student.departmentId === department) &&
        (!programId || student.programId === programId)  // Add this condition
      );
    });
    setFilteredStudents(filtered);
  }, [students, filters]);
  console.log("filtered students:", filteredStudents) 
  // const departments = departments;  

    // to find the total number of students fetched and displayed along side the student list
    const totalStudents = filteredStudents.length;

    const getProgramName = (programId) => {
      const program = programs.find((program) => program._id === programId);
      return program ? program.name : "N/A"; // Return "N/A" if no program is found
    };
 

  return (
    <div>
      <h1 className="text-xl font-semibold my-1 text-center underline">Student Management</h1>

      <h2 className=""><strong>Student List:</strong>=({totalStudents})</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Graduation Year Dropdown */}
        <select
          name="graduationYear"
          value={filters.graduationYear}
          onChange={handleFilterChange}
          className="p-1 border rounded"
        >
          <option value="">Select Graduation Year</option>
          {graduationYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Colleges Dropdown */}
        <select
          name="college"
          value={filters.college}
          onChange={handleFilterChange}
          className="p-1 border rounded"
        >
          <option value="">Select College</option>
          {colleges.map((college) => (
            <option key={college._id} value={college._id}>
              {college.name}
            </option>
          ))}
        </select>

        {/* Departments Dropdown */}
        <select
  name="department"
  value={filters.department}
  onChange={handleFilterChange}
  className="p-1 border rounded"
>
  <option value="">Select Department</option>
  {departments
    .filter((department) => department.college === filters.college) // ✅ Show only departments of selected college
    .map((department) => (
      <option key={department._id} value={department._id}>
        {department.name}
      </option>
    ))}
</select>
    

      
<select
  name="programId"
  value={filters.programId}
  onChange={handleFilterChange}
  className="p-1 border rounded"
>
  <option value="">Select Program</option>
  {programs
    .filter((program) => program.department === filters.department) // Show only programs of selected department
    .map((program) => (
      <option key={program._id} value={program._id}>
        {program.name}
      </option>
    ))}
</select>

      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-screen ">
        {/* Table for displaying students */}
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-1 text-sm text-right">#</th>
              <th className="border px-1 text-sm text-left">Name</th>
              <th className="border px-1 text-sm text-left">Email</th>
              <th className="border px-1 text-sm text-left">Registration</th>
              <th className="border px-1 text-sm text-left">Phone</th>
              <th className="border px-1  text-left">Studnet ID</th> 
              <th className="border px-1 text-left">program</th>
              <th className="border px-1 text-sm text-left">Grad Year</th>
              <th className="border px-1 text-sm text-left">canApply</th>
              <th className="border px-1 text-sm text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents?.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student._id} className="border-b">
                  <td className="border px-1 text-xs  text-right">{index + 1}.</td>
                  <td className="border px-1 text-xs">{student.name}</td>
                  <td className="border px-1 text-xs">{student.email}</td>
                  <td className="border px-1 text-xs ">{student.registered_number}</td> 
                  <td className="border px-1 text-xs">{student.phone}</td>
                  <td className="border px-1 text-xs">{student._id}</td>
                  <td className="border px-1 text-xs">
          {getProgramName(student.programId)} {/* Display program name instead of ID */}
        </td>
                  <td className="border px-1  text-xs">{student.graduation_year}</td>
                  <td className="border px-1 text-xs">{student.canApply ? "true" : "false"}</td>
                  <td className="border px-1 ">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(student)}
                        className="bg-yellow-500 text-white px-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-500 text-white px-2  rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No students available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Popup/Modal for editing student */}
        {editingStudentId && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block font-medium mb-1">canApply</label>
                  <input
                    type="boolean"
                    name="canApply"
                    value={editFormData.canApply}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium mb-1">Registered Number</label>
                  <input
                    type="text"
                    name="registered_number"
                    value={editFormData.registered_number}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium mb-1">Phone</label>
                  <input
                    type="number"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium mb-1">Graduation Year</label>
                  <input
                    type="number"
                    name="graduation_year"
                    value={editFormData.graduation_year}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium mb-1">User Name</label>
                  <input
                    type="text"
                    name="username"
                    value={editFormData.username}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block font-medium mb-1">New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={editFormData.password}
                    onChange={handleEditChange}
                    className="w-full p-2 border rounded"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex justify-end space-x-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-1 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-1 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default ViewStudents;
