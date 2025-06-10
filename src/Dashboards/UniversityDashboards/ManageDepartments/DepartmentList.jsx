import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDept, deptDelete, deptUpdate } from "../../../Redux/DepartmentSlice";
import { FaEdit, FaTrash, FaEye, FaGraduationCap, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSearch, FaFilter } from "react-icons/fa";

const DepartmentList = ({ colleges, programs }) => {
  const { universityName } = useParams();
  const location = useLocation();
  const user = location.state?.user || {};
  const dispatch = useDispatch();
  const { departments, loading } = useSelector(state => state.department);
  
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [load, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    head: { name: "", phone: "" },
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("University authToken");

  const fetchDepartments = async () => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    setLoading(true);

    const result = await dispatch(fetchDept({ token, universityName }));
    if (result.meta.requestStatus === "fulfilled") {
      console.log("Departments fetched");
    } else {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      dispatch(deptDelete({ token, id, universityName }));
    }
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      head: department.head || { name: "", phone: "" },
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.head.name || !formData.head.phone) {
      setError("Please fill out all required fields.");
      return;
    }
    setLoading(true);
    dispatch(deptUpdate({ token, selectedDepartment, formData, universityName }));
    setLoading(false);
    setSelectedDepartment(null);
  };

  const getCollegeName = (collegeId) => {
    const college = colleges.find((col) => col._id === collegeId);
    return college ? college.name : "Unknown College";
  };

  const getProgramName = (programId) => {
    const program = programs.find((prog) => prog._id === programId);
    return program ? program.name : "Unknown Program";
  };

  const showCollegeDetails = (collegeId) => {
    const college = colleges.find((col) => col._id === collegeId);
    setSelectedCollege(college);
  };

  const showProgramDetails = (programId) => {
    const program = programs.find((prog) => prog._id === programId);
    setSelectedProgram(program);
  };

  // Filter and sort departments
  const filteredDepartments = departments
    .filter(dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCollegeName(dept.college).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "college":
          return getCollegeName(a.college).localeCompare(getCollegeName(b.college));
        case "head":
          return (a.head?.name || "").localeCompare(b.head?.name || "");
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaGraduationCap className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
                <p className="text-gray-600">Manage departments under {universityName}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Total Departments: <span className="font-semibold text-blue-600">{departments.length}</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="college">Sort by College</option>
                  <option value="head">Sort by Head</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <div key={dept._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaGraduationCap className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-500">Department</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">Head: {dept.head?.name || "N/A"}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FaPhone className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">{dept.head?.phone || "N/A"}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">{dept.contactEmail || "N/A"}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">
                      {dept.address?.roomNumber ? `Room ${dept.address.roomNumber}, ` : ""}
                      {dept.address?.building || "N/A"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => showCollegeDetails(dept.college)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {getCollegeName(dept.college)}
                      </button>
                      <span className="text-xs text-gray-400">College</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Programs ({dept.programs?.length || 0}):</span>
                      {dept.programs?.slice(0, 2).map((progId, index) => (
                        <button
                          key={progId}
                          onClick={() => showProgramDetails(progId)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          {getProgramName(progId)}{index < Math.min(dept.programs.length - 1, 1) ? ", " : ""}
                        </button>
                      ))}
                      {dept.programs?.length > 2 && (
                        <span className="text-gray-500"> +{dept.programs.length - 2} more</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept._id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding a new department."}
            </p>
          </div>
        )}

        {/* Edit Department Modal */}
        {selectedDepartment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Edit Department</h3>
                  <button
                    onClick={() => setSelectedDepartment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Head of Department</label>
                    <input
                      type="text"
                      name="headName"
                      value={formData.head.name}
                      onChange={(e) =>
                        setFormData({ ...formData, head: { ...formData.head, name: e.target.value } })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Head's Contact</label>
                    <input
                      type="text"
                      name="headPhone"
                      value={formData.head.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, head: { ...formData.head, phone: e.target.value } })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setSelectedDepartment(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={load}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {load ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* College Details Modal */}
        {selectedCollege && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{selectedCollege.name}</h3>
                  <button
                    onClick={() => setSelectedCollege(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  <p><strong>Dean:</strong> {selectedCollege.dean}</p>
                  <p><strong>Email:</strong> {selectedCollege.adminEmail}</p>
                  <p><strong>Address:</strong> {selectedCollege.location?.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Program Details Modal */}
        {selectedProgram && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{selectedProgram.name}</h3>
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  <p><strong>Type:</strong> {selectedProgram.type}</p>
                  <p><strong>Level:</strong> {selectedProgram.level}</p>
                  <p><strong>Duration:</strong> {selectedProgram.duration} years</p>
                  <p><strong>Eligibility:</strong> {selectedProgram.eligibilityCriteria}</p>
                  {selectedProgram.syllabus && (
                    <p>
                      <strong>Syllabus:</strong>{" "}
                      <a
                        href={selectedProgram.syllabus}
                        className="text-blue-600 hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Syllabus
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentList;