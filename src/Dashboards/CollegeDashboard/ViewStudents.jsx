import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  Trash2, 
  Eye, 
  UserPlus, 
  GraduationCap, 
  Calendar, 
  Mail, 
  Phone,
  ChevronDown,
  X,
  Save,
  TrendingUp,
  Award,
  Building
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ViewStudents({ colleges, departments, programs, CollegeName }) {
  const { universityName } = useParams();
  const [students, setStudents] = useState([]);
  const [graduationYears, setGraduationYears] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    graduationYear: "",
    college: "",
    department: "",
    programId: ""
  });
  
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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
      const res = await axios.get(`${BASE_URL}/student/?universityName=${universityName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentData = res.data.students;
      setStudents(studentData);

      const uniqueGraduationYears = [...new Set(studentData.map((student) => student.graduation_year))];
      setGraduationYears(uniqueGraduationYears);

      setFilteredStudents(studentData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${BASE_URL}/student/${id}?universityName=${universityName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      password: "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentId = editingStudentId;
      const updatedData = { ...editFormData };

      if (updatedData.password && updatedData.password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }

      if (!updatedData.password) {
        delete updatedData.password;
      }

      await axios.put(`${BASE_URL}/student/${studentId}?universityName=${universityName}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      canApply: "", name: "", email: "", registered_number: "", phone: "",
      enrollment_year: "", graduation_year: "", username: "", password: "",
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    if (CollegeName && colleges.length > 0) {
      const defaultCollege = colleges.find(college => college.name === CollegeName);
      if (defaultCollege) {
        setFilters(prev => ({ ...prev, college: defaultCollege._id }));
      }
    }
  }, [colleges, CollegeName]);

  useEffect(() => {
    fetchStudents();
  }, [universityName]);

  useEffect(() => {
    const filtered = students.filter((student) => {
      const { graduationYear, college, department, programId } = filters;
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.registered_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGradYear = !graduationYear || student.graduation_year === parseInt(graduationYear);
      const matchesCollege = !college || student.collegeId === college;
      const matchesDepartment = !department || student.departmentId === department;
      const matchesProgram = !programId || student.programId === programId;
      
      return matchesSearch && matchesGradYear && matchesCollege && matchesDepartment && matchesProgram;
    });
    setFilteredStudents(filtered);
  }, [students, filters, searchTerm]);

  const getProgramName = (programId) => {
    const program = programs.find((program) => program._id === programId);
    return program ? program.name : "N/A";
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : "N/A";
  };

  const getCollegeName = (collegeId) => {
    const college = colleges.find((col) => col._id === collegeId);
    return college ? college.name : "N/A";
  };

  const totalStudents = filteredStudents.length;
  const activeStudents = filteredStudents.filter(s => s.canApply).length;
  const graduatingThisYear = filteredStudents.filter(s => s.graduation_year === new Date().getFullYear()).length;

  const StudentCard = ({ student, index }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold">
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {student.name}
            </h3>
            <p className="text-sm text-gray-500">{student.registered_number}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            student.canApply ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {student.canApply ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 truncate">{student.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{student.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{getProgramName(student.programId)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Grad: {student.graduation_year}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {getDepartmentName(student.departmentId)}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedStudent(student);
              setShowStudentDetails(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEditClick(student)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(student._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Student Management</h2>
          <p className="text-gray-600 mt-2">View and manage student records</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all">
            <Download className="w-5 h-5" />
            <span>Export Data</span>
          </button>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all">
            <UserPlus className="w-5 h-5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Students</p>
              <p className="text-3xl font-bold">{totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Students</p>
              <p className="text-3xl font-bold">{activeStudents}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Graduating This Year</p>
              <p className="text-3xl font-bold">{graduatingThisYear}</p>
            </div>
            <Award className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Departments</p>
              <p className="text-3xl font-bold">{departments.length}</p>
            </div>
            <Building className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="graduationYear"
              value={filters.graduationYear}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Years</option>
              {graduationYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="college"
              value={filters.college}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Colleges</option>
              {colleges.map((college) => (
                <option key={college._id} value={college._id}>{college.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Departments</option>
              {departments
                .filter((department) => department.college === filters.college)
                .map((department) => (
                  <option key={department._id} value={department._id}>{department.name}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="programId"
              value={filters.programId}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Programs</option>
              {programs
                .filter((program) => program.department === filters.department)
                .map((program) => (
                  <option key={program._id} value={program._id}>{program.name}</option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} students
          </span>
          <button
            onClick={() => {
              setFilters({ graduationYear: "", college: "", department: "", programId: "" });
              setSearchTerm("");
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || Object.values(filters).some(f => f) 
              ? "No students match your current filters." 
              : "No students have been added yet."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <StudentCard key={student._id} student={student} index={index} />
          ))}
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit Student</h3>
              <button
                onClick={handleCancelEdit}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Can Apply</label>
                <select
                  name="canApply"
                  value={editFormData.canApply}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
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
              <div>
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
              <div>
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
              <div>
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
              <div>
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
              <div>
                <label className="block font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
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
              <div className="md:col-span-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentDetails && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-gray-600">{selectedStudent.registered_number}</p>
                </div>
              </div>
              <button
                onClick={() => setShowStudentDetails(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{selectedStudent.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{selectedStudent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Graduation: {selectedStudent.graduation_year}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Academic Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">College:</span>
                    <span className="ml-2 text-gray-900">{getCollegeName(selectedStudent.collegeId)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Department:</span>
                    <span className="ml-2 text-gray-900">{getDepartmentName(selectedStudent.departmentId)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Program:</span>
                    <span className="ml-2 text-gray-900">{getProgramName(selectedStudent.programId)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedStudent.canApply ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedStudent.canApply ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowStudentDetails(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEditClick(selectedStudent);
                  setShowStudentDetails(false);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Student</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewStudents;