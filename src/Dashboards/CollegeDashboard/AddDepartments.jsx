import React, { useState } from 'react';
import { 
  Plus, 
  Building, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  ChevronDown,
  Users,
  GraduationCap,
  Save,
  X,
  MapPin,
  Calendar,
  Eye,
  MoreVertical
} from 'lucide-react';

function AddDepartments({ collegeId, token, colleges, departments, programs }) {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCollege, setFilterCollege] = useState('');
  
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    head: '',
    contact: '',
    email: '',
    description: '',
    establishedYear: '',
    location: ''
  });

  // Handle form input change
  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({ ...prev, [name]: value }));
  };

  // Add new department
  const addDepartment = () => {
    if (!departmentForm.name || !departmentForm.head || !departmentForm.email) {
      alert('Please fill in all required fields');
      return;
    }

    const newDept = { 
      ...departmentForm, 
      id: Date.now(), 
      programs: [],
      studentCount: Math.floor(Math.random() * 200) + 50,
      facultyCount: Math.floor(Math.random() * 20) + 5
    };
    
    setSelectedDepartment(newDept);
    departments.push(newDept);
    setDepartmentForm({ 
      name: '', 
      head: '', 
      contact: '', 
      email: '', 
      description: '', 
      establishedYear: '', 
      location: '' 
    });
    setShowAddForm(false);
  };

  // Show program details in a popup
  const showProgramDetails = (program) => {
    setSelectedProgram(program);
  };

  // Close program popup
  const closeProgramPopup = () => {
    setSelectedProgram(null);
  };

  // Filter departments based on search and college filter
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.head?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollege = !filterCollege || dept.collegeId === filterCollege;
    return matchesSearch && matchesCollege;
  });

  const DepartmentCard = ({ dept, index }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Building className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {dept.name}
            </h3>
            <p className="text-sm text-gray-500">Est. {dept.establishedYear || '2000'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Department Head</p>
            <p className="font-medium text-gray-900">{dept.head?.name || dept.head || "N/A"}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Phone className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium text-gray-900">{dept.contact || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{dept.email || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium text-gray-900">{dept.location || "Main Campus"}</p>
          </div>
        </div>
      </div>

      {dept.description && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {dept.description}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{dept.studentCount || 0}</div>
          <div className="text-xs text-gray-500">Students</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{dept.facultyCount || 0}</div>
          <div className="text-xs text-gray-500">Faculty</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{dept.programs?.length || 0}</div>
          <div className="text-xs text-gray-500">Programs</div>
        </div>
      </div>

      {/* Programs */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Programs</span>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Manage
          </button>
        </div>
        {dept.programs && dept.programs.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {dept.programs.slice(0, 3).map((program, i) => (
              <span
                key={program.id}
                onClick={() => showProgramDetails(program)}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 cursor-pointer hover:from-blue-200 hover:to-indigo-200 transition-all"
              >
                {program.name}
              </span>
            ))}
            {dept.programs.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{dept.programs.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No programs added yet</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
        <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Edit3 className="w-4 h-4" />
          <span className="text-sm font-medium">Edit</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Department Management</h2>
          <p className="text-gray-600 mt-2">Manage departments and their academic programs</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Departments</p>
              <p className="text-3xl font-bold">{departments.length}</p>
            </div>
            <Building className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Faculty</p>
              <p className="text-3xl font-bold">{departments.reduce((acc, dept) => acc + (dept.facultyCount || 0), 0)}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Students</p>
              <p className="text-3xl font-bold">{departments.reduce((acc, dept) => acc + (dept.studentCount || 0), 0)}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Programs</p>
              <p className="text-3xl font-bold">{programs.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterCollege}
              onChange={(e) => setFilterCollege(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Colleges</option>
              {colleges.map((college) => (
                <option key={college._id} value={college._id}>
                  {college.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredDepartments.length} departments found
            </span>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Department Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Add New Department</h3>
                <p className="text-gray-600 mt-1">Create a new academic department</p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={departmentForm.name}
                  onChange={(e) => handleInputChange(e, setDepartmentForm)}
                  placeholder="Computer Science & Engineering"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department Head *
                </label>
                <input
                  type="text"
                  name="head"
                  value={departmentForm.head}
                  onChange={(e) => handleInputChange(e, setDepartmentForm)}
                  placeholder="Dr. John Smith"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={departmentForm.contact}
                  onChange={(e) => handleInputChange(e, setDepartmentForm)}
                  placeholder="+1 234 567 8900"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={departmentForm.email}
                  onChange={(e) => handleInputChange(e, setDepartmentForm)}
                  placeholder="cse@college.edu"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Established Year
                </label>
                <input
                  type="number"
                  name="establishedYear"
                  value={departmentForm.establishedYear}
                  onChange={(e) => handleInputChange(e, setDepartmentForm)}
                  placeholder="2000"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={departmentForm.location}
                  onChange={(e) => handleInputChange(e, setDepartmentForm)}
                  placeholder="Building A, Floor 2"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={departmentForm.description}
                  onChange={(e) => handleInputChange(e, setDepartmentForm)}
                  placeholder="Brief description of the department and its objectives..."
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addDepartment}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                <Save className="w-5 h-5" />
                <span>Add Department</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Departments Grid */}
      {filteredDepartments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Departments Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterCollege 
              ? "No departments match your current filters." 
              : "Get started by adding your first department."
            }
          </p>
          {!searchTerm && !filterCollege && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Department</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDepartments.map((dept, index) => (
            <DepartmentCard key={dept.id || index} dept={dept} index={index} />
          ))}
        </div>
      )}

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Program Details</h3>
              <button
                onClick={closeProgramPopup}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{selectedProgram.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-2 font-medium">{selectedProgram.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Level:</span>
                    <span className="ml-2 font-medium">{selectedProgram.level}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-2 font-medium">{selectedProgram.duration} years</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Eligibility:</span>
                    <span className="ml-2 font-medium">{selectedProgram.eligibility}</span>
                  </div>
                </div>
              </div>

              {selectedProgram.syllabus && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Syllabus</h5>
                  <a 
                    href={selectedProgram.syllabus} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    View Syllabus Document
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={closeProgramPopup}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddDepartments;