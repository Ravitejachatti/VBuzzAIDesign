import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  GraduationCap,
  Star,
  ChevronDown,
  X,
  Save,
  User,
  Building,
  Clock,
  TrendingUp,
  FileText,
  ExternalLink
} from 'lucide-react';

function DepartmentFaculty({ 
  departmentId, 
  departmentName, 
  token, 
  universityName, 
  colleges, 
  departments, 
  programs 
}) {
  const [faculty, setFaculty] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      phone: "+1-234-567-8901",
      designation: "Professor",
      department: "Computer Science",
      specialization: "Machine Learning",
      qualification: "Ph.D. in Computer Science",
      experience: 15,
      joiningDate: "2010-08-15",
      researchAreas: ["Artificial Intelligence", "Deep Learning", "Computer Vision"],
      publications: 45,
      projects: 12,
      courses: ["CS101 - Programming Fundamentals", "CS401 - Machine Learning", "CS501 - Advanced AI"],
      awards: ["Best Teacher Award 2023", "Research Excellence Award 2022"],
      status: "Active",
      profileImage: null,
      officeLocation: "Room 301, CS Building",
      officeHours: "Mon-Fri 2:00-4:00 PM"
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      email: "michael.chen@university.edu",
      phone: "+1-234-567-8902",
      designation: "Associate Professor",
      department: "Computer Science",
      specialization: "Software Engineering",
      qualification: "Ph.D. in Software Engineering",
      experience: 12,
      joiningDate: "2012-01-20",
      researchAreas: ["Software Architecture", "DevOps", "Agile Methodologies"],
      publications: 32,
      projects: 8,
      courses: ["CS201 - Data Structures", "CS301 - Software Engineering", "CS451 - Project Management"],
      awards: ["Innovation in Teaching Award 2023"],
      status: "Active",
      profileImage: null,
      officeLocation: "Room 205, CS Building",
      officeHours: "Tue-Thu 1:00-3:00 PM"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@university.edu",
      phone: "+1-234-567-8903",
      designation: "Assistant Professor",
      department: "Computer Science",
      specialization: "Cybersecurity",
      qualification: "Ph.D. in Information Security",
      experience: 8,
      joiningDate: "2016-09-01",
      researchAreas: ["Network Security", "Cryptography", "Ethical Hacking"],
      publications: 28,
      projects: 6,
      courses: ["CS351 - Network Security", "CS451 - Cryptography", "CS501 - Advanced Security"],
      awards: ["Young Researcher Award 2022"],
      status: "Active",
      profileImage: null,
      officeLocation: "Room 158, CS Building",
      officeHours: "Mon-Wed 3:00-5:00 PM"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showFacultyDetails, setShowFacultyDetails] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    phone: '',
    designation: 'Assistant Professor',
    specialization: '',
    qualification: '',
    experience: '',
    joiningDate: '',
    researchAreas: '',
    officeLocation: '',
    officeHours: ''
  });

  const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Visiting Faculty'];
  const specializations = ['Machine Learning', 'Software Engineering', 'Cybersecurity', 'Data Science', 'Web Development', 'Mobile Development'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFacultyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setFaculty(prevFaculty =>
        prevFaculty.map(member =>
          member.id === editingId ? {
            ...member,
            ...facultyForm,
            researchAreas: facultyForm.researchAreas.split(',').map(area => area.trim()),
            experience: parseInt(facultyForm.experience),
            publications: member.publications || 0,
            projects: member.projects || 0,
            courses: member.courses || [],
            awards: member.awards || []
          } : member
        )
      );
      setEditingId(null);
    } else {
      const newFaculty = {
        ...facultyForm,
        id: Date.now(),
        researchAreas: facultyForm.researchAreas.split(',').map(area => area.trim()),
        experience: parseInt(facultyForm.experience),
        publications: 0,
        projects: 0,
        courses: [],
        awards: [],
        status: 'Active',
        department: departmentName
      };
      setFaculty([newFaculty, ...faculty]);
    }

    setFacultyForm({
      name: '', email: '', phone: '', designation: 'Assistant Professor',
      specialization: '', qualification: '', experience: '', joiningDate: '',
      researchAreas: '', officeLocation: '', officeHours: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (member) => {
    setFacultyForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      designation: member.designation,
      specialization: member.specialization,
      qualification: member.qualification,
      experience: member.experience.toString(),
      joiningDate: member.joiningDate,
      researchAreas: member.researchAreas.join(', '),
      officeLocation: member.officeLocation,
      officeHours: member.officeHours
    });
    setEditingId(member.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this faculty member?')) {
      setFaculty(faculty.filter(member => member.id !== id));
    }
  };

  const filteredFaculty = faculty.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (selectedDesignation === '' || member.designation === selectedDesignation) &&
    (selectedSpecialization === '' || member.specialization === selectedSpecialization)
  );

  const FacultyCard = ({ member }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {member.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {member.name}
            </h3>
            <p className="text-blue-600 font-medium">{member.designation}</p>
            <p className="text-gray-600 text-sm">{member.specialization}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          member.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {member.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{member.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{member.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{member.officeLocation}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{member.officeHours}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{member.experience}</div>
          <div className="text-xs text-gray-500">Years Exp.</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{member.publications}</div>
          <div className="text-xs text-gray-500">Publications</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{member.projects}</div>
          <div className="text-xs text-gray-500">Projects</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Research Areas</h4>
        <div className="flex flex-wrap gap-2">
          {member.researchAreas.slice(0, 3).map((area, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {area}
            </span>
          ))}
          {member.researchAreas.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{member.researchAreas.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">
            Joined {new Date(member.joiningDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedFaculty(member);
              setShowFacultyDetails(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(member)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(member.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Faculty Management</h2>
          <p className="text-gray-600 mt-2">Manage department faculty members and their information</p>
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
              <p className="text-3xl font-bold">{faculty.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Professors</p>
              <p className="text-3xl font-bold">{faculty.filter(f => f.designation === 'Professor').length}</p>
            </div>
            <Award className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Publications</p>
              <p className="text-3xl font-bold">{faculty.reduce((acc, f) => acc + f.publications, 0)}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Avg Experience</p>
              <p className="text-3xl font-bold">
                {Math.round(faculty.reduce((acc, f) => acc + f.experience, 0) / faculty.length)} yrs
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
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
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Designations</option>
              {designations.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredFaculty.length} faculty members found
            </span>
          </div>
        </div>
      </div>

      {/* Faculty Grid */}
      {filteredFaculty.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Faculty Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedDesignation || selectedSpecialization 
              ? "No faculty members match your current filters." 
              : "Get started by adding your first faculty member."
            }
          </p>
          {!searchTerm && !selectedDesignation && !selectedSpecialization && (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFaculty.map(member => (
            <FacultyCard key={member.id} member={member} />
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
                  {editingId ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingId ? 'Update faculty information' : 'Add a new faculty member to the department'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFacultyForm({
                    name: '', email: '', phone: '', designation: 'Assistant Professor',
                    specialization: '', qualification: '', experience: '', joiningDate: '',
                    researchAreas: '', officeLocation: '', officeHours: ''
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
                    value={facultyForm.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
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
                    value={facultyForm.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
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
                    value={facultyForm.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Designation *
                  </label>
                  <select
                    name="designation"
                    value={facultyForm.designation}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
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
                    value={facultyForm.specialization}
                    onChange={handleInputChange}
                    placeholder="Enter specialization"
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
                    value={facultyForm.qualification}
                    onChange={handleInputChange}
                    placeholder="Enter highest qualification"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience (Years) *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={facultyForm.experience}
                    onChange={handleInputChange}
                    placeholder="Enter years of experience"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={facultyForm.joiningDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Office Location
                  </label>
                  <input
                    type="text"
                    name="officeLocation"
                    value={facultyForm.officeLocation}
                    onChange={handleInputChange}
                    placeholder="Enter office location"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Office Hours
                  </label>
                  <input
                    type="text"
                    name="officeHours"
                    value={facultyForm.officeHours}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon-Fri 2:00-4:00 PM"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Research Areas
                </label>
                <textarea
                  name="researchAreas"
                  value={facultyForm.researchAreas}
                  onChange={handleInputChange}
                  placeholder="Enter research areas separated by commas"
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple research areas with commas</p>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFacultyForm({
                      name: '', email: '', phone: '', designation: 'Assistant Professor',
                      specialization: '', qualification: '', experience: '', joiningDate: '',
                      researchAreas: '', officeLocation: '', officeHours: ''
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
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedFaculty.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedFaculty.name}</h3>
                  <p className="text-blue-600 font-medium">{selectedFaculty.designation}</p>
                  <p className="text-gray-600">{selectedFaculty.specialization}</p>
                </div>
              </div>
              <button
                onClick={() => setShowFacultyDetails(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedFaculty.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedFaculty.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedFaculty.officeLocation}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{selectedFaculty.officeHours}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Academic Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Qualification:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedFaculty.qualification}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Experience:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedFaculty.experience} years</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Joining Date:</span>
                      <span className="ml-2 text-sm text-gray-900">
                        {new Date(selectedFaculty.joiningDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Research Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFaculty.researchAreas.map((area, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedFaculty.publications}</div>
                      <div className="text-sm text-blue-800">Publications</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedFaculty.projects}</div>
                      <div className="text-sm text-green-800">Projects</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Current Courses</h4>
                  <div className="space-y-2">
                    {selectedFaculty.courses.map((course, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-900">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Awards & Recognition</h4>
                  <div className="space-y-2">
                    {selectedFaculty.awards.map((award, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-gray-900">{award}</span>
                      </div>
                    ))}
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

export default DepartmentFaculty;