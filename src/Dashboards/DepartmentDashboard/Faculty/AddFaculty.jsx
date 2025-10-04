import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFaculty, resetFacultyState } from "../../../Redux/College/faculty";
import { useLocation, useParams } from "react-router-dom";

function safeParseJSON(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

const AddFaculty = () => {
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.faculty);

  // Router context (you still pass user via location sometimes)
  const location = useLocation();
  const routeUser = location.state?.user || null;

  const { universityName } = useParams();

  // Redux state
  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];

  // Logged-in user from localStorage (fallback if route state missing)
  const rawUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const storedUser = rawUser ? safeParseJSON(rawUser) : null;

  // Prefer route user, else stored user
  const user = routeUser || storedUser || {};

  // Locked IDs from user + derived from department record
  const LOCKED_UNIVERSITY_ID = user?.universityId || "";
  const LOCKED_DEPARTMENT_ID = user?.departmentId || "";

  // Find department record to derive college
  const deptRecord = useMemo(
    () => departments.find((d) => d._id === LOCKED_DEPARTMENT_ID),
    [departments, LOCKED_DEPARTMENT_ID]
  );

  // Support either d.collegeId or d.college?._id
  const LOCKED_COLLEGE_ID = deptRecord?.college || deptRecord?.college?._id || "";

  // Readable names (for read-only inputs)
  const collegeName =
    colleges.find((c) => c._id === LOCKED_COLLEGE_ID)?.name || "—";
  const departmentName =
    departments.find((d) => d._id === LOCKED_DEPARTMENT_ID)?.name || "—";

  // Initial form state (lock IDs here)
  const initialFaculty = useMemo(
    () => ({
      name: "",
      email: "",
      phone: "",
      universityId: LOCKED_UNIVERSITY_ID,
      collegeId: LOCKED_COLLEGE_ID,
      departmentId: LOCKED_DEPARTMENT_ID,
      status: "active",
      profilePictureUrl: "",
      bio: "",
    }),
    [LOCKED_UNIVERSITY_ID, LOCKED_COLLEGE_ID, LOCKED_DEPARTMENT_ID]
  );

  const [faculty, setFaculty] = useState(initialFaculty);

  // If locked IDs change after Redux lists load, re-apply them to the form
  useEffect(() => {
    setFaculty((prev) => ({
      ...prev,
      universityId: LOCKED_UNIVERSITY_ID,
      collegeId: LOCKED_COLLEGE_ID,
      departmentId: LOCKED_DEPARTMENT_ID,
    }));
  }, [LOCKED_UNIVERSITY_ID, LOCKED_COLLEGE_ID, LOCKED_DEPARTMENT_ID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFaculty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use your existing token key (you had a space in the key name)
    const token = localStorage.getItem("University authToken");

    // Force locked IDs into payload regardless of UI
    const payload = {
      ...faculty,
      universityId: LOCKED_UNIVERSITY_ID,
      collegeId: LOCKED_COLLEGE_ID,
      departmentId: LOCKED_DEPARTMENT_ID,
    };

    if (payload.name && payload.email && payload.phone) {
      try {
        await dispatch(
          addFaculty({ facultyData: payload, universityName, token })
        ).unwrap();
        setMessages([
          { status: "success", message: `${payload.name} added successfully.` },
        ]);
        setFaculty(initialFaculty); // reset but keep locked IDs
      } catch (err) {
        setMessages([
          {
            status: "error",
            message: `${payload.name || "Faculty"} failed: ${err}`,
          },
        ]);
      }
    } else {
      setMessages([
        { status: "error", message: `All required fields must be filled.` },
      ]);
    }

    dispatch(resetFacultyState());
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

            {/* Read-only: University/College/Department (IDs sent in payload) */}
            <input
              name="universityNameDisplay"
              value={universityName || "—"}
              readOnly
              placeholder="University"
              className="p-2 border rounded bg-gray-50"
            />
            <input
              name="collegeNameDisplay"
              value={collegeName}
              readOnly
              placeholder="College"
              className="p-2 border rounded bg-gray-50"
            />
            <input
              name="departmentNameDisplay"
              value={departmentName}
              readOnly
              placeholder="Department"
              className="p-2 border rounded bg-gray-50"
            />

            {/* Hidden inputs (optional) if you want IDs in the form, but we already force in payload */}
            {/* <input type="hidden" name="universityId" value={LOCKED_UNIVERSITY_ID} />
            <input type="hidden" name="collegeId" value={LOCKED_COLLEGE_ID} />
            <input type="hidden" name="departmentId" value={LOCKED_DEPARTMENT_ID} /> */}

            {/* Status and profile picture */}
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
            disabled={loading}
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
              className={`p-3 rounded text-sm ${
                msg.status === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
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