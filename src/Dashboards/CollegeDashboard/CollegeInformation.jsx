import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  User, 
  Calendar, 
  Award, 
  Users, 
  Save, 
  Edit3, 
  Camera,
  Upload,
  ExternalLink,
  Star,
  CheckCircle
} from 'lucide-react';

function CollegeInfoForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [collegeInfo, setCollegeInfo] = useState({
    name: 'Engineering College of Excellence',
    university: 'State University',
    type: 'Autonomous',
    established: '1985',
    accreditation: 'NAAC A+',
    ranking: 'NIRF Rank 45',
    address: '123 College Street',
    city: 'Tech City',
    state: 'California',
    country: 'United States',
    phone: '+1 234 567 8900',
    email: 'info@college.edu',
    website: 'https://www.college.edu',
    principal: 'Dr. Sarah Johnson',
    principalContact: '+1 234 567 8901',
    principalEmail: 'principal@college.edu',
    majorCourses: 'Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering',
    researchAreas: 'Artificial Intelligence, Renewable Energy, Robotics, Sustainable Engineering',
    notableAlumni: 'John Doe (CEO, Tech Corp), Jane Smith (NASA Scientist), Mike Wilson (Startup Founder)',
    achievements: 'Best Engineering College Award 2023, Excellence in Research 2022, Industry Partnership Award 2021',
    linkedin: 'https://linkedin.com/company/college',
    facebook: 'https://facebook.com/college',
    instagram: 'https://instagram.com/college',
    twitter: 'https://twitter.com/college',
    studentCount: '5000',
    facultyCount: '300',
    campusSize: '150 acres',
    establishmentHistory: 'Founded in 1985 with a vision to provide world-class engineering education...'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollegeInfo({ ...collegeInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('College information updated successfully!');
    setIsEditing(false);
    console.log(collegeInfo);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: Building },
    { id: 'contact', label: 'Contact Details', icon: Phone },
    { id: 'administration', label: 'Administration', icon: User },
    { id: 'academic', label: 'Academic Info', icon: Award },
    { id: 'social', label: 'Social Media', icon: Globe },
  ];

  const InfoCard = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InputField = ({ label, name, type = "text", placeholder, required = false, rows }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {rows ? (
        <textarea
          name={name}
          value={collegeInfo[name]}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          disabled={!isEditing}
          className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            !isEditing ? 'bg-gray-50 text-gray-600' : ''
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={collegeInfo[name]}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={!isEditing}
          className={`w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            !isEditing ? 'bg-gray-50 text-gray-600' : ''
          }`}
          required={required}
        />
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="College Name" name="name" required placeholder="Enter college name" />
            <InputField label="Affiliated University" name="university" required placeholder="Enter university name" />
            <InputField label="College Type" name="type" placeholder="Government/Private/Autonomous" />
            <InputField label="Established Year" name="established" type="number" placeholder="1985" />
            <InputField label="Accreditation" name="accreditation" placeholder="NAAC A+" />
            <InputField label="Ranking" name="ranking" placeholder="NIRF Rank 45" />
            <InputField label="Student Count" name="studentCount" type="number" placeholder="5000" />
            <InputField label="Faculty Count" name="facultyCount" type="number" placeholder="300" />
            <InputField label="Campus Size" name="campusSize" placeholder="150 acres" />
            <div className="md:col-span-2">
              <InputField 
                label="Establishment History" 
                name="establishmentHistory" 
                rows={4} 
                placeholder="Brief history of the college..." 
              />
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Address" name="address" required placeholder="123 College Street" />
            <InputField label="City" name="city" required placeholder="Tech City" />
            <InputField label="State" name="state" required placeholder="California" />
            <InputField label="Country" name="country" required placeholder="United States" />
            <InputField label="Phone Number" name="phone" type="tel" required placeholder="+1 234 567 8900" />
            <InputField label="Email Address" name="email" type="email" required placeholder="info@college.edu" />
            <div className="md:col-span-2">
              <InputField label="Website URL" name="website" type="url" placeholder="https://www.college.edu" />
            </div>
          </div>
        );

      case 'administration':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Principal/Dean Name" name="principal" required placeholder="Dr. Sarah Johnson" />
            <InputField label="Principal's Contact" name="principalContact" type="tel" placeholder="+1 234 567 8901" />
            <div className="md:col-span-2">
              <InputField label="Principal's Email" name="principalEmail" type="email" placeholder="principal@college.edu" />
            </div>
          </div>
        );

      case 'academic':
        return (
          <div className="space-y-6">
            <InputField 
              label="Major Courses" 
              name="majorCourses" 
              rows={3} 
              placeholder="List major courses offered..." 
            />
            <InputField 
              label="Research Areas" 
              name="researchAreas" 
              rows={3} 
              placeholder="Key research areas and specializations..." 
            />
            <InputField 
              label="Notable Alumni" 
              name="notableAlumni" 
              rows={3} 
              placeholder="List notable alumni and their achievements..." 
            />
            <InputField 
              label="Major Achievements" 
              name="achievements" 
              rows={3} 
              placeholder="Awards, recognitions, and achievements..." 
            />
          </div>
        );

      case 'social':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="LinkedIn Profile" name="linkedin" type="url" placeholder="https://linkedin.com/company/college" />
            <InputField label="Facebook Page" name="facebook" type="url" placeholder="https://facebook.com/college" />
            <InputField label="Instagram Handle" name="instagram" type="url" placeholder="https://instagram.com/college" />
            <InputField label="Twitter Handle" name="twitter" type="url" placeholder="https://twitter.com/college" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">College Information</h2>
          <p className="text-gray-600 mt-2">Manage your college details and information</p>
        </div>
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              <Edit3 className="w-5 h-5" />
              <span>Edit Information</span>
            </button>
          )}
        </div>
      </div>

      {/* College Overview Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <Building className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{collegeInfo.name}</h3>
              <p className="text-blue-100 text-lg">{collegeInfo.university}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Est. {collegeInfo.established}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{collegeInfo.accreditation}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold">{collegeInfo.studentCount}</div>
              <div className="text-blue-100 text-sm">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{collegeInfo.facultyCount}</div>
              <div className="text-blue-100 text-sm">Faculty</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{collegeInfo.campusSize}</div>
              <div className="text-blue-100 text-sm">Campus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <InfoCard title="Accreditation" icon={Award}>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-gray-900">{collegeInfo.accreditation}</span>
          </div>
        </InfoCard>
        
        <InfoCard title="Ranking" icon={Star}>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-900">{collegeInfo.ranking}</span>
          </div>
        </InfoCard>
        
        <InfoCard title="Type" icon={Building}>
          <span className="font-semibold text-gray-900">{collegeInfo.type}</span>
        </InfoCard>
        
        <InfoCard title="Website" icon={Globe}>
          <a 
            href={collegeInfo.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </InfoCard>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {renderTabContent()}
          </form>
        </div>
      </div>

      {/* Social Media Preview */}
      {!isEditing && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Presence</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'LinkedIn', url: collegeInfo.linkedin, color: 'blue' },
              { name: 'Facebook', url: collegeInfo.facebook, color: 'blue' },
              { name: 'Instagram', url: collegeInfo.instagram, color: 'pink' },
              { name: 'Twitter', url: collegeInfo.twitter, color: 'blue' },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center space-x-2 p-3 bg-${social.color}-50 text-${social.color}-600 rounded-xl hover:bg-${social.color}-100 transition-colors`}
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CollegeInfoForm;