import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDept, deptDelete, deptUpdate } from "../../../Redux/DepartmentSlice";
import { FaEdit, FaTrash, FaGraduationCap, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSearch, FaFilter, FaTimes } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DepartmentList = ({ colleges = [], programs = [] }) => {
  const { universityName } = useParams();
  const location = useLocation();
  const user = location.state?.user || {};
  const dispatch = useDispatch();

  const { departments = [], loading: deptLoading, error: deptError } = useSelector(
    (state) => state.department
  );
  console.log(colleges)
  console.log(programs)

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // full editable form state
  const [formData, setFormData] = useState({
    name: "",
    head: { name: "", phone: "" },
    contactEmail: "",
    contactPhone: "",
    email: "",
    address: { roomNumber: "", building: "" },
    college: "",
    programs: [], // array of ids
  });

  const token = localStorage.getItem("University authToken");

  const fetchDepartments = async () => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }
    setBusy(true);
    const result = await dispatch(fetchDept({ token, universityName, BASE_URL }));
    if (result.meta.requestStatus !== "fulfilled") setError("Something went wrong.");
    else setError("");
    setBusy(false);
  };

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universityName]);

  const getCollegeName = (collegeId) =>
    colleges.find((c) => c._id === collegeId)?.name || "Unknown College";

  const getProgramName = (programId) =>
    programs.find((p) => p._id === programId)?.name || "Unknown Program";

  const showCollegeDetails = (collegeId) =>
    setSelectedCollege(colleges.find((c) => c._id === collegeId) || null);

  const showProgramDetails = (programId) =>
    setSelectedProgram(programs.find((p) => p._id === programId) || null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      dispatch(deptDelete({ token, id, universityName, BASE_URL }));
    }
  };

  // ✅ This populates form and opens the modal
  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name || "",
      head: {
        name: department.head?.name || "",
        phone: department.head?.phone || "",
      },
      contactEmail: department.contactEmail || "",
      contactPhone: department.contactPhone || "",
      email: department.email || "",
      address: {
        roomNumber: department.address?.roomNumber || "",
        building: department.address?.building || "",
      },
      college: department.college || "",
      programs: Array.isArray(department.programs) ? department.programs : [],
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.head.name || !formData.head.phone) {
      setError("Please fill out required fields (Department name, Head name & phone).");
      return;
    }
    setBusy(true);
    await dispatch(
      deptUpdate({
        token,
        selectedDepartment, // your thunk can read selectedDepartment._id
        formData,
        universityName,
        BASE_URL,
      })
    );
    setBusy(false);
    setSelectedDepartment(null); // close modal
  };

  const filteredDepartments = (Array.isArray(departments) ? departments : [])
    .filter((dept) => {
      const hay = searchTerm.toLowerCase();
      return (
        dept.name?.toLowerCase().includes(hay) ||
        dept.head?.name?.toLowerCase().includes(hay) ||
        getCollegeName(dept.college).toLowerCase().includes(hay)
      );
    })
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

  // helpers for form updates
  const setHeadField = (key, value) =>
    setFormData((prev) => ({ ...prev, head: { ...prev.head, [key]: value } }));

  const setAddressField = (key, value) =>
    setFormData((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));

  const toggleProgram = (id) =>
    setFormData((prev) => {
      const exists = prev.programs.includes(id);
      return { ...prev, programs: exists ? prev.programs.filter((p) => p !== id) : [...prev.programs, id] };
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
              Total Departments:{" "}
              <span className="font-semibold text-blue-600">{filteredDepartments.length}</span>
            </div>
          </div>
        </div>

        {/* Errors */}
        {(error || deptError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error || deptError}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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

        {/* Loading */}
        {(busy || deptLoading) && (
          <div className="text-center text-sm text-gray-500 mb-4">Loading departments…</div>
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
                          {getProgramName(progId)}
                          {index < Math.min(dept.programs.length - 1, 1) ? ", " : ""}
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
                    onClick={() => handleEdit(dept)}   // ✅ FIXED
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept._id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredDepartments.length === 0 && !deptLoading && (
          <div className="text-center py-12">
            <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding a new department."}
            </p>
          </div>
        )}
      </div>

      {/* =========================
          EDIT MODAL (FULL DETAILS)
          ========================= */}
      {selectedDepartment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit Department</h2>
              <button
                onClick={() => setSelectedDepartment(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
              {/* Basic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Department Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Department Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData((p) => ({ ...p, contactEmail: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData((p) => ({ ...p, contactPhone: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Head */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Head Name *</label>
                  <input
                    type="text"
                    value={formData.head.name}
                    onChange={(e) => setHeadField("name", e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Head Phone *</label>
                  <input
                    type="tel"
                    value={formData.head.phone}
                    onChange={(e) => setHeadField("phone", e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Room Number</label>
                  <input
                    type="text"
                    value={formData.address.roomNumber}
                    onChange={(e) => setAddressField("roomNumber", e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Building</label>
                  <input
                    type="text"
                    value={formData.address.building}
                    onChange={(e) => setAddressField("building", e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* College (locked to the existing one; set readOnly or keep selectable if you want) */}
              <div>
                <label className="block text-sm font-medium mb-1">College</label>
                <select
                  value={formData.college}
                  onChange={(e) => setFormData((p) => ({ ...p, college: e.target.value }))}
                  className="w-full p-2 border rounded bg-gray-50"
                  disabled // lock it as requested
                >
                  <option value="">Select college</option>
                  {colleges.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Locked. Contact admin to change the owning college.</p>
              </div>

              {/* Programs (multi-select by checkboxes; show only programs that belong to this college if you store that relation) */}
              <div>
                <label className="block text-sm font-medium mb-2">Programs</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-auto p-2 border rounded">
                  {programs.map((p) => (
                    <label key={p._id} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.programs.includes(p._id)}
                        onChange={() => toggleProgram(p._id)}
                      />
                      <span>{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDepartment(null)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
                >
                  {busy ? "Updating…" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* College details modal */}
      {selectedCollege && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">{selectedCollege.name}</h3>
              <button className="text-gray-500" onClick={() => setSelectedCollege(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="p-6 space-y-2">
              <p><strong>Dean:</strong> {selectedCollege.dean}</p>
              <p><strong>Email:</strong> {selectedCollege.adminEmail}</p>
              <p><strong>Address:</strong> {selectedCollege.location?.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Program details modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">{selectedProgram.name}</h3>
              <button className="text-gray-500" onClick={() => setSelectedProgram(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="p-6 space-y-2">
              <p><strong>Type:</strong> {selectedProgram.type}</p>
              <p><strong>Level:</strong> {selectedProgram.level}</p>
              <p><strong>Duration:</strong> {selectedProgram.duration} years</p>
              <p><strong>Eligibility:</strong> {selectedProgram.eligibilityCriteria}</p>
              {selectedProgram.syllabus && (
                <p>
                  <strong>Syllabus:</strong>{" "}
                  <a className="text-blue-600" href={selectedProgram.syllabus} target="_blank" rel="noreferrer">View</a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;