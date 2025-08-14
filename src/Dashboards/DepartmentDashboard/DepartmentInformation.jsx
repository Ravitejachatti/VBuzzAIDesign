import React, { useState, useEffect } from 'react';
import { 
  Info, 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  Award, 
  BookOpen,
  Building,
  User,
  Globe,
  FileText,
  Star,
  TrendingUp,
  Target,
  Clock
} from 'lucide-react';

function DepartmentInformation({ 
  departmentId, 
  departmentName, 
  token, 
  universityName, 
  colleges, 
  departments, 
  programs 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [departmentInfo, setDepartmentInfo] = useState({
    name: departmentName || "Computer Science Department",
    code: "CSE",
    establishedYear: "2005",
    description: "The Computer Science Department is dedicated to providing high-quality education and conducting cutting-edge research in various areas of computer science and technology.",
    vision: "To be a leading department in computer science education and research, producing skilled professionals who contribute to technological advancement and societal development.",
    mission: "To provide excellent education, foster innovation, and conduct impactful research in computer science while preparing students for successful careers in technology.",
    headOfDepartment: "Dr. Sarah Johnson",
    hodEmail: "sarah.johnson@university.edu",
    hodPhone: "+1-234-567-8901",
    location: "CS Building, 3rd Floor",
    officeHours: "Monday - Friday, 9:00 AM - 5:00 PM",
    totalFaculty: 18,
    totalStudents: 245,
    totalPrograms: 6,
    researchAreas: [
      "Artificial Intelligence",
      "Machine Learning",
      "Software Engineering",
      "Cybersecurity",
      "Data Science",
      "Computer Networks"
    ],
    achievements: [
      "NAAC A+ Accreditation",
      "Best Department Award 2023",
      "Research Excellence Recognition",
      "Industry Partnership Excellence"
    ],
    facilities: [
      "Advanced Computer Labs",
      "Research Centers",
      "Project Development Labs",
      "Seminar Halls",
      "Library with Digital Resources"
    ],
    industryPartnerships: [
      "TechCorp Solutions",
      "DataInsights Inc",
      "WebCraft Studios",
      "InnovateSoft",
      "CloudTech Systems"
    ],
    accreditations: [
      "NAAC A+",
      "NBA Accredited",
      "UGC Recognized",
      "AICTE Approved"
    ],
    website: "https://cs.university.edu",
    socialMedia: {
      linkedin: "https://linkedin.com/company/cs-dept",
      twitter: "https://twitter.com/cs_dept",
      facebook: "https://facebook.com/cs.department"
    }
  });

  const [editForm, setEditForm] = useState({ ...departmentInfo });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value.split('\n').filter(item => item.trim())
    }));
  };

  const handleSave = () => {
    setDepartmentInfo({ ...editForm });
    setIsEditing(false);
    // Here you would typically make an API call to save the data
  };

  const handleCancel = () => {
    setEditForm({ ...departmentInfo });
    setIsEditing(false);
  };

  const InfoCard = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`rounded-2xl p-6 text-white bg-gradient-to-r ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-white/60" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Department Information</h2>
          <p className="text-gray-600 mt-2">Manage department details and information</p>
        </div>
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Edit3 className="w-5 h-5" />
              <span>Edit Information</span>
            </button>
          )}
        </div>
      </div>

      {/* Department Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{departmentInfo.name}</h1>
            <p className="text-blue-100 text-lg mb-4">
              Established in {departmentInfo.establishedYear} • Code: {departmentInfo.code}
            </p>
            <p className="text-blue-100 max-w-3xl">
              {departmentInfo.description}
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Faculty"
          value={departmentInfo.totalFaculty}
          icon={Users}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Students"
          value={departmentInfo.totalStudents}
          icon={Users}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Programs Offered"
          value={departmentInfo.totalPrograms}
          icon={BookOpen}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Research Areas"
          value={departmentInfo.researchAreas.length}
          icon={Award}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Main Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <InfoCard title="Basic Information" icon={Info}>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department Code</label>
                <input
                  type="text"
                  name="code"
                  value={editForm.code}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Established Year</label>
                <input
                  type="text"
                  name="establishedYear"
                  value={editForm.establishedYear}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Department Name:</span>
                <p className="text-gray-900 font-medium">{departmentInfo.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Department Code:</span>
                <p className="text-gray-900 font-medium">{departmentInfo.code}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Established:</span>
                <p className="text-gray-900 font-medium">{departmentInfo.establishedYear}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Description:</span>
                <p className="text-gray-900 leading-relaxed">{departmentInfo.description}</p>
              </div>
            </div>
          )}
        </InfoCard>

        {/* Contact Information */}
        <InfoCard title="Contact Information" icon={Phone}>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Head of Department</label>
                <input
                  type="text"
                  name="headOfDepartment"
                  value={editForm.headOfDepartment}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">HOD Email</label>
                <input
                  type="email"
                  name="hodEmail"
                  value={editForm.hodEmail}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">HOD Phone</label>
                <input
                  type="tel"
                  name="hodPhone"
                  value={editForm.hodPhone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Office Hours</label>
                <input
                  type="text"
                  name="officeHours"
                  value={editForm.officeHours}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 font-medium">{departmentInfo.headOfDepartment}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a href={`mailto:${departmentInfo.hodEmail}`} className="text-blue-600 hover:text-blue-700">
                  {departmentInfo.hodEmail}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{departmentInfo.hodPhone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{departmentInfo.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{departmentInfo.officeHours}</span>
              </div>
            </div>
          )}
        </InfoCard>

        {/* Vision & Mission */}
        <InfoCard title="Vision & Mission" icon={Target}>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vision</label>
                <textarea
                  name="vision"
                  value={editForm.vision}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mission</label>
                <textarea
                  name="mission"
                  value={editForm.mission}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Vision</h4>
                <p className="text-gray-600 leading-relaxed">{departmentInfo.vision}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Mission</h4>
                <p className="text-gray-600 leading-relaxed">{departmentInfo.mission}</p>
              </div>
            </div>
          )}
        </InfoCard>

        {/* Research Areas */}
        <InfoCard title="Research Areas" icon={Award}>
          {isEditing ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Research Areas (one per line)
              </label>
              <textarea
                value={editForm.researchAreas.join('\n')}
                onChange={(e) => handleArrayInputChange('researchAreas', e.target.value)}
                rows="6"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {departmentInfo.researchAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <Star className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-900">{area}</span>
                </div>
              ))}
            </div>
          )}
        </InfoCard>

        {/* Achievements */}
        <InfoCard title="Achievements" icon={Award}>
          {isEditing ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Achievements (one per line)
              </label>
              <textarea
                value={editForm.achievements.join('\n')}
                onChange={(e) => handleArrayInputChange('achievements', e.target.value)}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : (
            <div className="space-y-2">
              {departmentInfo.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-900">{achievement}</span>
                </div>
              ))}
            </div>
          )}
        </InfoCard>

        {/* Facilities */}
        <InfoCard title="Facilities" icon={Building}>
          {isEditing ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Facilities (one per line)
              </label>
              <textarea
                value={editForm.facilities.join('\n')}
                onChange={(e) => handleArrayInputChange('facilities', e.target.value)}
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : (
            <div className="space-y-2">
              {departmentInfo.facilities.map((facility, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                  <Building className="w-4 h-4 text-green-600" />
                  <span className="text-gray-900">{facility}</span>
                </div>
              ))}
            </div>
          )}
        </InfoCard>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Industry Partnerships */}
        <InfoCard title="Industry Partnerships" icon={TrendingUp}>
          {isEditing ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry Partners (one per line)
              </label>
              <textarea
                value={editForm.industryPartnerships.join('\n')}
                onChange={(e) => handleArrayInputChange('industryPartnerships', e.target.value)}
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {departmentInfo.industryPartnerships.map((partner, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                  <Building className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-900">{partner}</span>
                </div>
              ))}
            </div>
          )}
        </InfoCard>

        {/* Accreditations */}
        <InfoCard title="Accreditations" icon={FileText}>
          {isEditing ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Accreditations (one per line)
              </label>
              <textarea
                value={editForm.accreditations.join('\n')}
                onChange={(e) => handleArrayInputChange('accreditations', e.target.value)}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {departmentInfo.accreditations.map((accreditation, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-900">{accreditation}</span>
                </div>
              ))}
            </div>
          )}
        </InfoCard>
      </div>

      {/* Website and Social Media */}
      <InfoCard title="Online Presence" icon={Globe}>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={editForm.website}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
              <input
                type="url"
                value={editForm.socialMedia?.linkedin || ''}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter</label>
              <input
                type="url"
                value={editForm.socialMedia?.twitter || ''}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
              <input
                type="url"
                value={editForm.socialMedia?.facebook || ''}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Website:</span>
              <a 
                href={departmentInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-700"
              >
                {departmentInfo.website}
              </a>
            </div>
            <div>
              <span className="text-sm text-gray-500">LinkedIn:</span>
              <a 
                href={departmentInfo.socialMedia?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-700"
              >
                Department LinkedIn
              </a>
            </div>
            <div>
              <span className="text-sm text-gray-500">Twitter:</span>
              <a 
                href={departmentInfo.socialMedia?.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-700"
              >
                @cs_dept
              </a>
            </div>
            <div>
              <span className="text-sm text-gray-500">Facebook:</span>
              <a 
                href={departmentInfo.socialMedia?.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-700"
              >
                CS Department
              </a>
            </div>
          </div>
        )}
      </InfoCard>
    </div>
  );
}

export default DepartmentInformation;