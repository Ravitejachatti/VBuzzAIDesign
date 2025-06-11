import React, { useState } from 'react';
import { 
  User, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  GraduationCap, 
  Award, 
  Building, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink,
  BookOpen,
  Calendar,
  MapPin,
  Star,
  ChevronDown,
  X,
  Save,
  Users,
  TrendingUp
} from 'lucide-react';

function ManageFaculty({ collegeId, token }) {
  const [facultyList, setFacultyList] = useState([
    {
      id: 1,
      name: 'Dr. John Smith',
      department: 'Computer Science',
      specialization: 'Artificial Intelligence',
      areaOfInterest: 'Machine Learning, Deep Learning',
      research: 'Neural Networks and Computer Vision',
      designation: 'Professor',
      experience: '15',
      qualification: 'PhD in Computer Science',
      phone: '9876543210',
      email: 'john.smith@university.edu',
      linkedin: 'https://linkedin.com/in/johnsmith',
      googleScholar: 'https://scholar.google.com/citations?user=johnsmith',
      irins: 'https://irins.org/profile/johnsmith',
      joinDate: '2010-08-15',
      publications: 45,
      rating: 4.8,
      courses: ['Data Structures', 'Machine Learning', 'AI Fundamentals']
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      department: 'Electrical Engineering',
      specialization: 'Power Systems',
      areaOfInterest: 'Renewable Energy, Smart Grids',
      research: 'Smart Grid Technologies',
      designation: 'Associate Professor',
      experience: '10',
      qualification: 'PhD in Electrical Engineering',
      phone: '8765432109',
      email: 'sarah.johnson@university.edu',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      googleScholar: 'https://scholar.google.com/citations?user=sarahjohnson',
      irins: 'https://irins.org/profile/sarahjohnson',
      joinDate: '2015-01-20',
      publications: 32,
      rating: 4.6,
      courses: ['Power Systems', 'Renewable Energy', 'Circuit Analysis']
    },
    {
      id: 3,
      name: 'Prof. Michael Chen',
      department: 'Mechanical Engineering',
      specialization: 'Robotics',
      areaOfInterest: 'Autonomous Systems, Manufacturing',
      research: 'Industrial Automation and Robotics',
      designation: 'Assistant Professor',
      experience: '8',
      qualification: 'PhD in Mechanical Engineering',
      phone: '7654321098',
      email: 'michael.chen@university.edu',
      linkedin: 'https://linkedin.com/in/michaelchen',
      googleScholar: 'https://scholar.google.com/citations?user=michaelchen',
      irins: 'https://irins.org/profile/michaelchen',
      joinDate: '2018-07-10',
      publications: 28,
      rating: 4.7,
      courses: ['Robotics', 'Manufacturing Systems', 'Control Systems']
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    specialization: '',
    areaOfInterest: '',
    research: '',
    designation: '',
    experience: '',
    qualification: '',
    phone: '',
    email: '',
    linkedin: '',
    googleScholar: '',
    irins: '',
    joinDate: '',
    courses: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showFacultyDetails, setShowFacultyDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('');

  const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering'];
  const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setFacultyList(prevList =>
        prevList.map(faculty =>
          faculty.id === editingId ? { 
            ...formData, 
            id: editingId,
            publications: faculty.publications,
            rating: faculty.rating,
            courses: formData.courses.split(',').map(course => course.trim()).filter(course => course)
          } : faculty
        )
      );
      setEditingId(null);
    } else {
      const newFaculty = { 
        ...formData, 
        id: Date.now(),
        publications: Math.floor(Math.random() * 50) + 10,
        rating: (Math.random() * 1 + 4).toFixed(1),
        courses: formData.courses.split(',').map(course => course.trim()).filter(course => course)
      };
      setFacultyList((prevList) => [...prevList, newFaculty]);
    }

    setFormData({
      name: '', department: '', specialization: '', areaOfInterest: '', research: '',
      designation: '', experience: '', qualification: '', phone: '', email: '',
      linkedin: '', googleScholar: '', irins: '', joinDate: '', courses: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (faculty) => {
    setFormData({
      name: faculty.name,
      department: faculty.department,
      specialization: faculty.specialization,
      areaOfInterest: faculty.areaOfInterest,
      research: faculty.research,
      designation: faculty.designation,
      experience: faculty.experience,
      qualification: faculty.qualification,
      phone: faculty.phone,
      email: faculty.email,
      linkedin: faculty.linkedin,
      googleScholar: faculty.googleScholar,
      irins: faculty.irins,
      joinDate: faculty.joinDate,
      courses: faculty.courses?.join(', ') || ''
    });
    setEditingId(faculty.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      setFacultyList((prevList) => prevList.filter((faculty) => faculty.id !== id));
    }
  };

  const filteredFaculty = facultyList.filter(faculty => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || faculty.department === filterDepartment;
    const matchesDesignation = !filterDesignation || faculty.designation === filterDesignation;
    return matchesSearch && matchesDepartment && matchesDesignation;
  });

  const FacultyCard = ({ faculty }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            {faculty.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {faculty.name}
            </h3>
            <p className="text-gray-600 font-medium">{faculty.designation}</p>
            <p className="text-sm text-gray-500">{faculty.department}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">{faculty.rating}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Specialization</p>
            <p className="font-medium text-gray-900">{faculty.specialization}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="font-medium text-gray-900">{faculty.experience} years</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Publications</p>
            <p className="font-medium text-gray-900">{faculty.publications}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900 text-xs">{faculty.email}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Research Areas</p>
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{faculty.research}</p>
      </div>

      {faculty.courses && faculty.courses.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Courses Teaching</p>
          <div className="flex flex-wrap gap-2">
            {faculty.courses.slice(0, 3).map((course, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {course}
              </span>
            ))}
            {faculty.courses.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{faculty.courses.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          {faculty.linkedin && (
            <a href={faculty.linkedin} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:text-blue-700">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {faculty.googleScholar && (
            <a href={faculty.googleScholar} target="_blank" rel="noopener noreferrer" 
               className="text-green-600 hover:text-green-700">
              <BookOpen className="w-4 h-4" />
            </a>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedFaculty(faculty);
              setShowFacultyDetails(true);
            }}
            className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View</span>
          </button>
          <button
            onClick={() => handleEdit(faculty)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(faculty.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Faculty Management</h2>
          <p className="text-gray-600 mt-2">Manage faculty members and their information</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add Faculty</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Faculty</p>
              <p className="text-3xl font-bold">{facultyList.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Professors</p>
              <p className="text-3xl font-bold">{facultyList.filter(f => f.designation === 'Professor').length}</p>
            </div>
            <Award className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Publications</p>
              <p className="text-3xl font-bold">{facultyList.reduce((acc, f) => acc + f.publications, 0)}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Avg. Rating</p>
              <p className="text-3xl font-bold">{(facultyList.reduce((acc, f) => acc + parseFloat(f.rating), 0) / facultyList.length).toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterDesignation}
              onChange={(e) => setFilterDesignation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Designations</option>
              {designations.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredFaculty.length} faculty found
            </span>
          </div>
        </div>
      </div>

      {/* Faculty Grid */}
      {filteredFaculty.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Faculty Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterDepartment || filterDesignation 
              ? "No faculty match your current filters." 
              : "Get started by adding your first faculty member."
            }
          </p>
          {!searchTerm && !filterDepartment && !filterDesignation && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add First Faculty</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFaculty.map((faculty) => (
            <FacultyCard key={faculty.id} faculty={faculty} />
          ))}
        </div>
      )}

      {/* Add/Edit Faculty Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Faculty' : 'Add New Faculty'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingId ? 'Update faculty information' : 'Add a new faculty member'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData({
                    name: '', department: '', specialization: '', areaOfInterest: '', research: '',
                    designation: '', experience: '', qualification: '', phone: '', email: '',
                    linkedin: '', googleScholar: '', irins: '', joinDate: '', courses: ''
                  });
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Dr. John Smith"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Designation *
                  </label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Designation</option>
                    {designations.map(designation => (
                      <option key={designation} value={designation}>{designation}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    placeholder="Artificial Intelligence"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience (years) *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="15"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Qualification *
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="PhD in Computer Science"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john.smith@university.edu"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Join Date
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/johnsmith"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Scholar
                  </label>
                  <input
                    type="url"
                    name="googleScholar"
                    value={formData.googleScholar}
                    onChange={handleInputChange}
                    placeholder="https://scholar.google.com/citations?user=..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    IRINS Profile
                  </label>
                  <input
                    type="url"
                    name="irins"
                    value={formData.irins}
                    onChange={handleInputChange}
                    placeholder="https://irins.org/profile/..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Area of Interest
                </label>
                <textarea
                  name="areaOfInterest"
                  value={formData.areaOfInterest}
                  onChange={handleInputChange}
                  placeholder="Machine Learning, Deep Learning, Computer Vision"
                  rows="2"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Research Areas
                </label>
                <textarea
                  name="research"
                  value={formData.research}
                  onChange={handleInputChange}
                  placeholder="Neural Networks and Computer Vision research..."
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Courses Teaching (comma-separated)
                </label>
                <textarea
                  name="courses"
                  value={formData.courses}
                  onChange={handleInputChange}
                  placeholder="Data Structures, Machine Learning, AI Fundamentals"
                  rows="2"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({
                      name: '', department: '', specialization: '', areaOfInterest: '', research: '',
                      designation: '', experience: '', qualification: '', phone: '', email: '',
                      linkedin: '', googleScholar: '', irins: '', joinDate: '', courses: ''
                    });
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingId ? 'Update Faculty' : 'Add Faculty'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Details Modal */}
      {showFacultyDetails && selectedFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                  {selectedFaculty.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedFaculty.name}</h3>
                  <p className="text-gray-600">{selectedFaculty.designation}</p>
                  <p className="text-gray-500">{selectedFaculty.department}</p>
                </div>
              </div>
              <button
                onClick={() => setShowFacultyDetails(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{selectedFaculty.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{selectedFaculty.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Academic Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Qualification:</span>
                      <span className="ml-2 text-gray-900">{selectedFaculty.qualification}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Experience:</span>
                      <span className="ml-2 text-gray-900">{selectedFaculty.experience} years</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Specialization:</span>
                      <span className="ml-2 text-gray-900">{selectedFaculty.specialization}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">External Links</h4>
                  <div className="space-y-2">
                    {selectedFaculty.linkedin && (
                      <a href={selectedFaculty.linkedin} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                        <ExternalLink className="w-4 h-4" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                    {selectedFaculty.googleScholar && (
                      <a href={selectedFaculty.googleScholar} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                        <BookOpen className="w-4 h-4" />
                        <span>Google Scholar</span>
                      </a>
                    )}
                    {selectedFaculty.irins && (
                      <a href={selectedFaculty.irins} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                        <ExternalLink className="w-4 h-4" />
                        <span>IRINS Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Research Areas</h4>
                  <p className="text-gray-600">{selectedFaculty.research}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Area of Interest</h4>
                  <p className="text-gray-600">{selectedFaculty.areaOfInterest}</p>
                </div>

                {selectedFaculty.courses && selectedFaculty.courses.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Courses Teaching</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFaculty.courses.map((course, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedFaculty.publications}</div>
                      <div className="text-sm text-gray-500">Publications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedFaculty.rating}</div>
                      <div className="text-sm text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowFacultyDetails(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedFaculty);
                  setShowFacultyDetails(false);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Faculty</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageFaculty;