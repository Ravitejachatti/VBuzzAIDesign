import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  Users, 
  Award,
  ChevronDown,
  X,
  Save,
  FileText,
  GraduationCap,
  Target,
  Star,
  TrendingUp,
  Book,
  User,
  MapPin
} from 'lucide-react';

function ProgramsCourses({ 
  departmentId, 
  departmentName, 
  token, 
  universityName, 
  colleges, 
  departments, 
  programs 
}) {
  const [activeTab, setActiveTab] = useState('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSemester, setSemester] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [programsData, setProgramsData] = useState([
    {
      id: 1,
      name: "Bachelor of Computer Science",
      code: "BCS",
      level: "Undergraduate",
      duration: "4 years",
      totalSemesters: 8,
      totalCredits: 120,
      description: "Comprehensive program covering fundamental and advanced topics in computer science",
      eligibility: "12th grade with Mathematics and Physics",
      fees: "₹2,50,000",
      status: "Active",
      enrolledStudents: 120,
      faculty: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
      specializations: ["AI & ML", "Software Engineering", "Cybersecurity"],
      accreditation: "NAAC A+",
      startDate: "2020-08-01"
    },
    {
      id: 2,
      name: "Master of Computer Applications",
      code: "MCA",
      level: "Postgraduate",
      duration: "2 years",
      totalSemesters: 4,
      totalCredits: 80,
      description: "Advanced program for developing professional software development skills",
      eligibility: "Bachelor's degree in any discipline with Mathematics",
      fees: "₹3,00,000",
      status: "Active",
      enrolledStudents: 85,
      faculty: ["Dr. Emily Rodriguez", "Prof. Michael Chen"],
      specializations: ["Web Development", "Mobile App Development", "Data Analytics"],
      accreditation: "UGC Approved",
      startDate: "2018-08-01"
    }
  ]);

  const [coursesData, setCoursesData] = useState([
    {
      id: 1,
      name: "Programming Fundamentals",
      code: "CS101",
      program: "Bachelor of Computer Science",
      semester: 1,
      credits: 4,
      type: "Core",
      instructor: "Dr. Sarah Johnson",
      description: "Introduction to programming concepts using Python",
      prerequisites: "None",
      duration: "15 weeks",
      enrolledStudents: 120,
      maxCapacity: 150,
      schedule: "Mon, Wed, Fri 9:00-10:00 AM",
      room: "CS Lab 1",
      status: "Active",
      syllabus: "Variables, Control Structures, Functions, OOP Basics"
    },
    {
      id: 2,
      name: "Data Structures and Algorithms",
      code: "CS201",
      program: "Bachelor of Computer Science",
      semester: 3,
      credits: 4,
      type: "Core",
      instructor: "Prof. Michael Chen",
      description: "Fundamental data structures and algorithmic techniques",
      prerequisites: "CS101 - Programming Fundamentals",
      duration: "15 weeks",
      enrolledStudents: 95,
      maxCapacity: 120,
      schedule: "Tue, Thu 10:00-11:30 AM",
      room: "CS Lab 2",
      status: "Active",
      syllabus: "Arrays, Linked Lists, Trees, Graphs, Sorting, Searching"
    },
    {
      id: 3,
      name: "Machine Learning",
      code: "CS401",
      program: "Bachelor of Computer Science",
      semester: 7,
      credits: 3,
      type: "Elective",
      instructor: "Dr. Sarah Johnson",
      description: "Introduction to machine learning algorithms and applications",
      prerequisites: "CS201, Mathematics for CS",
      duration: "15 weeks",
      enrolledStudents: 45,
      maxCapacity: 60,
      schedule: "Mon, Wed 2:00-3:30 PM",
      room: "AI Lab",
      status: "Active",
      syllabus: "Supervised Learning, Unsupervised Learning, Neural Networks"
    }
  ]);

  const [itemForm, setItemForm] = useState({
    name: '',
    code: '',
    description: '',
    level: 'Undergraduate',
    duration: '',
    credits: '',
    type: 'Core',
    instructor: '',
    semester: '',
    prerequisites: '',
    schedule: '',
    room: '',
    maxCapacity: ''
  });

  const levels = ['Undergraduate', 'Postgraduate', 'Doctoral'];
  const courseTypes = ['Core', 'Elective', 'Lab', 'Project'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'programs') {
      if (editingId) {
        setProgramsData(prevData =>
          prevData.map(item =>
            item.id === editingId ? {
              ...item,
              ...itemForm,
              totalCredits: parseInt(itemForm.credits) || item.totalCredits
            } : item
          )
        );
      } else {
        const newProgram = {
          ...itemForm,
          id: Date.now(),
          totalCredits: parseInt(itemForm.credits) || 0,
          enrolledStudents: 0,
          faculty: [],
          specializations: [],
          status: 'Active',
          startDate: new Date().toISOString().split('T')[0]
        };
        setProgramsData([newProgram, ...programsData]);
      }
    } else {
      if (editingId) {
        setCoursesData(prevData =>
          prevData.map(item =>
            item.id === editingId ? {
              ...item,
              ...itemForm,
              credits: parseInt(itemForm.credits) || item.credits,
              semester: parseInt(itemForm.semester) || item.semester,
              maxCapacity: parseInt(itemForm.maxCapacity) || item.maxCapacity
            } : item
          )
        );
      } else {
        const newCourse = {
          ...itemForm,
          id: Date.now(),
          credits: parseInt(itemForm.credits) || 0,
          semester: parseInt(itemForm.semester) || 1,
          maxCapacity: parseInt(itemForm.maxCapacity) || 0,
          enrolledStudents: 0,
          status: 'Active'
        };
        setCoursesData([newCourse, ...coursesData]);
      }
    }

    setItemForm({
      name: '', code: '', description: '', level: 'Undergraduate',
      duration: '', credits: '', type: 'Core', instructor: '',
      semester: '', prerequisites: '', schedule: '', room: '', maxCapacity: ''
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setItemForm({
      name: item.name,
      code: item.code,
      description: item.description,
      level: item.level || 'Undergraduate',
      duration: item.duration,
      credits: (item.credits || item.totalCredits || '').toString(),
      type: item.type || 'Core',
      instructor: item.instructor || '',
      semester: (item.semester || '').toString(),
      prerequisites: item.prerequisites || '',
      schedule: item.schedule || '',
      room: item.room || '',
      maxCapacity: (item.maxCapacity || '').toString()
    });
    setEditingId(item.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      if (activeTab === 'programs') {
        setProgramsData(programsData.filter(item => item.id !== id));
      } else {
        setCoursesData(coursesData.filter(item => item.id !== id));
      }
    }
  };

  const filteredData = (activeTab === 'programs' ? programsData : coursesData).filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (selectedLevel === '' || item.level === selectedLevel) &&
    (selectedSemester === '' || item.semester === parseInt(selectedSemester))
  );

  const ProgramCard = ({ program }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {program.name}
            </h3>
            <p className="text-blue-600 font-medium">{program.code}</p>
            <p className="text-gray-600 text-sm">{program.level} • {program.duration}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          program.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {program.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{program.enrolledStudents}</div>
          <div className="text-xs text-gray-500">Students</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{program.totalCredits}</div>
          <div className="text-xs text-gray-500">Credits</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Specializations</h4>
        <div className="flex flex-wrap gap-2">
          {program.specializations?.slice(0, 2).map((spec, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {spec}
            </span>
          ))}
          {program.specializations?.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{program.specializations.length - 2} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">{program.accreditation}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedItem(program);
              setShowItemDetails(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(program)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(program.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            course.type === 'Core' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
            course.type === 'Elective' ? 'bg-gradient-to-r from-green-500 to-green-600' :
            course.type === 'Lab' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
            'bg-gradient-to-r from-orange-500 to-orange-600'
          }`}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {course.name}
            </h3>
            <p className="text-blue-600 font-medium">{course.code}</p>
            <p className="text-gray-600 text-sm">Semester {course.semester} • {course.credits} Credits</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          course.type === 'Core' ? 'bg-blue-100 text-blue-800' :
          course.type === 'Elective' ? 'bg-green-100 text-green-800' :
          course.type === 'Lab' ? 'bg-purple-100 text-purple-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {course.type}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>{course.instructor}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{course.schedule}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{course.room}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{course.enrolledStudents}</div>
          <div className="text-xs text-gray-500">Enrolled</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{course.maxCapacity}</div>
          <div className="text-xs text-gray-500">Capacity</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {Math.round((course.enrolledStudents / course.maxCapacity) * 100)}% Full
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedItem(course);
              setShowItemDetails(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(course)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(course.id)}
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
          <h2 className="text-3xl font-bold text-gray-900">Programs & Courses</h2>
          <p className="text-gray-600 mt-2">Manage academic programs and course offerings</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Add {activeTab === 'programs' ? 'Program' : 'Course'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === 'programs'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>Programs ({programsData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
              activeTab === 'courses'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Courses ({coursesData.length})</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Programs</p>
              <p className="text-3xl font-bold">{programsData.length}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Courses</p>
              <p className="text-3xl font-bold">{coursesData.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Students</p>
              <p className="text-3xl font-bold">
                {programsData.reduce((acc, p) => acc + p.enrolledStudents, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Credits</p>
              <p className="text-3xl font-bold">
                {programsData.reduce((acc, p) => acc + p.totalCredits, 0)}
              </p>
            </div>
            <Award className="w-8 h-8 text-orange-200" />
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
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {activeTab === 'courses' && (
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedSemester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredData.length} {activeTab} found
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
          {activeTab === 'programs' ? (
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          ) : (
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          )}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No {activeTab} Found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedLevel || selectedSemester 
              ? `No ${activeTab} match your current filters.` 
              : `Get started by adding your first ${activeTab.slice(0, -1)}.`
            }
          </p>
          {!searchTerm && !selectedLevel && !selectedSemester && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Add First {activeTab === 'programs' ? 'Program' : 'Course'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map(item => (
            activeTab === 'programs' ? (
              <ProgramCard key={item.id} program={item} />
            ) : (
              <CourseCard key={item.id} course={item} />
            )
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3  className="text-2xl font-bold text-gray-900">
                  {editingId ? `Edit ${activeTab === 'programs' ? 'Program' : 'Course'}` : `Add New ${activeTab === 'programs' ? 'Program' : 'Course'}`}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingId ? `Update ${activeTab.slice(0, -1)} information` : `Add a new ${activeTab.slice(0, -1)} to the department`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setItemForm({
                    name: '', code: '', description: '', level: 'Undergraduate',
                    duration: '', credits: '', type: 'Core', instructor: '',
                    semester: '', prerequisites: '', schedule: '', room: '', maxCapacity: ''
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
                    {activeTab === 'programs' ? 'Program' : 'Course'} Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={itemForm.name}
                    onChange={handleInputChange}
                    placeholder={`Enter ${activeTab.slice(0, -1)} name`}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={itemForm.code}
                    onChange={handleInputChange}
                    placeholder="Enter code"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Level *
                  </label>
                  <select
                    name="level"
                    value={itemForm.level}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {activeTab === 'programs' ? 'Duration' : 'Credits'} *
                  </label>
                  <input
                    type={activeTab === 'programs' ? 'text' : 'number'}
                    name={activeTab === 'programs' ? 'duration' : 'credits'}
                    value={activeTab === 'programs' ? itemForm.duration : itemForm.credits}
                    onChange={handleInputChange}
                    placeholder={activeTab === 'programs' ? 'e.g., 4 years' : 'Enter credits'}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {activeTab === 'courses' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type *
                      </label>
                      <select
                        name="type"
                        value={itemForm.type}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {courseTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Semester *
                      </label>
                      <select
                        name="semester"
                        value={itemForm.semester}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Semester</option>
                        {semesters.map(sem => (
                          <option key={sem} value={sem}>Semester {sem}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Instructor
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        value={itemForm.instructor}
                        onChange={handleInputChange}
                        placeholder="Enter instructor name"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Max Capacity
                      </label>
                      <input
                        type="number"
                        name="maxCapacity"
                        value={itemForm.maxCapacity}
                        onChange={handleInputChange}
                        placeholder="Enter maximum capacity"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Schedule
                      </label>
                      <input
                        type="text"
                        name="schedule"
                        value={itemForm.schedule}
                        onChange={handleInputChange}
                        placeholder="e.g., Mon, Wed, Fri 9:00-10:00 AM"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Room
                      </label>
                      <input
                        type="text"
                        name="room"
                        value={itemForm.room}
                        onChange={handleInputChange}
                        placeholder="Enter room/location"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={itemForm.description}
                  onChange={handleInputChange}
                  placeholder={`Enter ${activeTab.slice(0, -1)} description`}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {activeTab === 'courses' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prerequisites
                  </label>
                  <textarea
                    name="prerequisites"
                    value={itemForm.prerequisites}
                    onChange={handleInputChange}
                    placeholder="Enter course prerequisites"
                    rows="2"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setItemForm({
                      name: '', code: '', description: '', level: 'Undergraduate',
                      duration: '', credits: '', type: 'Core', instructor: '',
                      semester: '', prerequisites: '', schedule: '', room: '', maxCapacity: ''
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
                  <span>{editingId ? `Update ${activeTab === 'programs' ? 'Program' : 'Course'}` : `Add ${activeTab === 'programs' ? 'Program' : 'Course'}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showItemDetails && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  activeTab === 'programs' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
                    : selectedItem.type === 'Core' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      selectedItem.type === 'Elective' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      selectedItem.type === 'Lab' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                      'bg-gradient-to-r from-orange-500 to-orange-600'
                }`}>
                  {activeTab === 'programs' ? (
                    <GraduationCap className="w-8 h-8 text-white" />
                  ) : (
                    <BookOpen className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h3>
                  <p className="text-blue-600 font-medium">{selectedItem.code}</p>
                  <p className="text-gray-600">
                    {activeTab === 'programs' 
                      ? `${selectedItem.level} • ${selectedItem.duration}` 
                      : `Semester ${selectedItem.semester} • ${selectedItem.credits} Credits`
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowItemDetails(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedItem.description}</p>
                </div>

                {activeTab === 'programs' ? (
                  <>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Program Details</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Duration:</span>
                          <span className="ml-2 text-sm text-gray-900">{selectedItem.duration}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Total Credits:</span>
                          <span className="ml-2 text-sm text-gray-900">{selectedItem.totalCredits}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Eligibility:</span>
                          <span className="ml-2 text-sm text-gray-900">{selectedItem.eligibility}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Fees:</span>
                          <span className="ml-2 text-sm text-gray-900">{selectedItem.fees}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.specializations?.map((spec, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Course Details</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Instructor:</span>
                          <span className="ml-2 text-sm text-gray-900">{selectedItem.instructor}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Schedule:</span>
                          <span className="ml-2 text-sm text-gray-900">{selectedItem.schedule}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Room:</span>
                          <span className="ml-2 text-sm text-gray-900">{selectedItem.room}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Prerequisites:</span>
                          <span className="ml-2 text-sm text-gray-900">{selectedItem.prerequisites || 'None'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Syllabus Overview</h4>
                      <p className="text-sm text-gray-600">{selectedItem.syllabus}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedItem.enrolledStudents}</div>
                      <div className="text-sm text-blue-800">
                        {activeTab === 'programs' ? 'Total Students' : 'Enrolled'}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {activeTab === 'programs' ? selectedItem.totalCredits : selectedItem.maxCapacity}
                      </div>
                      <div className="text-sm text-green-800">
                        {activeTab === 'programs' ? 'Total Credits' : 'Max Capacity'}
                      </div>
                    </div>
                  </div>
                </div>

                {activeTab === 'programs' && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Faculty</h4>
                    <div className="space-y-2">
                      {selectedItem.faculty?.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-900">{member}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
                        selectedItem.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedItem.status}
                      </span>
                    </div>
                    {activeTab === 'programs' && (
                      <>
                        <div>
                          <span className="text-sm text-gray-500">Accreditation:</span>
                          <span className="ml-2 text-sm text-gray-900">{selectedItem.accreditation}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Start Date:</span>
                          <span className="ml-2 text-sm text-gray-900">
                            {new Date(selectedItem.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowItemDetails(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedItem);
                  setShowItemDetails(false);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit {activeTab === 'programs' ? 'Program' : 'Course'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramsCourses;