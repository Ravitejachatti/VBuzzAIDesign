import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Select from "react-select";
import { 
  Users, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Building, 
  Calendar,
  User,
  Mail,
  Phone,
  GraduationCap,
  Award,
  MapPin,
  Briefcase,
  Eye,
  DollarSign,
  X,
  ChevronDown,
  TrendingUp
} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import { fetchJobs, fetchApplicantsByJob } from '../../../Redux/Jobslice.js';

const StudentsAppliedForJob = () => {
  const { universityName } = useParams();
  const [jobId, setJobId] = useState("");
  // const [jobs, setJobs] = useState([]);
  // const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);

  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewStudent, setViewStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("applied"); // "applied" or "notApplied"
  const dispatch = useDispatch();


   const colleges = useSelector((state) => state.colleges.colleges) || [];
    const departments = useSelector((state) => state.department.departments) || [];
    const programs = useSelector((state) => state.programs.programs) || [];
    const students = useSelector((state) => state.students.students) || [];
   const { jobs, applicants, loading, error } = useSelector(state => state.jobs);



  const studentList = Array.isArray(students)
    ? students
    : Array.isArray(students?.students)
      ? students.students
      : [];

  const allColumns = [
    { label: "Name", value: "name" },
    { label: "Registration Number", value: "registered_number" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "DOB", value: "dob" },
    { label: "Age", value: "age" },
    { label: "Gender", value: "gender" },
    { label: "Caste", value: "caste" },
    { label: "College", value: "college" },
    { label: "Department", value: "department" },
    { label: "Program", value: "program" },
    { label: "Graduation Year", value: "graduation_year" },
    { label: "10th School", value: "tenth_school" },
    { label: "10th CGPA", value: "tenth_cgpa" },
    { label: "12th School", value: "twelfth_school" },
    { label: "12th Branch", value: "twelfth_branch" },
    { label: "12th CGPA", value: "twelfth_cgpa" },
    { label: "UG College", value: "ug_college" },
    { label: "UG Degree", value: "ug_degree" },
    { label: "UG CGPA", value: "ug_cgpa" },
    { label: "UG Project Title", value: "ug_project_title" },
    { label: "UG Project Org", value: "ug_project_org" },
    { label: "Masters College", value: "masters_college" },
    { label: "Masters Specialization", value: "masters_specialization" },
    { label: "Masters CGPA", value: "masters_cgpa" },
    { label: "Can Apply", value: "can_apply" },
  ];

    useEffect(() => { setSelectedColumns([]); }, []);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("University authToken");

  // Mapping functions
  const collegeMap = colleges.reduce((acc, college) => {
    acc[college._id] = college.name;
    return acc;
  }, {});

  const departmentMap = departments.reduce((acc, department) => {
    acc[department._id] = department.name;
    return acc;
  }, {});

  const programMap = programs.reduce((acc, program) => {
    acc[program._id] = program.name;
    return acc;
  }, {});

  // 1️⃣ load all jobs once
  useEffect(() => {
    dispatch(fetchJobs({ token, universityName }));
  }, [dispatch, token, universityName])

    // 2️⃣ Once jobs are loaded, select the first one (earliest closing date)
    useEffect(() => {
      if (jobs.length > 0) {
        const sortedJobs = [...jobs].sort((a, b) => new Date(b.closingDate) - new Date(a.closingDate));
        setJobId(sortedJobs[0]._id);
      }
    }, [jobs]);

 // 2️⃣ when jobId changes, load its applicants
  useEffect(() => {
    if (!jobId) return;
    dispatch(fetchApplicantsByJob({ token, universityName, jobId }));
  }, [dispatch, token, universityName, jobId]);

    // 3️⃣ whenever `applicants` or `students` updates, enrich & filter
useEffect(() => {
  const enriched = applicants.map(app => {
    const stu = studentList.find(s => String(s._id) === String(app._id));
    return stu
      ? {
          ...app,
          name: stu.name,
          registered_number: stu.registered_number,
          email: stu.email,
          phone: stu.phone,
          dateOfBirth: stu.dateOfBirth,
          gender: stu.gender,
          caste: stu.caste,
          collegeId: stu.collegeId,
          departmentId: stu.departmentId,
          programId: stu.programId,
          graduation_year: stu.graduation_year,  // 👈 make sure this is included
          tenth: stu.tenth,
          twelfth: stu.twelfth,
          bachelors: stu.bachelors,
          masters: stu.masters,
          academicProjects: stu.academicProjects,
          canApply: stu.canApply
        }
      : app;
  });

  const filtered = enriched.filter((applicant) => {
    const matchesSearch = !searchTerm ||
      applicant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.registered_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCollege = selectedColleges.length === 0 || selectedColleges.some((college) => applicant.collegeId === college.value);
    const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.some((dept) => applicant.departmentId === dept.value);
    const matchesProgram = selectedPrograms.length === 0 || selectedPrograms.some((program) => applicant.programId === program.value);

    return matchesSearch && matchesCollege && matchesDepartment && matchesProgram;
  });

  setFilteredApplicants(filtered);
}, [
  applicants,
  studentList,
  selectedColleges,
  selectedDepartments,
  selectedPrograms,
  searchTerm
]);


  const formatDate = (dob) => {
    if (!dob) return "";
    const d = new Date(dob);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };


  const jobOptions = jobs.map((job) => ({ value: job._id, label: job.title }));
  const selectedJob = jobs.find(job => job._id === jobId);

  
  const collegeOptions = colleges
    .filter(college => !selectedJob || (selectedJob.colleges || []).includes(college._id))
    .map(college => ({ value: college._id, label: college.name }));
  const departmentOptions = departments
    .filter(dept => !selectedJob || (selectedJob.departments || []).includes(dept._id))
    .map(dept => ({ value: dept._id, label: dept.name }));
  const programOptions = programs
    .filter(prog => !selectedJob || (selectedJob.programs || []).includes(prog._id))
    .map(prog => ({ value: prog._id, label: prog.name }));

  const exportToExcel = () => {
    if (selectedColumns.length === 0) {
      alert("Please select columns to export");
      return;
    }

    const selectedKeys = selectedColumns.map(col => col.value);
    const mapped = filteredApplicants.map((stu, idx) => {
      const row = { SNo: idx + 1 };
      if (selectedKeys.includes("name")) row.Name = stu.name;
      if (selectedKeys.includes("registered_number")) row["Registration Number"] = stu.registered_number;
      if (selectedKeys.includes("email")) row.Email = stu.email;
      if (selectedKeys.includes("phone")) row.Phone = stu.phone;
      if (selectedKeys.includes("dob")) row.DOB = formatDate(stu.dateOfBirth);
      if (selectedKeys.includes("age")) row.Age = calculateAge(stu.dateOfBirth);
      if (selectedKeys.includes("gender")) row.Gender = stu.gender;
      if (selectedKeys.includes("caste")) row.Caste = stu.caste;
      if (selectedKeys.includes("college")) row.College = collegeMap[stu.collegeId] || "N/A";
      if (selectedKeys.includes("department")) row.Department = departmentMap[stu.departmentId] || "N/A";
      if (selectedKeys.includes("program")) row.Program = programMap[stu.programId] || "N/A";
      if (selectedKeys.includes("graduation_year")) row["Graduation Year"] = stu.graduation_year;
      if (selectedKeys.includes("tenth_school")) row["10th School"] = stu.tenth?.institutionName;
      if (selectedKeys.includes("tenth_cgpa")) row["10th CGPA"] = stu.tenth?.percentageOrCGPA;
      if (selectedKeys.includes("twelfth_school")) row["12th School"] = stu.twelfth?.institutionName;
      if (selectedKeys.includes("twelfth_branch")) row["12th Branch"] = stu.twelfth?.stream;
      if (selectedKeys.includes("twelfth_cgpa")) row["12th CGPA"] = stu.twelfth?.percentageOrCGPA;
      if (selectedKeys.includes("ug_college")) row["UG College"] = stu.bachelors?.institutionName;
      if (selectedKeys.includes("ug_degree")) row["UG Degree"] = stu.bachelors?.degree;
      if (selectedKeys.includes("ug_cgpa")) row["UG CGPA"] = stu.bachelors?.percentageOrCGPA;
      if (selectedKeys.includes("ug_project_title")) row["UG Project Title"] = stu.academicProjects?.[0]?.description;
      if (selectedKeys.includes("ug_project_org")) row["UG Project Org"] = stu.academicProjects?.[0]?.level;
      if (selectedKeys.includes("masters_college")) row["Masters College"] = stu.masters?.institutionName;
      if (selectedKeys.includes("masters_specialization")) row["Masters Specialization"] = stu.masters?.degree;
      if (selectedKeys.includes("masters_cgpa")) row["Masters CGPA"] = stu.masters?.percentageOrCGPA;
      if (selectedKeys.includes("can_apply")) row["Can Apply"] = stu.canApply ? "Yes" : "No";
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(mapped);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");

    const today = new Date().toISOString().split("T")[0];
    const selectedJob = jobs.find(job => job._id === jobId);
    const filename = `${selectedJob?.title || "Job"}_${selectedJob?.company || "Company"}_${today}.xlsx`;

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), filename);
  };

  // 1️⃣ Get applicant IDs
  const applicantIds = applicants.map(app => String(app._id));

  // 2️⃣ Get not applied students for the selected job
const notAppliedStudents = studentList.filter(stu => {
  if (!selectedJob) return false;

  const notApplied = !applicantIds.includes(String(stu._id));

  let matchesHierarchy = false;

  if (selectedJob.colleges && selectedJob.colleges.length > 0) {
    matchesHierarchy = selectedJob.colleges.includes(stu.collegeId);
  } else if (selectedJob.departments && selectedJob.departments.length > 0) {
    matchesHierarchy = selectedJob.departments.includes(stu.departmentId);
  } else if (selectedJob.programs && selectedJob.programs.length > 0) {
    matchesHierarchy = selectedJob.programs.includes(stu.programId);
  }

  const matchesSearch = !searchTerm ||
    stu.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stu.registered_number?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCollege = selectedColleges.length === 0 || selectedColleges.some((college) => stu.collegeId === college.value);
  const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.some((dept) => stu.departmentId === dept.value);
  const matchesProgram = selectedPrograms.length === 0 || selectedPrograms.some((program) => stu.programId === program.value);

  return notApplied && matchesHierarchy && matchesSearch && matchesCollege && matchesDepartment && matchesProgram;
});

console.log("selected job:", selectedJob)
console.log("filteredApplicants who has applied for the jobs:", filteredApplicants)

  return (
    <div className="space-y-8">
      {/* Header Section */}
     {selectedJob && (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
    <div className="flex items-center mb-4">
      <Briefcase className="w-6 h-6 text-blue-600 mr-3" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h1>
        <p className="text-gray-600 text-sm">{selectedJob.company}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-800">
      <div className="flex items-center">
        <Building className="w-4 h-4 text-gray-500 mr-2" />
        <span><strong>Company:</strong> {selectedJob.company}</span>
      </div>
      <div className="flex items-center">
        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
        <span><strong>Location:</strong> {selectedJob.location || "N/A"}</span>
      </div>
      <div className="flex items-center">
        <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
        <span><strong>CTC:</strong> {selectedJob.ctc} LPA</span>
      </div>
      <div className="flex items-center">
        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
        <span><strong>Closing Date:</strong> {new Date(selectedJob.closingDate).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center">
        <GraduationCap className="w-4 h-4 text-gray-500 mr-2" />
        <span><strong>Eligible Passing Year:</strong> {selectedJob.passingYear || "All"}</span>
      </div>
      <div className="flex items-center">
        <Award className="w-4 h-4 text-gray-500 mr-2" />
        <span><strong>Min % Required:</strong> {selectedJob.minPercentage || "Not Specified"}%</span>
      </div>
      <div className="flex items-center col-span-full">
        <FileText className="w-4 h-4 text-gray-500 mr-2" />
        <span><strong>Job Type:</strong> {selectedJob.type}</span>
      </div>
      <div className="col-span-full">
        <p className="mt-2 text-gray-700"><strong>Description:</strong></p>
        <p className="text-gray-600">{selectedJob.description}</p>
      </div>
    </div>
  </div>
)}


      {/* Job Selection */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <Briefcase className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Select Job</h2>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose a job to view applications
          </label>
          <div className="relative">
            <select
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="" disabled>Select a job</option>
              {jobs.map((job, index) => (
                <option key={job._id} value={job._id}>
                  {index + 1}. {job.title} - {job.company} (Closes: {new Date(job.closingDate).toLocaleDateString()})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {jobId && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Filters & Export</h2>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or registration number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by College</label>
              <Select 
                isMulti 
                options={collegeOptions} 
                value={selectedColleges} 
                onChange={setSelectedColleges} 
                placeholder="Select colleges..." 
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department</label>
              <Select 
                isMulti 
                options={departmentOptions} 
                value={selectedDepartments} 
                onChange={setSelectedDepartments} 
                placeholder="Select departments..." 
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Program</label>
              <Select 
                isMulti 
                options={programOptions} 
                value={selectedPrograms} 
                onChange={setSelectedPrograms} 
                placeholder="Select programs..." 
                className="text-sm"
              />
            </div>
          </div>

          {/* Export Section */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Select Columns to Export
              </label>
              <Select
                isMulti
                options={allColumns}
                value={selectedColumns}
                onChange={setSelectedColumns}
                placeholder="Select columns..."
                className="text-sm"
              />
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export to Excel
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading applicants...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

     


      {/* Tab Switcher */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === "applied" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setActiveTab("applied")}
        >
          Applied ({filteredApplicants.length})
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === "notApplied" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setActiveTab("notApplied")}
        >
          Not Applied ({notAppliedStudents.length})
        </button>
      </div>

      {/* Applied Students Table */}
      {activeTab === "applied" && !loading && !error && filteredApplicants.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Applications ({filteredApplicants.length})
              </h3>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                {jobs.find(job => job._id === jobId)?.title} - {jobs.find(job => job._id === jobId)?.company}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplicants.map((student, idx) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.registered_number}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Mail className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="truncate max-w-[150px]">{student.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {student.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{formatDate(student.dateOfBirth)}</div>
                        <div className="text-gray-500">Age: {calculateAge(student.dateOfBirth)}</div>
                        <div className="text-gray-500">{student.gender}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{collegeMap[student.collegeId]}</div>
                        <div className="text-gray-500">{departmentMap[student.departmentId]}</div>
                        <div className="text-gray-500">{programMap[student.programId]}</div>
                        <div className="text-gray-500">
                         
  {student.graduation_year ? `Class of ${student.graduation_year}` : 'Graduation year not available'}

                          </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="mb-1">
                          <span className="font-medium">10th:</span> {student.tenth?.percentageOrCGPA}
                        </div>
                        <div className="mb-1">
                          <span className="font-medium">12th:</span> {student.twelfth?.percentageOrCGPA}
                        </div>
                        <div className="mb-1">
                          <span className="font-medium">UG:</span> {student.bachelors?.percentageOrCGPA}
                        </div>
                        {student.masters?.percentageOrCGPA && (
                          <div>
                            <span className="font-medium">Masters:</span> {student.masters?.percentageOrCGPA}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.canApply 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.canApply ? 'Eligible' : 'Ineligible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setViewStudent(student);
                          setShowModal(true);
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Not Applied Students Table */}
      {activeTab === "notApplied" && !loading && !error && notAppliedStudents.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Students Eligible But Not Applied ({notAppliedStudents.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notAppliedStudents.map((stu, idx) => (
                  <tr key={stu._id}>
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4">{stu.name}</td>
                    <td className="px-6 py-4">{stu.registered_number}</td>
                    <td className="px-6 py-4">{collegeMap[stu.collegeId]}</td>
                    <td className="px-6 py-4">{departmentMap[stu.departmentId]}</td>
                    <td className="px-6 py-4">{programMap[stu.programId]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results for Not Applied */}
      {!loading && !error && activeTab === "notApplied" && notAppliedStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students eligible but not applied</h3>
          <p className="text-gray-500">All students have applied for this job or no students are eligible.</p>
        </div>
      )}

      {/* Student Details Modal */}
      {showModal && viewStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{viewStudent.name}</h2>
                  <p className="text-blue-100">{viewStudent.registered_number}</p>
                </div>
                <button
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {viewStudent.name}</p>
                    <p><span className="font-medium">Registration:</span> {viewStudent.registered_number}</p>
                    <p><span className="font-medium">Email:</span> {viewStudent.email}</p>
                    <p><span className="font-medium">Phone:</span> {viewStudent.phone}</p>
                    <p><span className="font-medium">DOB:</span> {formatDate(viewStudent.dateOfBirth)}</p>
                    <p><span className="font-medium">Age:</span> {calculateAge(viewStudent.dateOfBirth)}</p>
                    <p><span className="font-medium">Gender:</span> {viewStudent.gender}</p>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                    Academic Information
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">College:</span> {collegeMap[viewStudent.collegeId]}</p>
                    <p><span className="font-medium">Department:</span> {departmentMap[viewStudent.departmentId]}</p>
                    <p><span className="font-medium">Program:</span> {programMap[viewStudent.programId]}</p>
                    <p><span className="font-medium">Graduation Year:</span> {viewStudent.graduation_year}</p>
                  </div>
                </div>

                {/* Education Details */}
                <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Education Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">10th Standard</h4>
                      <p className="text-sm">School: {viewStudent.tenth?.institutionName || 'N/A'}</p>
                      <p className="text-sm">CGPA: {viewStudent.tenth?.percentageOrCGPA || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">12th Standard</h4>
                      <p className="text-sm">School: {viewStudent.twelfth?.institutionName || 'N/A'}</p>
                      <p className="text-sm">Stream: {viewStudent.twelfth?.stream || 'N/A'}</p>
                      <p className="text-sm">CGPA: {viewStudent.twelfth?.percentageOrCGPA || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Undergraduate</h4>
                      <p className="text-sm">College: {viewStudent.bachelors?.institutionName || 'N/A'}</p>
                      <p className="text-sm">Degree: {viewStudent.bachelors?.degree || 'N/A'}</p>
                      <p className="text-sm">CGPA: {viewStudent.bachelors?.percentageOrCGPA || 'N/A'}</p>
                    </div>
                  </div>
                  {viewStudent.masters?.institutionName && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Masters</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <p className="text-sm">College: {viewStudent.masters.institutionName}</p>
                        <p className="text-sm">Degree: {viewStudent.masters.degree}</p>
                        <p className="text-sm">CGPA: {viewStudent.masters.percentageOrCGPA}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsAppliedForJob;