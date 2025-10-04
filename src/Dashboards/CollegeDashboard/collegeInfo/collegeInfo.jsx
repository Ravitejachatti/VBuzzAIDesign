// src/pages/CollegeInformation.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Save, X, Plus, Trash2, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCollegeProfile,
  updateCollegeProfile,
} from "../../../Redux/UniversitySlice"; // adjust path if needed

const emptyProfile = {
  vision: "",
  mission: "",
  about: "",
  facilities: "",
  accreditations: [],
  achievements: [],
  partnerships: [],
};

const CollegeInformation = ({ collegeId, token, universityName }) => {
  const dispatch = useDispatch();
  console.log("collegeId, token, universityName", collegeId, token, universityName);

  const { data, loading, saving, error, success } = useSelector(
    (s) => s.colleges?.collegeProfile // slice name is "college" in export `colleges`
  );
  console.log("College profile data:", data);
  // local edit buffer
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyProfile);

  // fetch profile on mount/collegeId/universityName/token change
  useEffect(() => {
    if (!collegeId || !token || !universityName) return;
    dispatch(fetchCollegeProfile({ token, universityName, collegeId }));
  }, [collegeId, token, universityName, dispatch]);

  // when store data loads/changes, sync local form if not editing
  useEffect(() => {
    if (!isEditing) {
      setForm(
        data
          ? {
              vision: data.vision || "",
              mission: data.mission || "",
              about: data.about || "",
              facilities: data.facilities || "",
              accreditations: Array.isArray(data.accreditations)
                ? data.accreditations
                : [],
              achievements: Array.isArray(data.achievements)
                ? data.achievements
                : [],
              partnerships: Array.isArray(data.partnerships)
                ? data.partnerships
                : [],
            }
          : emptyProfile
      );
    }
  }, [data, isEditing]);

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleListChange = (field, index, value) =>
    setForm((f) => {
      const arr = Array.isArray(f[field]) ? [...f[field]] : [];
      arr[index] = value;
      return { ...f, [field]: arr };
    });

  const addListItem = (field) =>
    setForm((f) => {
      const arr = Array.isArray(f[field]) ? [...f[field]] : [];
      arr.push("");
      return { ...f, [field]: arr };
    });

  const removeListItem = (field, index) =>
    setForm((f) => {
      const arr = Array.isArray(f[field]) ? [...f[field]] : [];
      arr.splice(index, 1);
      return { ...f, [field]: arr };
    });

  const onSave = () => {
    const payload = {
      vision: form.vision,
      mission: form.mission,
      about: form.about,
      facilities: form.facilities,
      accreditations: (form.accreditations || []).filter(Boolean), 
      achievements: (form.achievements || []).filter(Boolean),
      partnerships: (form.partnerships || []).filter(Boolean),
    };
    dispatch(
      updateCollegeProfile({ token, universityName, collegeId, profile: payload })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") setIsEditing(false);
    });
  };

  const onCancel = () => {
    setIsEditing(false);
    // reset to store data
    setForm(
      data
        ? {
            vision: data.vision || "",
            mission: data.mission || "",
            about: data.about || "",
            facilities: data.facilities || "",
            accreditations: Array.isArray(data.accreditations)
              ? data.accreditations
              : [],
            achievements: Array.isArray(data.achievements)
              ? data.achievements
              : [],
            partnerships: Array.isArray(data.partnerships)
              ? data.partnerships
              : [],
          }
        : emptyProfile
    );
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">College Profile</h2>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-3 py-1 rounded inline-flex items-center gap-1"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save
              </button>
              <button
                onClick={onCancel}
                disabled={saving}
                className="bg-gray-400 hover:bg-gray-500 disabled:opacity-60 text-white px-3 py-1 rounded inline-flex items-center gap-1"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-3 py-1 rounded inline-flex items-center gap-1"
            >
              <Pencil size={16} />
              Edit
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded border border-green-200 bg-green-50 text-green-800">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading profile…</div>
      ) : (
        <>
          {[
            ["vision", "Vision"],
            ["mission", "Mission"],
            ["about", "About the College"],
            ["facilities", "Facilities"],
          ].map(([field, label]) => (
            <div key={field} className="mb-5">
              <label className="block font-medium mb-2">{label}</label>
              {isEditing ? (
                <textarea
                  rows={field === "facilities" ? 4 : 3}
                  value={form[field] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full border rounded p-2"
                  placeholder={`Enter ${label.toLowerCase()}…`}
                />
              ) : (
                <p className="whitespace-pre-wrap">
                  {form[field] ? form[field] : (
                    <span className="text-gray-500">—</span>
                  )}
                </p>
              )}
            </div>
          ))}

          {[
            ["accreditations", "Accreditations"],
            ["achievements", "Achievements"],
            ["partnerships", "Partnerships"],
          ].map(([field, label]) => (
            <div key={field} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{label}</h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => addListItem(field)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded"
                  >
                    <Plus size={16} /> Add
                  </button>
                )}
              </div>

              {isEditing ? (
                (form[field] || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={item}
                      onChange={(e) =>
                        handleListChange(field, idx, e.target.value)
                      }
                      placeholder={`${label.slice(0, -1)} #${idx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem(field, idx)}
                      className="px-2 rounded bg-red-50 hover:bg-red-100 text-red-600"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (form[field] || []).length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {(form[field] || []).map((item, idx) => (
                    <li key={`${field}-${idx}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">—</p>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CollegeInformation;