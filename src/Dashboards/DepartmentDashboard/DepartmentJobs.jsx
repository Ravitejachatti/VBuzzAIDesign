import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users,
  Building,
  Clock,
  ChevronDown,
  X,
  Save,
  Star,
  TrendingUp,
  Target,
  Award,
  ExternalLink,
  Send
} from 'lucide-react';

function DepartmentJobs({ 
  departmentId, 
  departmentName, 
  token, 
  universityName, 
  colleges, 
  departments, 
  programs 
}) {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Software Engineer",
      company: "TechCorp Solutions",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "0-2 years",
      salary: "₹6-8 LPA",
      description: "We are looking for a passionate Software Engineer to join our dynamic team. The ideal candidate will have strong programming skills and a desire to learn new technologies.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "Proficiency in Java, Python, or JavaScript",
        "Understanding of data structures and algorithms",
        "Good communication skills",
        "Ability to work in a team environment"
      ],
      skills: ["Java", "Python", "JavaScript", "React", "Node.js"],
      postedDate: "2024-01-15",
      applicationDeadline: "2024-02-15",
      status: "Active",
      applicants: 45,
      category: "Software Development",
      companyLogo: null,
      contactEmail: "hr@techcorp.com",
      companyWebsite: "https://techcorp.com",
      benefits: ["Health Insurance", "Flexible Hours", "Learning Budget"],
      workMode: "Hybrid"
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "DataInsights Inc",
      location: "Mumbai, India",
      type: "Full-time",
      experience: "1-3 years",
      salary: "₹5-7 LPA",
      description: "Join our analytics team to help businesses make data-driven decisions. You'll work with large datasets and create meaningful insights.",
      requirements: [
        "Bachelor's degree in Statistics, Mathematics, or Computer Science",
        "Experience with SQL and Excel",
        "Knowledge of Python or R",
        "Strong analytical thinking",
        "Experience with data visualization tools"
      ],
      skills: ["SQL", "Python", "Excel", "Tableau", "Power BI"],
      postedDate: "2024-01-12",
      applicationDeadline: "2024-02-12",
      status: "Active",
      applicants: 32,
      category: "Data Science",
      companyLogo: null,
      contactEmail: "careers@datainsights.com",
      companyWebsite: "https://datainsights.com",
      benefits: ["Health Insurance", "Performance Bonus", "Remote Work"],
      workMode: "Remote"
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "WebCraft Studios",
      location: "Hyderabad, India",
      type: "Full-time",
      experience: "0-1 years",
      salary: "₹4-6 LPA",
      description: "Create beautiful and responsive web applications using modern frontend technologies. Perfect opportunity for fresh graduates.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "Strong knowledge of HTML, CSS, JavaScript",
        "Experience with React or Angular",
        "Understanding of responsive design",
        "Portfolio of web projects"
      ],
      skills: ["HTML", "CSS", "JavaScript", "React", "Angular"],
      postedDate: "2024-01-10",
      applicationDeadline: "2024-02-10",
      status: "Active",
      applicants: 28,
      category: "Web Development",
      companyLogo: null,
      contactEmail: "jobs@webcraft.com",
      companyWebsite: "https://webcraft.com",
      benefits: ["Health Insurance", "Skill Development", "Flexible Hours"],
      workMode: "On-site"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    skills: '',
    applicationDeadline: '',
    category: 'Software Development',
    contactEmail: '',
    companyWebsite: '',
    benefits: '',
    workMode: 'On-site'
  });

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];
  const categories = ['Software Development', 'Data Science', 'Web Development', 'Mobile Development', 'DevOps', 'Cybersecurity', 'AI/ML'];
  const workModes = ['On-site', 'Remote', 'Hybrid'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === editingId ? {
            ...job,
            ...jobForm,
            requirements: jobForm.requirements.split('\n').filter(req => req.trim()),
            skills: jobForm.skills.split(',').map(skill => skill.trim()),
            benefits: jobForm.benefits.split(',').map(benefit => benefit.trim())
          } : job
        )
      );
      setEditingId(null);
    } else {
      const newJob = {
        ...jobForm,
        id: Date.now(),
        requirements: jobForm.requirements.split('\n').filter(req => req.trim()),
        skills: jobForm.skills.split(',').map(skill => skill.trim()),
        benefits: jobForm.benefits.split(',').map(benefit => benefit.trim()),
        postedDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        applicants: 0,
        companyLogo: null
      };
      setJobs([newJob, ...jobs]);
    }

    setJobForm({
      title: '', company: '', location: '', type: 'Full-time',
      experience: '', salary: '', description: '', requirements: '',
      skills: '', applicationDeadline: '', category: 'Software Development',
      contactEmail: '', companyWebsite: '', benefits: '', workMode: 'On-site'
    });
    setShowAddForm(false);
  };

  const handleEdit = (job) => {
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements.join('\n'),
      skills: job.skills.join(', '),
      applicationDeadline: job.applicationDeadline,
      category: job.category,
      contactEmail: job.contactEmail,
      companyWebsite: job.companyWebsite,
      benefits: job.benefits.join(', '),
      workMode: job.workMode
    });
    setEditingId(job.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (selectedType === '' || job.type === selectedType) &&
    (selectedCategory === '' || job.category === selectedCategory) &&
    (selectedWorkMode === '' || job.workMode === selectedWorkMode)
  );

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-blue-600 font-medium">{job.company}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{job.type}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {job.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            job.workMode === 'Remote' ? 'bg-purple-100 text-purple-800' :
            job.workMode === 'Hybrid' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.workMode}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{job.salary}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{job.experience}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Required Skills</h4>
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">{job.applicants} applicants</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">
              Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedJob(job);
              setShowJobDetails(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(job)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(job.id)}
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
          <h2 className="text-3xl font-bold text-gray-900">Job Opportunities</h2>
          <p className="text-gray-600 mt-2">Manage job postings and opportunities for students</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Jobs</p>
              <p className="text-3xl font-bold">{jobs.length}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Jobs</p>
              <p className="text-3xl font-bold">{jobs.filter(j => j.status === 'Active').length}</p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Applicants</p>
              <p className="text-3xl font-bold">{jobs.reduce((acc, j) => acc + j.applicants, 0)}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Companies</p>
              <p className="text-3xl font-bold">{new Set(jobs.map(j => j.company)).size}</p>
            </div>
            <Building className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Work Modes</option>
              {workModes.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredJobs.length} jobs found
            </span>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedType || selectedCategory || selectedWorkMode 
              ? "No jobs match your current filters." 
              : "Get started by posting your first job opportunity."
            }
          </p>
          {!searchTerm && !selectedType && !selectedCategory && !selectedWorkMode && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Post First Job</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Add/Edit Job Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Job Posting' : 'Post New Job'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingId ? 'Update job information' : 'Create a new job opportunity for students'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setJobForm({
                    title: '', company: '', location: '', type: 'Full-time',
                    experience: '', salary: '', description: '', requirements: '',
                    skills: '', applicationDeadline: '', category: 'Software Development',
                    contactEmail: '', companyWebsite: '', benefits: '', workMode: 'On-site'
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
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleInputChange}
                    placeholder="Enter job title"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={jobForm.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={jobForm.location}
                    onChange={handleInputChange}
                    placeholder="Enter job location"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Type *
                  </label>
                  <select
                    name="type"
                    value={jobForm.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Experience Required *
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={jobForm.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 0-2 years"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary Range *
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={jobForm.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., ₹6-8 LPA"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={jobForm.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Mode *
                  </label>
                  <select
                    name="workMode"
                    value={jobForm.workMode}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {workModes.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={jobForm.applicationDeadline}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={jobForm.contactEmail}
                    onChange={handleInputChange}
                    placeholder="Enter contact email"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={jobForm.companyWebsite}
                    onChange={handleInputChange}
                    placeholder="https://company.com"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed job description"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requirements *
                </label>
                <textarea
                  name="requirements"
                  value={jobForm.requirements}
                  onChange={handleInputChange}
                  placeholder="Enter job requirements (one per line)"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter each requirement on a new line</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Required Skills *
                  </label>
                  <textarea
                    name="skills"
                    value={jobForm.skills}
                    onChange={handleInputChange}
                    placeholder="Enter required skills separated by commas"
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Benefits
                  </label>
                  <textarea
                    name="benefits"
                    value={jobForm.benefits}
                    onChange={handleInputChange}
                    placeholder="Enter benefits separated by commas"
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate benefits with commas</p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setJobForm({
                      title: '', company: '', location: '', type: 'Full-time',
                      experience: '', salary: '', description: '', requirements: '',
                      skills: '', applicationDeadline: '', category: 'Software Development',
                      contactEmail: '', companyWebsite: '', benefits: '', workMode: 'On-site'
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
                  <span>{editingId ? 'Update Job' : 'Post Job'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h3>
                  <p className="text-blue-600 font-medium">{selectedJob.company}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>{selectedJob.location}</span>
                    <span>•</span>
                    <span>{selectedJob.type}</span>
                    <span>•</span>
                    <span>{selectedJob.workMode}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowJobDetails(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Job Description</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span className="text-gray-600 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.benefits.map((benefit, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Job Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Salary: {selectedJob.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Experience: {selectedJob.experience}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Posted: {new Date(selectedJob.postedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Deadline: {new Date(selectedJob.applicationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Application Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedJob.applicants}</div>
                      <div className="text-sm text-blue-800">Total Applicants</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.max(0, Math.ceil((new Date(selectedJob.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24)))}
                      </div>
                      <div className="text-sm text-green-800">Days Left</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Company Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Contact Email:</span>
                      <a 
                        href={`mailto:${selectedJob.contactEmail}`}
                        className="ml-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        {selectedJob.contactEmail}
                      </a>
                    </div>
                    {selectedJob.companyWebsite && (
                      <div>
                        <span className="text-sm text-gray-500">Website:</span>
                        <a 
                          href={selectedJob.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        >
                          Visit Website
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-500">Category:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedJob.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowJobDetails(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedJob);
                  setShowJobDetails(false);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Job</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentJobs;