import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
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

  // Retrieve studentData from location.state or localStorage
  const studentDataFromLocation = location.state || JSON.parse(localStorage.getItem("studentData"));
  const studentId = studentDataFromLocation?.student?.id || localStorage.getItem("studentId");
  const token = localStorage.getItem("Student token");

 
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");

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
     
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, [BASE_URL, studentId, universityName]);



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
    { id: "personal", name: "Personal Details", icon: "👤" },
    { id: "education", name: "Education", icon: "🎓" },
    { id: "projects", name: "Projects", icon: "📚" },
    { id: "skills", name: "Skills", icon: "🛠️" },
    { id: "experience", name: "Experience", icon: "💼" },
    { id: "contact", name: "Contact Info", icon: "📱" },
    { id: "parents", name: "Parent Details", icon: "👪" },
        { id: "resume", name: "Resume Builder", icon: "📝" },
    { id: "documents", name: "Documents", icon: "📄" },
    { id: "verification", name: "Verification", icon: "✅" },
  ];

  return (
    <div className="min-h-screen">
        {/* Profile Header */}
        <div className="px-1">
           

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <div className="flex space-x-1 md:space-x-4">
              {profileSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex px-1 md:px-3 py-1 md:py-2 text-sm font-medium rounded-lg transition duration-300 ${
                    activeSection === section.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2 text-lg">{section.icon}</span>
                  <span className="whitespace-nowrap">{section.name}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Mobile Dropdown Navigation */}
        <div className="md:hidden p-4">
          <select
            onChange={(e) => setActiveSection(e.target.value)}
            value={activeSection}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {profileSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.icon} {section.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active Section Content */}
        <div className="px-2 md:px-3">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;