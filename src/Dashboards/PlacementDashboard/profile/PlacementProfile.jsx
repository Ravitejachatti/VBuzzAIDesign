// src/pages/PlacementProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Field = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-medium break-all">{value ?? "-"}</span>
  </div>
);

// Inline helpers (no extra files)
const getToken = () => localStorage.getItem("University authToken") || "";
const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const parseJwt = (token) => {
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!base64) return null;
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const PlacementProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());

  // Read supporting context from localStorage
  const universityName = localStorage.getItem("universityName") || "";
  const uniIdStorage = localStorage.getItem("universityId") || "";
  const placementNameStorage = localStorage.getItem("placementName") || "";
  const placementDirectorName = localStorage.getItem("placementDirectorName") || "";

  // Decode token to show expiry etc.
  const jwt = useMemo(() => parseJwt(token), [token]);
  const expiry = useMemo(() => {
    if (!jwt?.exp) return "-";
    return new Date(jwt.exp * 1000).toLocaleString();
  }, [jwt]);

  // If not logged in, redirect to login
  useEffect(() => {
    if (!user || !token) {
      navigate("/login", { replace: true });
    }
  }, [user, token, navigate]);

  // Optional: live-refresh if another tab updates storage
  useEffect(() => {
    const onStorage = () => {
      setUser(getUser());
      setToken(getToken());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!user) return null; // brief guard while redirecting

  const handleLogout = () => {
    localStorage.removeItem("University authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("universityAuth");
    localStorage.removeItem("universityName");
    localStorage.removeItem("universityId");
    localStorage.removeItem("placementName");
    localStorage.removeItem("placementDirectorName");
    window.dispatchEvent(new Event("storage"));
    navigate("/login", { replace: true });
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token || "");
      alert("Token copied to clipboard.");
    } catch {
      alert("Failed to copy token.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold">Placement Profile</h1>
        <p className="text-indigo-100 mt-1">
          Signed in as <span className="font-semibold">{user.role}</span>
        </p>
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl shadow border p-6 space-y-6">
        <h2 className="text-xl font-semibold">Account</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" value={user.name} />
          <Field label="Email" value={user.email} />
          <Field label="Role" value={user.role} />
          <Field label="User ID" value={user.id} />
        </div>
      </div>

      {/* University & Placement */}
      <div className="bg-white rounded-2xl shadow border p-6 space-y-6">
        <h2 className="text-xl font-semibold">University & Placement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="University Name (storage)" value={universityName} />
          <Field label="University ID (from user)" value={user.universityId} />
          <Field label="University ID (storage)" value={uniIdStorage} />
          <Field
            label="Placement Name"
            value={user.placementname || placementNameStorage}
          />
          <Field label="Placement ID" value={user.placementId} />
          {user.role === "PlacementDirector" && (
            <Field
              label="Placement Director (storage)"
              value={placementDirectorName || user.name}
            />
          )}
        </div>
      </div>

      {/* Session */}
      <div className="bg-white rounded-2xl shadow border p-6 space-y-6">
        <h2 className="text-xl font-semibold">Session</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="JWT (short)"
            value={token ? token.slice(0, 24) + "..." : "-"}
          />
          <Field label="Token Expires At" value={expiry} />
          <Field label="JWT userId (payload)" value={jwt?.userId} />
          <Field label="JWT role (payload)" value={jwt?.role} />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            onClick={copyToken}
          >
            Copy Token
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlacementProfile;
