import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { User, Mail, Phone, Calendar, GraduationCap, Building, BookOpen } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddStudentForm = ({universityId, colleges, programs, departments, onStudentAdded }) => {
  const { universityName } = useParams();

  const [formData, setFormData] = useState({
    collegeId: "",
    departmentId: "",
    programId: "",
    name: "",
    email: "",
    registeredNumber: "",
    phone: "",
    enrollmentYear: "",
    graduationYear: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const token = localStorage.getItem("University authToken");

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.registeredNumber.trim()) newErrors.registeredNumber = "Registration number is required";
    if (!formData.collegeId) newErrors.collegeId = "College selection is required";
    if (!formData.departmentId) newErrors.departmentId = "Department selection is required";
    if (!formData.programId) newErrors.programId = "Program selection is required";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    const submitData = {
      universityId,
      collegeId: formData.collegeId,
      departmentId: formData.departmentId,
      programId: formData.programId,
      name: formData.name,
      registered_number: formData.registeredNumber,
      email: formData.email,
      phone: formData.phone,
      enrollment_year: formData.enrollmentYear,
      graduation_year: formData.graduationYear,
    };

    try {
      await axios.post(
        `${BASE_URL}/student/?universityName=${universityName}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Success feedback
      alert("Student added successfully!");
      onStudentAdded();

      // Reset form
      setFormData({
        collegeId: "",
        departmentId: "",
        programId: "",
        name: "",
        email: "",
        registeredNumber: "",
        phone: "",
        enrollmentYear: "",
        graduationYear: "",
      });
      
    } catch (error) {
      console.error("Error adding student:", error.response?.data || error.message);
      alert("Failed to add student. Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartments = departments.filter(dept => dept.college === formData.collegeId);
  const filteredPrograms = programs.filter(prog => prog.department === formData.departmentId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Student</h2>
              <p className="text-sm text-gray-600">
                Add individual students to the system. For bulk uploads, use the bulk upload feature.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* University ID - Read Only */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                University ID
              </label>
              <input
                type="text"
                value={universityId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            {/* College Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                College *
              </label>
              <select
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.collegeId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a college</option>
                {colleges.map((college) => (
                  <option key={college._id} value={college._id}>
                    {college.name}
                  </option>
                ))}
              </select>
              {errors.collegeId && <p className="mt-1 text-sm text-red-600">{errors.collegeId}</p>}
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Department *
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                disabled={!formData.collegeId}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.departmentId ? 'border-red-300' : 'border-gray-300'
                } ${!formData.collegeId ? 'bg-gray-50' : ''}`}
              >
                <option value="">Select a department</option>
                {filteredDepartments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && <p className="mt-1 text-sm text-red-600">{errors.departmentId}</p>}
            </div>

            {/* Program Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-1" />
                Program *
              </label>
              <select
                name="programId"
                value={formData.programId}
                onChange={handleChange}
                disabled={!formData.departmentId}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.programId ? 'border-red-300' : 'border-gray-300'
                } ${!formData.departmentId ? 'bg-gray-50' : ''}`}
              >
                <option value="">Select a program</option>
                {filteredPrograms.map((program) => (
                  <option key={program._id} value={program._id}>
                    {program.name}
                  </option>
                ))}
              </select>
              {errors.programId && <p className="mt-1 text-sm text-red-600">{errors.programId}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter student's full name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                name="registeredNumber"
                value={formData.registeredNumber}
                onChange={handleChange}
                placeholder="Enter registration number"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.registeredNumber ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.registeredNumber && <p className="mt-1 text-sm text-red-600">{errors.registeredNumber}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Enrollment Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Enrollment Year
              </label>
              <input
                type="number"
                name="enrollmentYear"
                value={formData.enrollmentYear}
                onChange={handleChange}
                placeholder="e.g., 2020"
                min="2000"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-1" />
                Graduation Year
              </label>
              <input
                type="number"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g., 2024"
                min="2000"
                max={new Date().getFullYear() + 10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  collegeId: "",
                  departmentId: "",
                  programId: "",
                  name: "",
                  email: "",
                  registeredNumber: "",
                  phone: "",
                  enrollmentYear: "",
                  graduationYear: "",
                });
                setErrors({});
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding Student...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Add Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentForm;