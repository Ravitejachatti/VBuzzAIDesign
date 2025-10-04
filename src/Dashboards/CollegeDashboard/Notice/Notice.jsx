<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> vbuzzUpdatedFrontend/main
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
<<<<<<< HEAD
<<<<<<< HEAD
import {
  addNotice,
  clearNoticeState
} from "../../../Redux/Placement/noticeSlice.js";
=======
import { addNotice, clearNoticeState } from "../../../Redux/Placement/noticeSlice";
import { 
  Bell, Plus, Calendar, Users, Building, GraduationCap, 
  AlertTriangle, CheckCircle, FileText, Link as LinkIcon, 
  Send, ChevronDown 
} from "lucide-react";
>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04

const AddNotice = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const { loading, error, success } = useSelector((state) => state.createNotice);
<<<<<<< HEAD

  // Static lists from Redux
=======
import { addNotice, clearNoticeState } from "../../../Redux/Placement/noticeSlice";
import { 
  Bell, Plus, AlertTriangle, CheckCircle, Send 
} from "lucide-react";

/* ---------- Reusable multi-select dropdown ---------- */
const Dropdown = ({
  label,
  items,
  selected,
  onSelectAll,
  onToggleItem,
  itemLabel,
  className = "",
}) => {
  const [open, setOpen] = useState(false);

  const previewText = selected
    .map((id) => {
      const item = items.find((i) => i._id === id);
      return item ? itemLabel(item) : "";
    })
    .filter(Boolean)
    .join(", ");

  const allSelected = items.length > 0 && selected.length === items.length;

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="text"
        readOnly
        value={previewText}
        placeholder={`Select ${label}`}
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-2 border rounded-lg bg-white cursor-pointer"
      />
      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          <label className="flex items-center px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={allSelected}
              onChange={onSelectAll}
            />
            Select All
          </label>
          <div className="border-t border-gray-100" />
          {items.map((item) => (
            <label
              key={item._id}
              className="flex items-center px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selected.includes(item._id)}
                onChange={() => onToggleItem(item._id)}
              />
              {itemLabel(item)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
/* ---------------------------------------------------- */

const AddNotice = () => {
  const dispatch = useDispatch();
  const { universityName } = useParams();

  // Redux state
  const { loading, error, success } = useSelector((state) => state.createNotice);
>>>>>>> vbuzzUpdatedFrontend/main
  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const studentsRaw = useSelector((state) => state.students.students) || [];
<<<<<<< HEAD
  const studentList = Array.isArray(studentsRaw)
=======
  // Defensive: students could be in state.students.students or nested under .students
  const students = Array.isArray(studentsRaw)
>>>>>>> vbuzzUpdatedFrontend/main
    ? studentsRaw
    : Array.isArray(studentsRaw.students)
    ? studentsRaw.students
    : [];

<<<<<<< HEAD
  const { universityName } = useParams();

  // Form state
=======
  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];
  const students = useSelector((state) => state.students.students) || [];

>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    message: "",
    link: "",
    colleges: [],
    departments: [],
    programs: [],
    students: [],
=======
  // Form data
  const [formData, setFormData] = useState({
    type: "",            // NEW: notice type (job / round / circular / etc.)
    title: "",
    message: "",
    link: "",
    colleges: [],        // array of college _id
    departments: [],     // array of department _id
    programs: [],        // array of program _id
    students: [],        // array of student _id
>>>>>>> vbuzzUpdatedFrontend/main
    priority: "medium",
    openingDate: new Date(),
    expiryDate: new Date(),
  });

<<<<<<< HEAD
<<<<<<< HEAD
  // Dropdown toggles
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [programDropdownOpen, setProgramDropdownOpen] = useState(false);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
=======
  const [dropdowns, setDropdowns] = useState({
    colleges: false, departments: false, programs: false, students: false
  });
>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04

  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    if (!formData.colleges.length) {
      setFilteredDepartments([]);
      return;
    }
    const filtered = departments.filter(d => formData.colleges.includes(d.college));
    setFilteredDepartments(filtered);
    setFormData(prev => ({ ...prev, departments: [], programs: [] }));
  }, [formData.colleges, departments]);

  useEffect(() => {
    if (!formData.departments.length) {
      setFilteredPrograms([]);
      return;
    }
    const deptPrograms = departments
      .filter(d => formData.departments.includes(d._id))
      .flatMap(d => d.programs);
    const uniquePrograms = programs.filter(p => deptPrograms.includes(p._id));
    setFilteredPrograms(uniquePrograms);
    setFormData(prev => ({ ...prev, programs: [] }));
  }, [formData.departments, departments, programs]);

  useEffect(() => {
    const fs = students.filter(
      s => formData.departments.includes(s.departmentId) && formData.programs.includes(s.programId)
    );
    setFilteredStudents(fs);
    setFormData(prev => ({ ...prev, students: fs.map(s => s._id) }));
  }, [formData.departments, formData.programs, students]);

  const handleSelectAll = (key, items) => {
    const allSelected = formData[key].length === items.length;
    setFormData(prev => ({ ...prev, [key]: allSelected ? [] : items.map(i => i._id) }));
  };

<<<<<<< HEAD
  // Toggle single selection
  const toggleSelection = (key, id) => {
=======
  // Derived lists for cascades
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  /* ---------------------- Cascades ---------------------- */
  // Colleges -> Departments
  useEffect(() => {
    if (formData.colleges.length === 0) {
      setFilteredDepartments([]);
      // Clear downstream
      setFormData((prev) => ({ ...prev, departments: [], programs: [], students: [] }));
      return;
    }
    const selectedCollegeIds = new Set(formData.colleges);
    const filtered = departments.filter((d) => {
      const collegeId = typeof d.college === "object" ? d.college?._id : d.college;
      return selectedCollegeIds.has(collegeId);
    });
    setFilteredDepartments(filtered);
    // Reset downstream when colleges change
    setFormData((prev) => ({ ...prev, departments: [], programs: [], students: [] }));
  }, [formData.colleges, departments]);

  // Departments -> Programs
  useEffect(() => {
    if (formData.departments.length === 0) {
      setFilteredPrograms([]);
      // Clear programs & students when departments cleared
      setFormData((prev) => ({ ...prev, programs: [], students: [] }));
      return;
    }
    const selectedDeptIds = new Set(formData.departments);
    const deptPrograms = departments
      .filter((d) => selectedDeptIds.has(d._id))
      .flatMap((d) => d.programs || []);
    // program refs may be objects or ids
    const programIds = new Set(
      deptPrograms.map((p) => (typeof p === "object" ? p._id : p))
    );
    const uniquePrograms = programs.filter((p) => programIds.has(p._id));
    setFilteredPrograms(uniquePrograms);
    // Reset programs & students on department change
    setFormData((prev) => ({ ...prev, programs: [], students: [] }));
  }, [formData.departments, departments, programs]);

  // Departments + Programs -> Students
  useEffect(() => {
    const deptSet = new Set(formData.departments);
    const progSet = new Set(formData.programs);
    const fs = students.filter((s) => {
      const sDept = typeof s.departmentId === "object" ? s.departmentId?._id : s.departmentId;
      const sProg = typeof s.programId === "object" ? s.programId?._id : s.programId;
      return deptSet.has(sDept) && progSet.has(sProg);
    });
    setFilteredStudents(fs);
    // Auto-select all filtered students (you can remove this if you want manual pick)
    setFormData((prev) => ({ ...prev, students: fs.map((s) => s._id) }));
  }, [formData.departments, formData.programs, students]);
  /* ------------------------------------------------------ */

  /* ------------- Select-all & Toggle helpers ------------ */
  const handleSelectAll = (key, items) => {
    const allSelected = formData[key].length === items.length;
    setFormData((prev) => ({
      ...prev,
      [key]: allSelected ? [] : items.map((i) => i._id),
    }));
  };

  const toggleItem = (key, id) => {
>>>>>>> vbuzzUpdatedFrontend/main
    setFormData((prev) => {
      const arr = prev[key];
      return {
        ...prev,
<<<<<<< HEAD
        [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
=======
  const toggleItem = (key, id) => {
    setFormData(prev => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(id) ? arr.filter(i => i !== id) : [...arr, id]
>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04
      };
    });
  };

<<<<<<< HEAD
  // Submit handler
=======
        [key]: arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id],
      };
    });
  };
  /* ------------------------------------------------------ */

  /* -------------------- Submit logic -------------------- */
>>>>>>> vbuzzUpdatedFrontend/main
=======
>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
          type: "",
>>>>>>> vbuzzUpdatedFrontend/main
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
=======
          type: "", title: "", message: "", link: "",
          colleges: [], departments: [], programs: [], students: [],
          priority: "medium", openingDate: new Date(), expiryDate: new Date(),
>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04
        });
      });
  };
<<<<<<< HEAD

  const getSelectedText = (selectedIds, items) => {
    if (!selectedIds.length) return "Select";
    if (selectedIds.length === 1) {
      const item = items.find(i => i._id === selectedIds[0]);
      return item ? item.name : "1 selected";
    }
    return `${selectedIds.length} selected`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
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

        {error && <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center"><AlertTriangle className="w-5 h-5 mr-2" />{error}</div>}
        {success && <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center"><CheckCircle className="w-5 h-5 mr-2" />{success}</div>}

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notice Type *</label>
            <input value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" required />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" required />
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
              rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" required />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment Link</label>
            <input value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>

          {/* Date pickers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opening Date</label>
            <DatePicker selected={formData.openingDate} onChange={d => setFormData({ ...formData, openingDate: d })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <DatePicker selected={formData.expiryDate} minDate={formData.openingDate}
              onChange={d => setFormData({ ...formData, expiryDate: d })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>

          {/* Example dropdown for Colleges */}
          {/* Similar dropdown pattern can be used for Departments, Programs, Students with toggleItem, handleSelectAll */}

<<<<<<< HEAD
        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <DatePicker
            selected={formData.expiryDate}
            onChange={(date) =>
              setFormData({ ...formData, expiryDate: date })
            }
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Submit */}
        <div className="col-span-3 text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Submitting…' : 'Add Notice'}
          </button>
        </div>
      </form>
=======
  /* ------------------------------------------------------ */

  return (
    <div className="space-y-8">
      {/* Header */}
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
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notice Type *</label>
            <input
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="e.g., job, round, circular"
              required
            />
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

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment Link</label>
            <input
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://… (PDF, doc, etc.)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opening Date</label>
            <DatePicker
              selected={formData.openingDate}
              onChange={(d) => setFormData({ ...formData, openingDate: d })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <DatePicker
              selected={formData.expiryDate}
              minDate={formData.openingDate}
              onChange={(d) => setFormData({ ...formData, expiryDate: d })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* --- Real dropdowns wired to formData + cascades --- */}
          <Dropdown
            label="Colleges"
            items={colleges}
            selected={formData.colleges}
            onSelectAll={() => handleSelectAll("colleges", colleges)}
            onToggleItem={(id) => toggleItem("colleges", id)}
            itemLabel={(c) => c.name}
          />

          <Dropdown
            label="Departments"
            items={filteredDepartments}
            selected={formData.departments}
            onSelectAll={() => handleSelectAll("departments", filteredDepartments)}
            onToggleItem={(id) => toggleItem("departments", id)}
            itemLabel={(d) => d.name}
          />

          <Dropdown
            label="Programs"
            items={filteredPrograms}
            selected={formData.programs}
            onSelectAll={() => handleSelectAll("programs", filteredPrograms)}
            onToggleItem={(id) => toggleItem("programs", id)}
            itemLabel={(p) => p.name}
          />

          {/* Students (full width) */}
          <div className="md:col-span-2">
            <Dropdown
              label="Students"
              items={filteredStudents}
              selected={formData.students}
              onSelectAll={() => handleSelectAll("students", filteredStudents)}
              onToggleItem={(id) => toggleItem("students", id)}
              itemLabel={(s) => `${s.name} (${s.registered_number})`}
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              {loading ? "Submitting..." : (<><Send className="w-5 h-5 mr-1" /> Add Notice</>)}
=======
          {/* Submit button */}
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Submitting..." : <><Send className="w-5 h-5 mr-1" /> Add Notice</>}
>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04
            </button>
          </div>
        </form>
      </div>
<<<<<<< HEAD
>>>>>>> vbuzzUpdatedFrontend/main
=======
>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04
    </div>
  );
};

<<<<<<< HEAD
<<<<<<< HEAD
/**
 * Reusable dropdown component with select-all.
 * Props: label, items, selected, open, onToggle, onSelectAll, onToggleItem, itemLabel, allColSpan?
 */
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
  <div className={allColSpan ? 'col-span-3' : ''}>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative">
      <input
        type="text"
        readOnly
        value={
          selected
            .map((id) => {
              const item = items.find((i) => i._id === id);
              return item ? itemLabel(item) : '';
            })
            .join(', ')
        }
        onClick={onToggle}
        placeholder={`Select ${label}`}
        className="w-full p-2 border rounded bg-white cursor-pointer"
      />
      {open && (
        <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
          <label className="flex items-center p-1 text-xs hover:bg-gray-100">
            <input
              type="checkbox"
              className="form-checkbox mr-1"
              checked={items.length > 0 && selected.length === items.length}
              onChange={(e) => onSelectAll()}
            />
            Select All
          </label>
          {items.map((i) => (
            <label key={i._id} className="flex items-center p-1 text-xs hover:bg-gray-100">
              <input
                type="checkbox"
                className="form-checkbox mr-1"
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
=======
export default AddNotice;
>>>>>>> vbuzzUpdatedFrontend/main
=======
export default AddNotice;
>>>>>>> 7645c6c1e0b490aac565b231c99c7b38cbb3cf04
