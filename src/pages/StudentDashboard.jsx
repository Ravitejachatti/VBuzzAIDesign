import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell, Briefcase, BarChart3, Target, User, FileText, GraduationCap, Menu, X,
  Users, ShieldCheck
} from "lucide-react";
import { fetchStudent } from "../Redux/StudentDashboard/StudentSlice";
import JobOpportunities from '../Dashboards/StudentDashboard/Job/JobOpportunities';
import JobRound from '../Dashboards/StudentDashboard/Job/JobRound';
import ManageNotice from '../Dashboards/StudentDashboard/Job/Notices';
import AdmissionStepperPage from '../Dashboards/StudentDashboard/Admission/components/AdmissionStepperPage';
import PlacementAnalysis from '../Dashboards/StudentDashboard/PlacementReports/PlacementAnalysis';
import ProfileManagement from "../Dashboards/StudentDashboard/ProfileManagment";
// import ResumeBuilder from "../Dashboards/StudentDashboard/Resume/Resume/ResumeBuilder";
import LoadingSpinner from "../components/Resuable/LoadingSpinner";

/** ---------- Helpers to build the student intro (as separate steps) ---------- */

const norm = (v) => (typeof v === "string" ? v.trim() : "");

const pickRecentEducation = (student) => {
  const m = student?.masters;
  const b = student?.bachelors;

  const mYear = Number(m?.yearOfCompletion) || -Infinity;
  const bYear = Number(b?.yearOfCompletion) || -Infinity;

  if (m && (mYear >= bYear)) return {
    level: "Masters",
    degree: norm(m.degree) || "Masters",
    specialization: norm(m.specialization),
    year: mYear > 0 ? mYear : null,
  };

  if (b) return {
    level: "Bachelors",
    degree: norm(b.degree) || "Bachelors",
    specialization: norm(b.specialization),
    year: bYear > 0 ? bYear : null,
  };

  return null;
};

const firstExperienceSnippet = (student) => {
  const first = Array.isArray(student?.workExperience) && student.workExperience.length > 0
    ? student.workExperience[0]
    : null;

  if (!first) return "";

  const company = norm(first.companyName);
  const role = norm(first.position);
  const duration = norm(first.duration);

  const parts = [];
  if (role) parts.push(role);
  if (company) parts.push(`@ ${company}`);
  if (duration) parts.push(`(${duration})`);

  return parts.join(" ");
};

const topTechnicalSkills = (student, limit = 6) => {
  const raw = student?.skillsAndCompetencies?.technicalSkills || [];
  const tokens = [];
  raw.forEach((item) => {
    if (!item) return;
    if (typeof item === "string") {
      item.split(",").forEach(s => {
        const t = s.trim();
        if (t) tokens.push(t);
      });
    } else if (typeof item === "object") {
      const t = item?.name ? String(item.name).trim() : "";
      if (t) tokens.push(t);
    }
  });
  const unique = Array.from(new Set(tokens.map(s => s.replace(/\s+/g, " "))));
  return unique.slice(0, limit).join(", ");
};

// Build *separate* parts instead of one combined string
const buildIntroParts = (student) => {
  const edu = pickRecentEducation(student);
  const skills = topTechnicalSkills(student);
  const exp = firstExperienceSnippet(student);

  const education = edu
    ? `${edu.degree}${edu.specialization ? ` — ${edu.specialization}` : ""}${edu.year ? `, ${edu.year}` : ""}`
    : "";

  return {
    education,
    skills: skills ? `${skills}` : "",
    experience: exp ? `${exp}` : "",
  };
};
/** -------------------------------------------------------------------------- */

/** Simple placeholder pages */
const Alumni = () => (
  <div className="p-10 text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
      <Users className="w-8 h-8 text-blue-600" />
    </div>
    <h2 className="text-2xl font-bold mb-2">Alumni</h2>
    <p className="text-gray-600">This section is coming soon. You’ll be able to connect with alumni and view their career paths here.</p>
  </div>
);

const CertificateVerification = () => (
  <div className="p-10 text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
      <ShieldCheck className="w-8 h-8 text-green-600" />
    </div>
    <h2 className="text-2xl font-bold mb-2">Certificate Verification</h2>
    <p className="text-gray-600">This section is coming soon. Upload and verify academic/placement certificates here.</p>
  </div>
);

function StudentDashboard() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { universityName } = useParams();

  const locationState = location.state || {};
  const localStudent = JSON.parse(localStorage.getItem("Student User") || "{}");
  const studentId = localStudent.id || locationState.student?.id || null;

  const { data: studentData, loading, error } = useSelector((state) => state.student);

  const [activeComponent, setActiveComponent] = useState("ManageNotice");
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (studentId && universityName) {
      dispatch(fetchStudent({ studentId, universityName }));
    }
  }, [studentId, universityName, dispatch]);

  useEffect(() => {
    if (studentData && !localStorage.getItem("studentData")) {
      localStorage.setItem("studentData", JSON.stringify({ student: studentData }));
      localStorage.setItem("department", studentData.department);
    }
  }, [studentData]);

  // Compute the intro parts (memoized)
  const intro = useMemo(() => buildIntroParts(studentData || {}), [studentData]);

  const components = {
    PlacementAnalysis: <PlacementAnalysis />,
    JobOpportunities: <JobOpportunities />,
    JobRound: <JobRound />,
    ManageNotice: <ManageNotice setUnreadCount={setUnreadCount} />,
    ProfileManagement: <ProfileManagement />,
    AdmissionStepperPage: <AdmissionStepperPage />,
    // ResumeBuilder: <ResumeBuilder />,
    Alumni: <Alumni />,
    CertificateVerification: <CertificateVerification />,
  };

  const sidebarItems = [
    { id: "ManageNotice", label: "Notices", icon: Bell, description: "View important announcements", badge: unreadCount > 0 ? unreadCount : null },
    { id: "JobOpportunities", label: "Job Opportunities", icon: Briefcase, description: "Browse available positions" },
    { id: "PlacementAnalysis", label: "Placement Reports", icon: BarChart3, description: "Track your placement progress" },
    { id: "JobRound", label: "Interview Rounds", icon: Target, description: "Monitor interview status" },
    { id: "ProfileManagement", label: "Profile Management", icon: User, description: "Update your information" },
    // { id: "ResumeBuilder", label: "Resume Builder", icon: FileText, description: "Create professional resumes" },
    { id: "AdmissionStepperPage", label: "Admissions", icon: GraduationCap, description: "Manage applications" },
    // New sidebars:
    { id: "Alumni", label: "Alumni", icon: Users, description: "Connect with graduates" },
    { id: "CertificateVerification", label: "Certificate Verification", icon: ShieldCheck, description: "Verify academic certificates" },
  ];

  const currentItem = sidebarItems.find((item) => item.id === activeComponent);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 p-4">Error loading student data: {error}</p>;

  const initialLetter = (studentData?.name || "S").charAt(0).toUpperCase();
  const regNo = studentData?.registered_number || "Registration Number";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Header – vertical stack: avatar (top), name, reg no, intro as steps */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-4">
        <div className="flex flex-col items-start">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
            {initialLetter}
          </div>
          <h1 className="text-lg font-semibold text-gray-900">{studentData?.name || "Student"}</h1>
          <p className="text-sm text-gray-500">{regNo}</p>

          {/* Intro shown as separate steps */}
          <ul className="mt-2 space-y-1 text-xs text-gray-700">
            {intro.education && (
              <li className="flex items-start">
                <GraduationCap className="w-4 h-4 mt-0.5 mr-2" />
                <span><span className="font-medium">Education:</span> {intro.education}</span>
              </li>
            )}
            {intro.skills && (
              <li className="flex items-start">
                <BarChart3 className="w-4 h-4 mt-0.5 mr-2" />
                <span><span className="font-medium">Skills:</span> {intro.skills}</span>
              </li>
            )}
            {intro.experience && (
              <li className="flex items-start">
                <Briefcase className="w-4 h-4 mt-0.5 mr-2" />
                <span><span className="font-medium">Experience:</span> {intro.experience}</span>
              </li>
            )}
          </ul>

          <button
            onClick={() => setSidebarOpen(true)}
            className="mt-3 inline-flex items-center px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <Menu className="w-5 h-5 mr-2" /> Menu
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar – vertical stack with intro as steps, avatar centered */}
        <div className="hidden lg:block w-80 bg-white shadow-xl border-r min-h-screen">
          <div className="p-6 border-b">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                {initialLetter}
              </div>
              <h2 className="text-xl font-bold break-words">{studentData?.name || "Student Name"}</h2>
              <p className="text-sm text-gray-500">{regNo}</p>

              <ul className="mt-3 space-y-1 text-xs text-gray-700 w-full text-left">
                {intro.education && (
                  <li className="flex items-start">
                    <GraduationCap className="w-4 h-4 mt-0.5 mr-2 shrink-0" />
                    <span><span className="font-semibold">Education:</span> {intro.education}</span>
                  </li>
                )}
                {intro.skills && (
                  <li className="flex items-start">
                    <BarChart3 className="w-4 h-4 mt-0.5 mr-2 shrink-0" />
                    <span><span className="font-semibold">Skills:</span> {intro.skills}</span>
                  </li>
                )}
                {intro.experience && (
                  <li className="flex items-start">
                    <Briefcase className="w-4 h-4 mt-0.5 mr-2 shrink-0" />
                    <span><span className="font-semibold">Experience:</span> {intro.experience}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveComponent(item.id)}
                  className={`w-full text-left p-4 rounded-xl group ${
                    activeComponent === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${activeComponent === item.id ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs rounded-full ${activeComponent === item.id ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 ${activeComponent === item.id ? "text-white/80" : "text-gray-500"} truncate`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-80 bg-white shadow-xl">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                      {initialLetter}
                    </div>
                    <h2 className="text-xl font-bold break-words">{studentData?.name || "Student Name"}</h2>
                    <p className="text-sm text-gray-500">{regNo}</p>
                    <ul className="mt-2 space-y-1 text-xs text-gray-700">
                      {intro.education && (
                        <li className="flex items-start">
                          <GraduationCap className="w-4 h-4 mt-0.5 mr-2" />
                          <span><span className="font-medium">Education:</span> {intro.education}</span>
                        </li>
                      )}
                      {intro.skills && (
                        <li className="flex items-start">
                          <BarChart3 className="w-4 h-4 mt-0.5 mr-2" />
                          <span><span className="font-medium">Skills:</span> {intro.skills}</span>
                        </li>
                      )}
                      {intro.experience && (
                        <li className="flex items-start">
                          <Briefcase className="w-4 h-4 mt-0.5 mr-2" />
                          <span><span className="font-medium">Experience:</span> {intro.experience}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveComponent(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left p-4 rounded-xl group ${
                        activeComponent === item.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${activeComponent === item.id ? "text-white" : "text-gray-500 group-hover:text-blue-500"}`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className={`px-2 py-1 text-xs rounded-full ${activeComponent === item.id ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${activeComponent === item.id ? "text-white/80" : "text-gray-500"}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-h-screen">
          <div className="bg-white shadow-sm border-b px-6 py-4">
            {currentItem && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <currentItem.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{currentItem.label}</h1>
                  <p className="text-sm text-gray-500">{currentItem.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
              {components[activeComponent]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
