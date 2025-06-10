import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageNotice = ({ setUnreadCount }) => {
  const [notices, setNotices] = useState([]);
  const [viewNotice, setViewNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const [error, setError] = useState("");
  const { universityName } = useParams();
  const token = localStorage.getItem("Student token");

  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-yellow-400",
    Low: "bg-green-500",
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

      // Sort notices by createdAt in descending order
      const sortedNotices = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotices(sortedNotices);
      console.log("Sorted Notices in notice pages:", sortedNotices);
      // Update unread notice count
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
      fetchNotices(); // Refresh after marking as read
    } catch (error) {
      console.error("Failed to mark notice as read:", error);
    } finally {
      setMarkingRead(false);
    }
  };

  return (
    <div className="md:p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-1 text-center">Notices</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Loading Button */}
      {loading ? (
        <div className="text-center mb-4">
          <button
            disabled
            className="bg-blue-500 text-white px-4 py-2 rounded animate-pulse"
          >
            Loading Notices...
          </button>
        </div>
      ) : (
        <div className="text-center mb-4">
          <button
            onClick={fetchNotices}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Refresh Notices
          </button>
        </div>
      )}

      {/* Notices List */}
      <ul className="space-y-2">
        {notices.length === 0 ? (
          <p className="text-center text-gray-500">No notices available</p>
        ) : (
          notices.map((notice, index) => (
            <li
              key={notice._id}
              className={`flex border rounded overflow-hidden shadow ${
                notice.isRead ? "bg-white" : "bg-yellow-100"
              }`}
            >
              {/* Colored sidebar for priority */}
              <div
                className={`w-2 ${priorityColors[notice.priority] || "bg-gray-300"}`}
              ></div>

              {/* Notice content */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">
                    {index + 1}. {notice.title}
                    {!notice.isRead && (
                      <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2">
                        New
                      </span>
                    )}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(notice.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  Priority: {notice.priority}
                </p>
                <button
                  onClick={() => {
                    setViewNotice(notice);
                    markAsRead(notice._id);
                  }}
                  className={`mt-3 inline-block text-white px-3 py-1 rounded ${
                    markingRead
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={markingRead}
                >
                  {markingRead ? "Marking..." : "View"}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* View Notice Modal */}
      <Dialog
        open={!!viewNotice}
        onClose={() => setViewNotice(null)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50"
      >
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">
            <strong>Title:</strong> {viewNotice?.title}
          </h2>
          <p className="text-sm mb-2">
            <strong>Message:</strong> {viewNotice?.message}
          </p>
          <p className="text-sm font-semibold">
            Priority: {viewNotice?.priority}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <strong>Posted on: </strong>
            {new Date(viewNotice?.createdAt).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Expire By: </strong>
            {new Date(viewNotice?.expiryDate).toLocaleString()}
          </p>
          <div className="mt-4 text-right">
            <button
              onClick={() => setViewNotice(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default ManageNotice;
