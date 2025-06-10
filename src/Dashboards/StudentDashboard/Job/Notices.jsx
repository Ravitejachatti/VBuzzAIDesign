import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { 
  Bell, 
  Search, 
  Filter, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  RefreshCw,
  Star,
  Archive,
  Trash2,
  Download,
  Share2
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageNotice = ({ setUnreadCount }) => {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [viewNotice, setViewNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { universityName } = useParams();
  const token = localStorage.getItem("Student token");

  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-400",
    Low: "bg-green-500",
  };

  const priorityBadgeColors = {
    High: "bg-red-100 text-red-800 border-red-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Low: "bg-green-100 text-green-800 border-green-200",
  };

  // Fetch notices and update unread count
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/student/notice/allnotices`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );

      const sortedNotices = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotices(sortedNotices);
      setFilteredNotices(sortedNotices);
      
      const unreadCount = sortedNotices.filter((notice) => !notice.isRead).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch notices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [universityName]);

  // Filter notices based on search and filters
  useEffect(() => {
    let filtered = notices;

    if (searchTerm) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(notice => notice.priority === priorityFilter);
    }

    if (statusFilter !== "all") {
      if (statusFilter === "read") {
        filtered = filtered.filter(notice => notice.isRead);
      } else if (statusFilter === "unread") {
        filtered = filtered.filter(notice => !notice.isRead);
      }
    }

    setFilteredNotices(filtered);
  }, [searchTerm, priorityFilter, statusFilter, notices]);

  // Mark notice as read
  const markAsRead = async (noticeId) => {
    try {
      setMarkingRead(true);
      await axios.patch(
        `${BASE_URL}/notice/notices/${noticeId}/read?universityName=${encodeURIComponent(universityName)}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotices();
    } catch (error) {
      console.error("Failed to mark notice as read:", error);
    } finally {
      setMarkingRead(false);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Bell className="w-8 h-8 text-blue-600 mr-3" />
              Notice Board
            </h2>
            <p className="text-gray-600 mt-2">Stay updated with important announcements and notifications</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-lg font-bold">{filteredNotices.filter(n => !n.isRead).length}</div>
                <div className="text-xs opacity-90">Unread</div>
              </div>
            </div>
            <button
              onClick={fetchNotices}
              disabled={loading}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Notices</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <div className="text-center py-16">
          <Bell className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Notices Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || priorityFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search criteria to find more notices."
              : "No notices are available at the moment."}
          </p>
          {(searchTerm || priorityFilter !== "all" || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setPriorityFilter("all");
                setStatusFilter("all");
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice, index) => (
            <div
              key={notice._id}
              className={`bg-white rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 overflow-hidden ${
                notice.isRead ? "border-gray-200" : "border-blue-200 bg-blue-50/30"
              }`}
            >
              <div className="flex">
                {/* Priority Indicator */}
                <div className={`w-2 ${priorityColors[notice.priority] || "bg-gray-300"}`}></div>

                {/* Notice Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          {index + 1}. {notice.title}
                          {!notice.isRead && (
                            <span className="ml-3 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          )}
                        </h3>
                        {isExpiringSoon(notice.expiryDate) && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                            Expiring Soon
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Expires: {new Date(notice.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-4 line-clamp-2">
                        {notice.message}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className={`flex items-center px-3 py-1 rounded-full border text-sm font-medium ${priorityBadgeColors[notice.priority]}`}>
                        {getPriorityIcon(notice.priority)}
                        <span className="ml-1">{notice.priority}</span>
                      </div>
                      {!notice.isRead && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setViewNotice(notice);
                        if (!notice.isRead) {
                          markAsRead(notice._id);
                        }
                      }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Notice Modal */}
      <Dialog open={!!viewNotice} onClose={() => setViewNotice(null)} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <Dialog.Title className="text-2xl font-bold mb-2">
                    {viewNotice?.title}
                  </Dialog.Title>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">Posted: {new Date(viewNotice?.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">Expires: {new Date(viewNotice?.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border-2 border-white/30 ${priorityBadgeColors[viewNotice?.priority]} bg-white/20 text-white border-white/50`}>
                  <div className="flex items-center">
                    {getPriorityIcon(viewNotice?.priority)}
                    <span className="ml-1 font-medium">{viewNotice?.priority}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6 border">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Notice Details</h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {viewNotice?.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {viewNotice?.isRead ? 'Already read' : 'Marked as read'}
                </div>
                <button
                  onClick={() => setViewNotice(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ManageNotice;