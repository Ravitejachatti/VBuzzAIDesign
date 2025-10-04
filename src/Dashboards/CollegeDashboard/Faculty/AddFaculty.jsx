import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFaculty, resetFacultyState } from "../../../Redux/College/faculty";
import { useLocation, useParams } from "react-router-dom";

const AddFaculty = () => {
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.faculty);

  const location = useLocation();
  const user = location.state?.user || {};
  const { universityName } = useParams();

  // ✅ Pull colleges & departments from Redux state
  // Adjust selectors to match your slices (e.g., state.university.colleges)
  const colleges = useSelector((state) => state.colleges?.colleges || []);
  const departments = useSelector((state) => state.department?.departments || []);

  // Find the current college from Redux using the logged-in user's collegeId
  const currentCollege = useMemo(
    () => colleges.find((c) => c?._id === user.collegeId),
    [colleges, user.collegeId]
  );

  // Display names (from state) with safe fallbacks
  const collegeDisplayName = currentCollege?.name || "—";
  // If you keep the university name in Redux, you can derive it; for now use URL param as display
  const universityDisplayName = universityName || "—";

  const initialFaculty = {
    name: "",
    email: "",
    phone: "",
    universityId: user.universityId || "", // locked id (hidden)
    collegeId: user.collegeId || "",       // locked id (hidden)
    departmentId: "",
    status: "active",
    profilePictureUrl: "",
    bio: "",
  };

  const [faculty, setFaculty] = useState(initialFaculty);

  // Keep locked IDs synced with user context
  useEffect(() => {
    setFaculty((prev) => ({
      ...prev,
      universityId: user.universityId || "",
      collegeId: user.collegeId || "",
    }));
  }, [user.universityId, user.collegeId]);

  // ✅ Filter departments by the current college from Redux
  const collegeDepartments = useMemo(() => {
    if (!currentCollege?._id) return [];
    const cid = currentCollege._id;
    return departments.filter((d) => {
      // support multiple shapes: d.collegeId, d.college, d.college._id
      return (
        d.collegeId === cid ||
        d.college === cid ||
        (d.college && d.college._id === cid)
      );
    });
  }, [departments, currentCollege?._id]);

  // Clear invalid selected department if user context / list changes
  useEffect(() => {
    if (faculty.departmentId) {
      const stillValid = collegeDepartments.some((d) => d._id === faculty.departmentId);
      if (!stillValid) {
        setFaculty((prev) => ({ ...prev, departmentId: "" }));
      }
    }
  }, [collegeDepartments, faculty.departmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFaculty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("University authToken");
    if (!token) {
      setMessages([{ status: "error", message: "Authentication token is missing." }]);
      return;
    }

    if (!faculty.name || !faculty.email || !faculty.phone || !faculty.departmentId) {
      setMessages([{ status: "error", message: "All required fields must be filled." }]);
      return;
    }

    // Guard: department must belong to this college
    const deptValid = collegeDepartments.some((d) => d._id === faculty.departmentId);
    if (!deptValid) {
      setMessages([{ status: "error", message: "Please select a department from your college." }]);
      return;
    }

    try {
      await dispatch(addFaculty({ facultyData: faculty, universityName, token })).unwrap();
      setMessages([{ status: "success", message: `${faculty.name} added successfully.` }]);
      setFaculty({
        ...initialFaculty,
        universityId: user.universityId || "",
        collegeId: user.collegeId || "",
      });
    } catch (err) {
      setMessages([{
        status: "error",
        message: `${faculty.name || "Faculty"} failed: ${typeof err === "string" ? err : err?.message || "Unknown error"}`,
      }]);
    } finally {
      dispatch(resetFacultyState());
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Faculty Member</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border border-gray-300 rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <input
              name="name"
              value={faculty.name}
              onChange={handleChange}
              placeholder="Name"
              className="p-2 border rounded"
              required
            />
            <input
              name="email"
              type="email"
              value={faculty.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-2 border rounded"
              required
            />
            <input
              name="phone"
              value={faculty.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="p-2 border rounded"
              required
            />

            {/* 👁️ Visible names from Redux state */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">University</label>
              <input
                value={universityDisplayName}
                readOnly
                className="p-2 border rounded bg-gray-100 text-gray-700 w-full"
              />
              {/* Hidden id for submit */}
              <input type="hidden" name="universityId" value={faculty.universityId} />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">College</label>
              <input
                value={collegeDisplayName}
                readOnly
                className="p-2 border rounded bg-gray-100 text-gray-700 w-full"
              />
              {/* Hidden id for submit */}
              <input type="hidden" name="collegeId" value={faculty.collegeId} />
            </div>

            {/* ✅ Department filtered by current college */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Department</label>
              <select
                name="departmentId"
                value={faculty.departmentId}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              >
                <option value="">Select Department</option>
                {collegeDepartments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <input
              name="status"
              value={faculty.status}
              onChange={handleChange}
              placeholder="Status"
              className="p-2 border rounded"
            />
            <input
              name="profilePictureUrl"
              value={faculty.profilePictureUrl}
              onChange={handleChange}
              placeholder="Profile Picture URL"
              className="p-2 border rounded"
            />
          </div>

          <textarea
            name="bio"
            value={faculty.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !faculty.departmentId}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Add Faculty"}
          </button>
        </div>
      </form>

      {messages.length > 0 && (
        <div className="mt-6 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded text-sm ${msg.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {msg.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddFaculty;