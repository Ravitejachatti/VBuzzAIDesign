import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProgram,
  editProgram,
  deleteProgram,
} from "../../../Redux/programs";
import { FaEdit, FaTrash, FaEye, FaGraduationCap, FaBook, FaClock, FaLink, FaSearch, FaFilter } from "react-icons/fa";

const ViewPrograms = ({ departments }) => {
  const { universityName } = useParams();
  const dispatch = useDispatch();
  const { programs, loading, error: fetchError } = useSelector(
    (s) => s.programs
  );
  const token = localStorage.getItem("University authToken");

  const [editingProgram, setEditingProgram] = useState(null);
  const [originalProgram, setOriginalProgram] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterLevel, setFilterLevel] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchProgram({ token, universityName }));
    }
  }, [dispatch, token, universityName]);

  const handleEdit = (prog) => {
    setOriginalProgram(prog);
    setEditingProgram({ ...prog });
    setError(null);
  };

  const deleteprogram = (id) =>
    dispatch(deleteProgram({ token, universityName, id }));

  const handleUpdate = () => {
    if (!token) {
      setError("Missing auth token");
      return;
    }
    if (!editingProgram || !originalProgram) {
      setError("No program selected to edit");
      return;
    }

    const changes = {};
    for (const key in editingProgram) {
      if (["_id", "__v", "createdAt"].includes(key)) continue;
      if (editingProgram[key] !== originalProgram[key]) {
        changes[key] = editingProgram[key];
      }
    }

    if (Object.keys(changes).length === 0) {
      return alert("No changes made");
    }

    dispatch(
      editProgram({
        token,
        universityName,
        id: editingProgram._id,
        changes,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setEditingProgram(null);
        setOriginalProgram(null);
      } else {
        setError(res.payload || "Failed to save changes");
      }
    });
  };

  // Filter and sort programs
  const filteredPrograms = programs
    .filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = !filterLevel || program.level === filterLevel;
      return matchesSearch && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "type":
          return a.type.localeCompare(b.type);
        case "level":
          return a.level.localeCompare(b.level);
        case "duration":
          return parseInt(a.duration) - parseInt(b.duration);
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
                <h1 className="text-2xl font-bold text-gray-900">Program Management</h1>
                <p className="text-gray-600">Manage academic programs under {universityName}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Total Programs: <span className="font-semibold text-blue-600">{programs.length}</span>
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
                  placeholder="Search programs..."
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
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="diploma">Diploma</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="postgraduate">Postgraduate</option>
                  <option value="doctorate">Doctorate</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="type">Sort by Type</option>
                <option value="level">Sort by Level</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {(fetchError || error) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{fetchError || error}</p>
          </div>
        )}

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div key={program._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaBook className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                      <p className="text-sm text-gray-500">{program.type}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    program.level === 'undergraduate' ? 'bg-green-100 text-green-800' :
                    program.level === 'postgraduate' ? 'bg-blue-100 text-blue-800' :
                    program.level === 'doctorate' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {program.level}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">Duration: {program.duration} years</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FaGraduationCap className="text-gray-400 text-sm" />
                    <span className="text-sm text-gray-600">
                      Department: {program.department?.name || program.department || "N/A"}
                    </span>
                  </div>

                  {program.syllabus && (
                    <div className="flex items-center space-x-2">
                      <FaLink className="text-gray-400 text-sm" />
                      <a
                        href={program.syllabus}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View Syllabus
                      </a>
                    </div>
                  )}

                  {program.eligibilityCriteria && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-1">Eligibility:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{program.eligibilityCriteria}</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(program)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteprogram(program._id)}
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

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No programs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterLevel ? "Try adjusting your search or filter criteria." : "Get started by adding a new program."}
            </p>
          </div>
        )}

        {/* Edit Modal */}
        {editingProgram && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Program</h2>
                  <button
                    onClick={() => setEditingProgram(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingProgram.name}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          name: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="number"
                      value={editingProgram.duration}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          duration: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={editingProgram.department}
                      onChange={(e) =>
                        setEditingProgram({
                          ...editingProgram,
                          department: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={editingProgram.type}
                      onChange={(e) =>
                        setEditingProgram({ ...editingProgram, type: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a type</option>
                      <option value="b.tech">B.Tech</option>
                      <option value="bachelors">Bachelors</option>
                      <option value="m.tech">M.Tech</option>
                      <option value="masters">Masters</option>
                      <option value="phd">Ph.D</option>
                      <option value="mba">MBA</option>
                      <option value="diploma">Diploma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select
                      value={editingProgram.level}
                      onChange={(e) =>
                        setEditingProgram({ ...editingProgram, level: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="diploma">Diploma</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="postgraduate">Postgraduate</option>
                      <option value="doctorate">Doctorate</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus URL</label>
                    <input
                      type="url"
                      value={editingProgram.syllabus}
                      onChange={(e) =>
                        setEditingProgram({ ...editingProgram, syllabus: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                    <textarea
                      value={editingProgram.eligibilityCriteria}
                      onChange={(e) =>
                        setEditingProgram({ ...editingProgram, eligibilityCriteria: e.target.value })
                      }
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setEditingProgram(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={!editingProgram}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPrograms;