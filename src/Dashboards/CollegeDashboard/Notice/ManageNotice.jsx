import React, { useEffect, useState } from "react";
import axios from "axios";
<<<<<<< HEAD
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
=======
import { useParams } from "react-router-dom";
import { 
  Bell, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Save, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Building, 
  GraduationCap,
  Search,
  Filter,
  FileText,
  Link as LinkIcon
} from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";

>>>>>>> vbuzzUpdatedFrontend/main
import{useDispatch, useSelector} from "react-redux";
import {
  fetchNotices,
  updateNotice,
  deleteNotice,
  clearNoticeState,
} from "../../../Redux/Placement/noticeSlice"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getPriorityColor = (priority) => {
<<<<<<< HEAD
  switch (priority.toLowerCase()) {
=======
  switch (priority?.toLowerCase()) {
>>>>>>> vbuzzUpdatedFrontend/main
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-orange-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

<<<<<<< HEAD
const ManageNotice = () => {
  const dispatch = useDispatch();
  const [viewNotice, setViewNotice] = useState(null);
  const [viewMessage, setViewMessage] = useState(null);
  const [editNotice, setEditNotice] = useState(null);
  const [deleteNoticeId, setDeleteNoticeId] = useState(null);
  const { universityName } = useParams();
  const token = localStorage.getItem("University authToken");

=======
const getPriorityBadge = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-orange-100 text-orange-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ManageNotice = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const token = localStorage.getItem("University authToken");

  const { items: notices, loading, error, success } = useSelector((state) => state.createNotice);
>>>>>>> vbuzzUpdatedFrontend/main
  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const students = useSelector((state) => state.students.students) || [];

<<<<<<< HEAD
      const studentList = Array.isArray(students) ? students : [];
      console.log("students in manage notice:", studentList)

  // Fetch notices on mount
=======
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [viewMessage, setViewMessage] = useState(null);
const [viewNotice, setViewNotice] = useState(null);
const [editNotice, setEditNotice] = useState(null);
const [deleteNoticeId, setDeleteNoticeId] = useState(null);

>>>>>>> vbuzzUpdatedFrontend/main
  useEffect(() => {
    dispatch(fetchNotices({ universityName, token }));
  }, [dispatch, universityName, token]);

<<<<<<< HEAD
    // Clear flash on unmount
  useEffect(() => () => dispatch(clearNoticeState()), [dispatch]);

   const { items: notices, loading, error, success } = useSelector((s) => s.createNotice);

  const getCollegeName = (collegeId) => {
    const college = colleges.find((col) => col._id === collegeId);
    return college ? college.name : "Unknown";
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : "Unknown";
  };

  const getProgramName = (programId) => {
    const program = programs.find((prog) => prog._id === programId);
    return program ? program.name : "Unknown";
  };

  console.log("Colleges",colleges)
  console.log("departments", departments)
  console.log("programs",programs)
  console.log("students",students)

  // Delete notice
useEffect(() => {
  if (!deleteNoticeId) return;
  dispatch(deleteNotice({ universityName, noticeId: deleteNoticeId }))
    .then(() => setDeleteNoticeId(null));
}, [deleteNoticeId, dispatch, universityName]);

  // Update notice
const handleUpdate = (e) => {
  e.preventDefault();
  dispatch(updateNotice({
    universityName,
    noticeId: editNotice._id,
    updateData: editNotice,
  })).then(() => setEditNotice(null));
};


  // 1. Add this helper near the top of your component:
 const getStudentById = (id) => studentList.find((s) => s._id === id) || {};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Notices</h1>
{loading && <p>Loading…</p>}
{error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}
{success && <div className="bg-green-100 text-green-700 p-2 mb-4">{success}</div>}
      
      {/* Notices List */}
      <ul>
        {notices?.length === 0 ? (
          <p className="text-center text-gray-500">No notices available</p>
        ) : (
          notices?.map((notice) => (
            <li
              key={notice._id}
              className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center relative"
            >
              {/* Vertical Line for Priority */}
              <div className={`absolute left-0 top-0 h-full w-2 ${getPriorityColor(notice?.priority)}`}></div>
              <div className="pl-4">
                <h3 className="text-lg font-bold">{notice.title}</h3>
                <p className="text-sm text-gray-600"><span className="font-bold">Message:</span>
                  {notice?.message.split(" ").length > 50 ? (
                    <>
                      {notice?.message.split(" ").slice(0, 50).join(" ")}...
                      <button
                        onClick={() => setViewMessage(notice?.message)}
                        className="text-blue-500 hover:underline ml-1"
                      >
                        View More
                      </button>
                    </>
                  ) : (
                    notice.message
                  )}
                </p>
                <p className="text-sm mt-2"><span className="font-bold">Priority:</span> {notice?.priority}</p>
                <p className="text-sm"><span className="font-bold">Expiry Date:</span> {new Date(notice?.expiryDate).toLocaleDateString()}</p>
            <p className="text-sm"><span className="font-bold">Colleges:</span>  {notice?.colleges.map(getCollegeName).join(", ")}</p>
            <p className="text-sm"><span className="font-bold">Departments:</span> {notice?.departments.map(getDepartmentName).join(", ")}</p>
            <p className="text-sm"><span className="font-bold">Programs: </span>{notice?.programs.map(getProgramName).join(", ")}</p>
   <div className="mt-2">
  <p className="font-bold text-sm mb-1">Read by:</p>
  <table className="min-w-full border border-gray-200 text-sm">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-2 py-1 text-left border">User Type</th>
      <th className="px-1 text-xs py-1 text-left border">Name</th>
        <th className="px-1 text-xs py-1 text-left border">Read At</th>
        <th className="px-1 text-xs py-1 text-left border">College</th>
              <th className="px-1 text-xs py-1 text-left border">Department</th>
     <th className="px-1 text-xs py-1 text-left border">Program</th>
      <th className="px-1 text-xs py-1 text-left border">Email</th>
      <th className="px-1 text-xs py-1 text-left border">Phone</th>
        <th className="px-1 text-xs py-1 text-left border">Reg. No.</th>
      </tr>
    </thead>
  <tbody>
      {notice?.readBy?.map((entry, index) => {
      const stud = getStudentById(entry.userId);
      const collegeName = getCollegeName(stud.collegeId);
       const deptName = getDepartmentName(stud.departmentId);
       const progName = getProgramName(stud.programId);
        return (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
          >
            <td className="px-1 text-xs py-1 border">{entry.userType}</td>
           <td className="px-1 text-xs py-1 border">{stud.name}</td>
            <td className="px-1 text-xs py-1 border">
              {new Date(entry.readAt).toLocaleString()}
            </td>
            <td className="px-1 text-xs py-1 border">{collegeName}</td>
          <td className="px-1 text-xs py-1 border">{deptName}</td>
          <td className="px-1 text-xs py-1 border">{progName}</td>
           <td className="px-1 text-xs py-1 border">{stud.email}</td>
          <td className="px-1 text-xs py-1 border">{stud.phone}</td>
          <td className="px-1 text-xs py-1 border">{stud.registered_number}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
            <p className="text-sm"><span className="font-bold"></span>Students: {notice?.students?.length}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setViewNotice(notice)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => setEditNotice(notice)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => setDeleteNoticeId(notice._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* View Full Message Modal */}
      {viewMessage && (
  <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-100">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/5 max-h-4/5 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Notice Message</h2>
      <div className="overflow-y-auto max-h-[70vh] p-2">
        <pre className="text-sm">{viewMessage}</pre>
      </div>
      <button
        onClick={() => setViewMessage(null)}
        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full"
      >
        Close
      </button>
    </div>
  </div>
)}



    {/* View Notice Modal */}
    {viewNotice && (
   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-60">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/5 max-h-2/5 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{viewNotice?.title}</h2>
            <pre>{viewNotice?.message}</pre>
            <button
              onClick={() => setViewNotice(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full"
            >
              Close
            </button>
=======
  // DELETE notice via Redux
  const handleDelete = (noticeId) => {
    dispatch(deleteNotice({ universityName, noticeId }))
      .then(() => dispatch(fetchNotices({ universityName, token })));
  };

  // UPDATE notice via Redux
  const handleUpdate = (updatedNotice) => {
    dispatch(updateNotice({
      universityName,
      noticeId: updatedNotice._id,
      updateData: updatedNotice
    })).then(() => dispatch(fetchNotices({ universityName, token })));
  };

  const filteredNotices = notices.filter((notice) => {
    let match = true;
    if (searchTerm) {
      match = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              notice.message.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (priorityFilter) {
      match = match && notice.priority === priorityFilter;
    }
    if (statusFilter) {
      const expired = new Date(notice.expiryDate) < new Date();
      if (statusFilter === "active") match = match && !expired;
      if (statusFilter === "expired") match = match && expired;
    }
    return match;
  });

  const getCollegeName = (collegeId) => {
  const college = colleges.find((col) => col._id === collegeId);
  return college ? college.name : "Unknown";
};
const getDepartmentName = (departmentId) => {
  const department = departments.find((dept) => dept._id === departmentId);
  return department ? department.name : "Unknown";
};
const getProgramName = (programId) => {
  const program = programs.find((prog) => prog._id === programId);
  return program ? program.name : "Unknown";
};
const getStudentById = (id) => students.find((s) => s._id === id) || {};

const isNoticeExpired = (expiryDate) => {
  return new Date(expiryDate) < new Date();
};



  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Notices</h1>
            <p className="text-indigo-100 text-lg">View, edit, and manage all notices</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{filteredNotices.length}</div>
            <div className="text-indigo-200 text-sm">Total Notices</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notices by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Loading notices...</span>
        </div>
      ) : (
        /* Notices List */
        <div className="space-y-6">
          {filteredNotices.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div
                key={notice._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Priority Indicator */}
                <div className={`h-2 ${getPriorityColor(notice?.priority)}`}></div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-900 mr-3">{notice.title}</h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(notice?.priority)}`}>
                          {notice?.priority?.toUpperCase()}
                        </span>
                        {isNoticeExpired(notice.expiryDate) && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full ml-2">
                            <Clock className="w-3 h-3 mr-1" />
                            Expired
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Message:</span>
                        {notice?.message.split(" ").length > 30 ? (
                          <>
                            {notice?.message.split(" ").slice(0, 30).join(" ")}...
                            <button
                              onClick={() => setViewMessage(notice?.message)}
                              className="text-indigo-600 hover:text-indigo-800 ml-1 font-medium"
                            >
                              Read More
                            </button>
                          </>
                        ) : (
                          notice.message
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                          <span className="font-medium">Expires:</span>
                          <span className="ml-1">{new Date(notice?.expiryDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-indigo-600" />
                          <span className="font-medium">Students:</span>
                          <span className="ml-1">{notice?.students?.length || 0}</span>
                        </div>
                      </div>

                      {/* Target Information */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2 text-indigo-600" />
                          <span className="font-medium">Colleges:</span>
                          <span className="ml-1">{notice?.colleges?.map(getCollegeName).join(", ")}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <GraduationCap className="w-4 h-4 mr-2 text-indigo-600" />
                          <span className="font-medium">Departments:</span>
                          <span className="ml-1">{notice?.departments?.map(getDepartmentName).join(", ")}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                          <span className="font-medium">Programs:</span>
                          <span className="ml-1">{notice?.programs?.map(getProgramName).join(", ")}</span>
                        </div>
                      </div>

                      {/* Links */}
                      {notice.link && (
                        <div className="mt-3">
                          <a
                            href={notice.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            <LinkIcon className="w-4 h-4 mr-1" />
                            View Attachment
                          </a>
                        </div>
                      )}

                      {/* Read By Section */}
                      {notice?.readBy?.length > 0 && (
                        <div className="mt-4">
                          <details className="group">
                            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              Read by {notice.readBy.length} students
                              <svg className="w-4 h-4 ml-1 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </summary>
                            <div className="mt-3 max-h-60 overflow-y-auto">
                              <table className="min-w-full text-xs border border-gray-200 rounded-lg">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Name</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Read At</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">College</th>
                                    <th className="px-3 py-2 text-left font-medium text-gray-700">Department</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {notice.readBy.map((entry, index) => {
                                    const student = getStudentById(entry.userId);
                                    return (
                                      <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-3 py-2">{student.name || 'Unknown'}</td>
                                        <td className="px-3 py-2">{new Date(entry.readAt).toLocaleString()}</td>
                                        <td className="px-3 py-2">{getCollegeName(student.collegeId)}</td>
                                        <td className="px-3 py-2">{getDepartmentName(student.departmentId)}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => setViewNotice(notice)}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">View</span>
                      </button>
                      <button
                        onClick={() => setEditNotice(notice)}
                        className="flex items-center text-yellow-600 hover:text-yellow-800 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteNoticeId(notice._id)}
                        className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* View Full Message Modal */}
      {viewMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-3/5 max-h-4/5 overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-600 to-indigo-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Notice Message</h2>
                <button
                  onClick={() => setViewMessage(null)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">{viewMessage}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Notice Modal */}
      {viewNotice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-3/5 max-h-4/5 overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-xl font-bold">{viewNotice?.title}</h2>
                  <p className="text-blue-100 text-sm">Notice Details</p>
                </div>
                <button
                  onClick={() => setViewNotice(null)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">{viewNotice?.message}</pre>
              </div>
            </div>
>>>>>>> vbuzzUpdatedFrontend/main
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {editNotice && (
<<<<<<< HEAD
        <div className="w-full fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
            <h2 className="text-xl font-bold mb-4">Edit Notice</h2>
            <form onSubmit={handleUpdate}>
              <label className="font-bold" >Title</label>
              <input
                type="text"
                value={editNotice.title}
                onChange={(e) => setEditNotice({ ...editNotice, title: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
              />
              <label className="font-bold">Message:</label>
              <textarea
                value={editNotice.message}
                onChange={(e) => setEditNotice({ ...editNotice, message: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
                rows="4"
              ></textarea>

              <label className="font-bold">Priority:</label>
              <input
                type="text"
                value={editNotice.priority}
                onChange={(e) => setEditNotice({ ...editNotice, priority: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Priority (high, medium, low)"
              />
              <label className="font-bold">Expiry Date:</label>
              <input
                type="date"
                value={editNotice?.expiryDate?.split("T")[0]}
                onChange={(e) => setEditNotice({ ...editNotice, expiryDate: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
              />
           {/* edit college, departement and program with multiple dropdown checkbox */}
           <label className="font-bold">PDF:</label>
              <input
                type="text"
                value={editNotice.pdf}
                onChange={(e) => setEditNotice({ ...editNotice, pdf: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="pdf"
              />  
<label className="font-bold">link</label>
              <input
                type="text"
                value={editNotice.link}
                onChange={(e) => setEditNotice({ ...editNotice, link: e.target.value })}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Link (if any)"
              />

              <button
                type="button"
                onClick={() => setEditNotice(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full mb-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
              >
                Update
              </button>
=======
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-4/5 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-yellow-600 to-yellow-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-xl font-bold">Edit Notice</h2>
                  <p className="text-yellow-100 text-sm">Update notice details</p>
                </div>
                <button
                  onClick={() => setEditNotice(null)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editNotice.title}
                    onChange={(e) => setEditNotice({ ...editNotice, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editNotice.priority}
                    onChange={(e) => setEditNotice({ ...editNotice, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={editNotice.message}
                    onChange={(e) => setEditNotice({ ...editNotice, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    rows="6"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={editNotice.expiryDate.split("T")[0]}
                    onChange={(e) => setEditNotice({ ...editNotice, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link (Optional)</label>
                  <input
                    type="url"
                    value={editNotice.link || ''}
                    onChange={(e) => setEditNotice({ ...editNotice, link: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditNotice(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Notice
                </button>
              </div>
>>>>>>> vbuzzUpdatedFrontend/main
            </form>
          </div>
        </div>
      )}

<<<<<<< HEAD
=======
      {/* Delete Confirmation Modal */}
      {deleteNoticeId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Notice</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this notice? This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteNoticeId(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
>>>>>>> vbuzzUpdatedFrontend/main
    </div>
  );
};

<<<<<<< HEAD
export default ManageNotice;
=======
export default ManageNotice;
>>>>>>> vbuzzUpdatedFrontend/main
