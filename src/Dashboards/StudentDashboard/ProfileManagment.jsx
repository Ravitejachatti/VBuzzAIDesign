import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Award, 
  MapPin, 
  Phone, 
  Users, 
  FileText, 
  Shield, 
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Edit3,
  Save,
  RefreshCw
} from 'lucide-react';

import UpdatePersonalDetails from "./Profile/PersonalDetails";
import UpdateEducationDetails from "./Profile/EducationDetails";
import UpdateAcademicProjects from "./Profile/AcademicProjects";
import UpdatePreferences from "./Profile/UpdatePreferences";
import UpdateContactInfo from "./Profile/UpdateContactInfo";
import UpdateSkills from "./Profile/UpdateSkills";
import UpdateExperience from "./Profile/WorkExperience";
import UpdateDocuments from "./Profile/Documents";  
import UpdateParentDetails from "./Profile/ParentDetails";
import UpdateDocumentVerification from "./Profile/UploadDocumentVerification";
import ResumeBuilder from "./Resume/Resume/ResumeBuilder";

const ProfileManagement = ({studentData}) => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();

  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");
  const token = localStorage.getItem("Student token");

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [completionStatus, setCompletionStatus] = useState({});

  useEffect(() => {
    if (!studentId) {
      console.error("No studentId found.");
      return;
    }

    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/student/${studentId}?universityName=${encodeURIComponent(universityName)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { student } = response?.data;

        if (!student) {
          throw new Error("Student data is missing in the response.");
        }

        localStorage.setItem("studentData", JSON.stringify(response.data));
        
        // Calculate completion status
        calculateCompletionStatus(student);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [BASE_URL, studentId, universityName]);

  const calculateCompletionStatus = (student) => {
    const status = {
      personal: checkPersonalCompletion(student),
      education: checkEducationCompletion(student),
      projects: checkProjectsCompletion(student),
      skills: checkSkillsCompletion(student),
      experience: checkExperienceCompletion(student),
      contact: checkContactCompletion(student),
      parents: checkParentsCompletion(student),
      resume: checkResumeCompletion(student),
      documents: checkDocumentsCompletion(student),
      verification: checkVerificationCompletion(student),
    };
    setCompletionStatus(status);
  };

  const checkPersonalCompletion = (student) => {
    const required = ['name', 'email', 'phone', 'gender', 'dateOfBirth'];
    const completed = required.filter(field => student[field]).length;
    return Math.round((completed / required.length) * 100);
  };

  const checkEducationCompletion = (student) => {
    const hasEducation = student.tenth || student.twelfth || student.bachelors;
    return hasEducation ? 100 : 0;
  };

  const checkProjectsCompletion = (student) => {
    return student.academicProjects?.length > 0 ? 100 : 0;
  };

  const checkSkillsCompletion = (student) => {
    const skills = student.skillsAndCompetencies;
    return skills?.technicalSkills?.length > 0 || skills?.softSkills?.length > 0 ? 100 : 0;
  };

  const checkExperienceCompletion = (student) => {
    return student.workExperience?.length > 0 ? 100 : 0;
  };

  const checkContactCompletion = (student) => {
    return student.contactInfo ? 100 : 0;
  };

  const checkParentsCompletion = (student) => {
    return student.parentDetails?.name ? 100 : 0;
  };

  const checkResumeCompletion = (student) => {
    return student.documents?.resumeOrCV ? 100 : 0;
  };

  const checkDocumentsCompletion = (student) => {
    const docs = student.documents;
    return docs?.resumeOrCV ? 100 : 0;
  };

  const checkVerificationCompletion = (student) => {
    return student.documentVerification?.aadharNumber ? 100 : 0;
  };

  const renderActiveSection = () => {
    const goToNextSection = () => {
      const currentIndex = profileSections.findIndex(s => s.id === activeSection);
      const nextSection = profileSections[currentIndex + 1];
      if (nextSection) setActiveSection(nextSection.id);
    };
  
    const sectionProps = { goToNext: goToNextSection, studentData };

    switch (activeSection) {
      case "personal": return <UpdatePersonalDetails {...sectionProps} />;
      case "education": return <UpdateEducationDetails {...sectionProps} />;
      case "projects": return <UpdateAcademicProjects {...sectionProps} />;
      case "preferences": return <UpdatePreferences {...sectionProps} />;
      case "contact": return <UpdateContactInfo {...sectionProps} />;
      case "skills": return <UpdateSkills {...sectionProps} />;
      case "experience": return <UpdateExperience {...sectionProps} />;
      case "resume": return <ResumeBuilder {...sectionProps} />;
      case "documents": return <UpdateDocuments {...sectionProps} />;
      case "parents": return <UpdateParentDetails {...sectionProps} />;
      case "verification": return <UpdateDocumentVerification {...sectionProps} />;
      default: return <UpdatePersonalDetails {...sectionProps} />;
    }
  };

  const profileSections = [
    { 
      id: "personal", 
      name: "Personal Details", 
      icon: User, 
      description: "Basic information and preferences",
      category: "Basic Info"
    },
    { 
      id: "education", 
      name: "Education", 
      icon: GraduationCap, 
      description: "Academic qualifications and certifications",
      category: "Academic"
    },
    { 
      id: "projects", 
      name: "Projects", 
      icon: BookOpen, 
      description: "Academic and personal projects",
      category: "Academic"
    },
    { 
      id: "skills", 
      name: "Skills", 
      icon: Award, 
      description: "Technical and soft skills",
      category: "Professional"
    },
    { 
      id: "experience", 
      name: "Experience", 
      icon: Settings, 
      description: "Work experience and internships",
      category: "Professional"
    },
    { 
      id: "contact", 
      name: "Contact Info", 
      icon: Phone, 
      description: "Contact details and address",
      category: "Basic Info"
    },
    { 
      id: "parents", 
      name: "Parent Details", 
      icon: Users, 
      description: "Guardian and family information",
      category: "Basic Info"
    },
    { 
      id: "resume", 
      name: "Resume Builder", 
      icon: FileText, 
      description: "Create professional resumes",
      category: "Professional"
    },
    { 
      id: "documents", 
      name: "Documents", 
      icon: FileText, 
      description: "Upload important documents",
      category: "Documents"
    },
    { 
      id: "verification", 
      name: "Verification", 
      icon: Shield, 
      description: "Identity verification documents",
      category: "Documents"
    },
  ];

  const getCompletionIcon = (percentage) => {
    if (percentage === 100) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (percentage > 0) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getCompletionColor = (percentage) => {
    if (percentage === 100) return "text-green-600 bg-green-100";
    if (percentage > 0) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const overallCompletion = Math.round(
    Object.values(completionStatus).reduce((sum, val) => sum + val, 0) / 
    Object.keys(completionStatus).length
  );

  const groupedSections = profileSections.reduce((acc, section) => {
    if (!acc[section.category]) acc[section.category] = [];
    acc[section.category].push(section);
    return acc;
  }, {});

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <User className="w-8 h-8 text-blue-600 mr-3" />
              Profile Management
            </h2>
            <p className="text-gray-600 mt-2">Complete your profile to maximize opportunities</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{overallCompletion}%</div>
              <div className="text-sm opacity-90">Complete</div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallCompletion}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            Complete all sections to improve your profile visibility and job matching accuracy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <h3 className="text-xl font-bold">Profile Sections</h3>
              <p className="text-blue-100 mt-1">Manage your information</p>
            </div>

            <div className="p-4">
              {Object.entries(groupedSections).map(([category, sections]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      const completion = completionStatus[section.id] || 0;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                            activeSection === section.id
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                              : 'text-gray-700 hover:bg-gray-50 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Icon className={`w-4 h-4 ${
                                activeSection === section.id ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
                              }`} />
                              <span className="font-medium text-sm">{section.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                activeSection === section.id 
                                  ? 'bg-white/20 text-white' 
                                  : getCompletionColor(completion)
                              }`}>
                                {completion}%
                              </span>
                              {getCompletionIcon(completion)}
                            </div>
                          </div>
                          <p className={`text-xs mt-1 ${
                            activeSection === section.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {section.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-900 mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Profile Benefits
            </h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Better job matching accuracy
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Increased recruiter visibility
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Professional resume generation
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Personalized recommendations
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Section Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {profileSections.find(s => s.id === activeSection) && (
                    <>
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        {React.createElement(profileSections.find(s => s.id === activeSection).icon, {
                          className: "w-6 h-6 text-white"
                        })}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {profileSections.find(s => s.id === activeSection).name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {profileSections.find(s => s.id === activeSection).description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getCompletionColor(completionStatus[activeSection] || 0)
                  }`}>
                    {completionStatus[activeSection] || 0}% Complete
                  </span>
                  {getCompletionIcon(completionStatus[activeSection] || 0)}
                </div>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;