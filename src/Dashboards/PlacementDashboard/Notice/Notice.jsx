import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";

const AddNotice = ({ colleges = [], departments = [], programs = [], students=[] }) => {
  const [formData, setFormData] = useState({
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);
  const [programDropdownOpen, setProgramDropdownOpen] = useState(false);
   const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);

   // Filtered lists based on selection
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);// Programs based on department selection

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { universityName } = useParams();
  const token = localStorage.getItem("University authToken");


  // Filter programs based on selected department(s)
  useEffect(() => {
    const filtered = programs.filter((program) =>
      formData.departments.includes(program.department)
    );
    setFilteredPrograms(filtered);
  }, [formData.departments, programs]);

  // Filter students based on selected departments & programs
  useEffect(() => {
    const fs = students.filter(
      (s) =>
        formData.departments.includes(s.departmentId) &&
        formData.programs.includes(s.programId)
    );
    setFilteredStudents(fs);
    // default select all
    setFormData((prev) => ({ ...prev, students: fs.map((s) => s._id) }));
  }, [formData.departments, formData.programs, students]);


  // Handle college selection
  const handleCollegeChange = (collegeId) => {
    const updatedColleges = formData.colleges.includes(collegeId)
      ? formData.colleges.filter((id) => id !== collegeId) // Deselect if already selected
      : [...formData.colleges, collegeId]; // Select if not already selected
    setFormData({ ...formData, colleges: updatedColleges });
  };

  // Handle department selection
  const handleDepartmentChange = (departmentId) => {
    const updatedDepartments = formData.departments.includes(departmentId)
      ? formData.departments.filter((id) => id !== departmentId) // Deselect if already selected
      : [...formData.departments, departmentId]; // Select if not already selected
    setFormData({ ...formData, departments: updatedDepartments });
  };

  // Handle program selection
  const handleProgramChange = (programId) => {
    const updatedPrograms = formData.programs.includes(programId)
      ? formData.programs.filter((id) => id !== programId) // Deselect if already selected
      : [...formData.programs, programId]; // Select if not already selected
    setFormData({ ...formData, programs: updatedPrograms });
  };

  
      // Toggle select-all for students
  const handleToggleSelectAllStudents = (checked) => {
    setFormData((prev) => ({
      ...prev,
      students: checked ? filteredStudents.map((s) => s._id) : [],
    }));
  };

  // Toggle individual student
  const toggleStudent = (id) => {
    setFormData((prev) => {
      const arr = prev.students;
      return {
        ...prev,
        students: arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id],
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert dates to ISO format before sending
    const formattedData = {
      ...formData,
      openingDate: formData.openingDate.toISOString(),
      expiryDate: formData.expiryDate.toISOString(),
    };

    try {
      console.log("Adding notice:", formattedData);
      const response = await axios.post(
        `${BASE_URL}/notice`,
        formattedData,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );

      setSuccess("Notice added successfully!");
      setError("");

      // Reset form data
      setFormData({
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

      console.log("Notice added successfully:", response.data);
    } catch (error) {
      setSuccess("");
      setError(error.response?.data?.message || "Failed to add notice.");
      console.error("Error adding notice:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Add Notice</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        {/* Message */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          ></textarea>
        </div>

        {/* Link */}
        <div>
          <label className="block text-sm font-medium mb-1">Link (PDF)</label>
          <input
            type="url"
            className="w-full p-2 border rounded-md"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
        </div>

        {/* Colleges Dropdown with Checkboxes */}
        <div>
          <label className="block text-sm font-medium mb-1">Colleges</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={
                formData.colleges
                  .map((id) => {
                    const college = colleges.find((college) => college._id === id);
                    return college ? college.name : "";
                  })
                  .join(", ")
              }
              onClick={() => setCollegeDropdownOpen(!collegeDropdownOpen)}
              placeholder="Select Colleges"
              className="w-full p-2 border rounded bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {collegeDropdownOpen && (
              <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleSelectAll("colleges", colleges)}
                  className="w-full text-left p-1 hover:bg-gray-100 text-xs bg-blue-100"
                >
                  Select All
                </button>
                {colleges.map((college) => (
                  <label
                    key={college._id}
                    className="flex items-center p-1 hover:bg-gray-100 text-xs"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox mr-1 text-xs"
                      checked={formData.colleges.includes(college._id)}
                      onChange={() => handleCollegeChange(college._id)}
                    />
                    {college.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Departments Dropdown with Checkboxes */}
        <div>
          <label className="block text-sm font-medium mb-1">Departments</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={
                formData.departments
                  .map((id) => {
                    const department = departments.find((dept) => dept._id === id);
                    return department ? department.name : "";
                  })
                  .join(", ")
              }
              onClick={() => setDepartmentDropdownOpen(!departmentDropdownOpen)}
              placeholder="Select Departments"
              className="w-full p-2 border rounded bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {departmentDropdownOpen && (
              <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleSelectAll("departments", departments)}
                  className="w-full text-left p-1 hover:bg-gray-100 text-xs bg-blue-100"
                >
                  Select All
                </button>
                {departments.map((department) => (
                  <label
                    key={department._id}
                    className="flex items-center p-1 hover:bg-gray-100 text-xs"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox mr-1 text-xs"
                      checked={formData.departments.includes(department._id)}
                      onChange={() => handleDepartmentChange(department._id)}
                    />
                    {department.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Programs Dropdown with Checkboxes */}
        <div>
          <label className="block text-sm font-medium mb-1">Programs</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={
                formData.programs
                  .map((id) => {
                    const program = filteredPrograms.find((prog) => prog._id === id);
                    return program ? program.name : "";
                  })
                  .join(", ")
              }
              onClick={() => setProgramDropdownOpen(!programDropdownOpen)}
              placeholder="Select Programs"
              className="w-full p-2 border rounded bg-white cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {programDropdownOpen && (
              <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleSelectAll("programs", filteredPrograms)}
                  className="w-full text-left p-1 hover:bg-gray-100 text-xs bg-blue-100"
                >
                  Select All
                </button>
                {filteredPrograms.map((program) => (
                  <label
                    key={program._id}
                    className="flex items-center p-1 hover:bg-gray-100 text-xs"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox mr-1 text-xs"
                      checked={formData.programs.includes(program._id)}
                      onChange={() => handleProgramChange(program._id)}
                    />
                    {program.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Students Dropdown with select-all checkbox */}
        <div className="col-span-3">
          <label className="block text-sm font-medium mb-1">Students</label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={
                formData.students
                  .map((id) => {
                    const st = students.find((s) => s._id === id);
                    return st ? `${st.name} (${st.registered_number})` : '';
                  })
                  .join(', ')
              }
              onClick={() => setStudentDropdownOpen(!studentDropdownOpen)}
              placeholder="Select Students"
              className="w-full p-2 border rounded bg-white cursor-pointer"
            />
            {studentDropdownOpen && (
              <div className="absolute z-10 bg-white border rounded shadow-md w-full max-h-40 overflow-y-auto">
                <label className="flex items-center p-1 text-xs hover:bg-gray-100">
                  <input
                    type="checkbox"
                    className="form-checkbox mr-1"
                    checked={
                      filteredStudents.length > 0 &&
                      formData.students.length === filteredStudents.length
                    }
                    onChange={(e) => handleToggleSelectAllStudents(e.target.checked)}
                  />
                  Select All
                </label>
                {filteredStudents.map((s) => (
                  <label
                    key={s._id}
                    className="flex items-center p-1 text-xs hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox mr-1"
                      checked={formData.students.includes(s._id)}
                      onChange={() => toggleStudent(s._id)}
                    />
                    {s.name} ({s.registered_number})
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            className="w-full p-2 border rounded-md"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Opening Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Opening Date</label>
          <DatePicker
            selected={formData.openingDate}
            onChange={(date) => setFormData({ ...formData, openingDate: date })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Expiry Date</label>
          <DatePicker
            selected={formData.expiryDate}
            onChange={(date) => setFormData({ ...formData, expiryDate: date })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-3 text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Notice
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNotice;