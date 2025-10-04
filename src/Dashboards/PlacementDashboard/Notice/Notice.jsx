// AddNotice.jsx (merged: functionality of v1 + design of v2 + Type dropdown)

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addNotice, clearNoticeState } from "../../../Redux/Placement/noticeSlice";
import {
  Bell, Plus, AlertTriangle, CheckCircle, Send
} from "lucide-react";

const TYPE_OPTIONS = [
  { value: "job", label: "Job" },
  { value: "round", label: "Round" },
  { value: "training", label: "Training" },
  { value: "circular", label: "Circular" },
  { value: "events", label: "Events" },
  { value: "other", label: "Other" },
];

const AddNotice = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();

  // Redux slices
  const { loading, error, success } = useSelector((s) => s.createNotice);
  const colleges = useSelector((s) => s.colleges.colleges) || [];
  const departments = useSelector((s) => s.department.departments) || [];
  const programs = useSelector((s) => s.programs.programs) || [];
  const studentsRaw = useSelector((s) => s.students.students) || [];
  const studentList = Array.isArray(studentsRaw)
    ? studentsRaw
    : Array.isArray(studentsRaw.students)
    ? studentsRaw.students
    : [];

  // Form state (keep)
  const [formData, setFormData] = useState({
    type: "job",           // dropdown default
    title: "",
    message: "",
    link: "",
    colleges: [],
    departments: [],
    programs: [],
    students: [],
    priority: "medium",
    openingDate: new Date(),
    expiryDate: new Date(),
  });

  // Dropdown open flags (keep)
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [programDropdownOpen, setProgramDropdownOpen] = useState(false);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);

  // Derived lists (keep)
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Colleges → Departments
  useEffect(() => {
    if (formData.colleges.length === 0) {
      setFilteredDepartments([]);
      setFormData((prev) => ({ ...prev, departments: [], programs: [] }));
      return;
    }
    const filtered = departments.filter((dept) =>
      formData.colleges.includes(dept.college)
    );
    setFilteredDepartments(filtered);
    // reset downstream
    setFormData((prev) => ({ ...prev, departments: [], programs: [] }));
  }, [formData.colleges, departments]);

  // Departments → Programs
  useEffect(() => {
    if (formData.departments.length === 0) {
      setFilteredPrograms([]);
      setFormData((prev) => ({ ...prev, programs: [] }));
      return;
    }
    const deptPrograms = departments
      .filter((d) => formData.departments.includes(d._id))
      .flatMap((d) => d.programs);
    const uniquePrograms = programs.filter((p) => deptPrograms.includes(p._id));
    setFilteredPrograms(uniquePrograms);
    setFormData((prev) => ({ ...prev, programs: [] }));
  }, [formData.departments, departments, programs]);

  // Programs initial (nice to have)
  useEffect(() => setFilteredPrograms(programs), [programs]);

  // Departments + Programs → Students (auto-select)
  useEffect(() => {
    const fs = studentList.filter(
      (s) =>
        formData.departments.includes(s.departmentId) &&
        formData.programs.includes(s.programId)
    );
    setFilteredStudents(fs);
    setFormData((prev) => ({ ...prev, students: fs.map((s) => s._id) }));
  }, [formData.departments, formData.programs, studentList]);

  // Select all helper (keep)
  const handleSelectAll = (key, items) => {
    setFormData((prev) => ({ ...prev, [key]: items.map((i) => i._id) }));
  };

  // Toggle item helper (keep)
  const toggleSelection = (key, id) => {
    setFormData((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
      };
    });
  };

  // Submit (keep)
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      openingDate: formData.openingDate.toISOString(),
      expiryDate: formData.expiryDate.toISOString(),
    };
    dispatch(clearNoticeState());
    dispatch(addNotice({ universityName, noticeData: payload }))
      .unwrap()
      .then(() => {
        setFormData({
          type: "job",
          title: "",
          message: "",
          link: "",
          colleges: [],
          departments: [],
          programs: [],
          students: [],
          priority: "medium",
          openingDate: new Date(),
          expiryDate: new Date(),
        });
      });
  };

  return (
    <div className="space-y-8">
      {/* DESIGN from v2 */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Create Notice</h1>
            <p className="text-green-100 text-lg">Send announcements to students</p>
          </div>
          <Bell className="w-16 h-16 text-green-200" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b flex items-center">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <Plus className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Notice Details</h2>
            <p className="text-sm text-gray-600">Fill in the details below</p>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" /> {error}
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type DROPDOWN (requested) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment Link</label>
            <input
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="https://…"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opening Date</label>
            <DatePicker
              selected={formData.openingDate}
              onChange={(d) => setFormData({ ...formData, openingDate: d })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              showTimeSelect
              dateFormat="Pp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <DatePicker
              selected={formData.expiryDate}
              minDate={formData.openingDate}
              onChange={(d) => setFormData({ ...formData, expiryDate: d })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              showTimeSelect
              dateFormat="Pp"
            />
          </div>

          {/* -------- Cascading selection UI from v1 (functionality) -------- */}
          <Dropdown
            label="Colleges"
            items={colleges}
            selected={formData.colleges}
            open={collegeDropdownOpen}
            onToggle={() => setCollegeDropdownOpen((o) => !o)}
            onSelectAll={() => handleSelectAll("colleges", colleges)}
            onToggleItem={(id) => toggleSelection("colleges", id)}
            itemLabel={(c) => c.name}
          />

          <Dropdown
            label="Departments"
            items={filteredDepartments}
            selected={formData.departments}
            open={departmentDropdownOpen}
            onToggle={() => setDepartmentDropdownOpen((o) => !o)}
            onSelectAll={() => handleSelectAll("departments", filteredDepartments)}
            onToggleItem={(id) => toggleSelection("departments", id)}
            itemLabel={(d) => d.name}
          />

          <Dropdown
            label="Programs"
            items={filteredPrograms}
            selected={formData.programs}
            open={programDropdownOpen}
            onToggle={() => setProgramDropdownOpen((o) => !o)}
            onSelectAll={() => handleSelectAll("programs", filteredPrograms)}
            onToggleItem={(id) => toggleSelection("programs", id)}
            itemLabel={(p) => p.name}
          />

          <Dropdown
            label="Students"
            items={filteredStudents}
            selected={formData.students}
            open={studentDropdownOpen}
            onToggle={() => setStudentDropdownOpen((o) => !o)}
            onSelectAll={() => handleSelectAll("students", filteredStudents)}
            onToggleItem={(id) => toggleSelection("students", id)}
            itemLabel={(s) => `${s.name} (${s.registered_number})`}
            allColSpan
          />

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : (<><Send className="w-5 h-5 mr-1" /> Add Notice</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/** Reusable dropdown with Select-All + checkboxes (from v1) */
const Dropdown = ({
  label,
  items,
  selected,
  open,
  onToggle,
  onSelectAll,
  onToggleItem,
  itemLabel,
  allColSpan = false,
}) => (
  <div className={allColSpan ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type="text"
        readOnly
        value={
          selected
            .map((id) => {
              const it = items.find((i) => i._id === id);
              return it ? itemLabel(it) : "";
            })
            .filter(Boolean)
            .join(", ")
        }
        onClick={onToggle}
        placeholder={`Select ${label}`}
        className="w-full px-4 py-2 border rounded-lg bg-white cursor-pointer focus:ring-2 focus:ring-green-500"
      />
      {open && (
        <div className="absolute z-20 bg-white border rounded-lg shadow-md w-full max-h-56 overflow-y-auto mt-1">
          <label className="flex items-center px-3 py-2 text-sm hover:bg-gray-50">
            <input
              type="checkbox"
              className="mr-2"
              checked={items.length > 0 && selected.length === items.length}
              onChange={onSelectAll}
            />
            Select All
          </label>
          <div className="border-t" />
          {items.map((i) => (
            <label key={i._id} className="flex items-center px-3 py-2 text-sm hover:bg-gray-50">
              <input
                type="checkbox"
                className="mr-2"
                checked={selected.includes(i._id)}
                onChange={() => onToggleItem(i._id)}
              />
              {itemLabel(i)}
            </label>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default AddNotice;
