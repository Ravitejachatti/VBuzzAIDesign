// src/.../JobManager.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, deleteJob, updateJob } from "../../../Redux/Jobslice";
import Multiselect from "multiselect-react-dropdown";
import LoadingSpinner from "../../../components/Resuable/LoadingSpinner";
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  X,
  Save,
  Clock,
  AlertCircle,
  UserPlus
} from "lucide-react";

const JobManager = () => {
  const { universityName } = useParams();
  const token = localStorage.getItem("University authToken");

  const colleges = useSelector((state) => state.colleges.colleges) || [];
  const departments = useSelector((state) => state.department.departments) || [];
  const programs = useSelector((state) => state.programs.programs) || [];

  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);


  // UI/Data state
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [modalJob, setModalJob] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewDepartments, setViewDepartments] = useState([]);
  const [viewColleges, setViewColleges] = useState([]); // NEW: colleges modal state
  const [viewPrograms, setViewPrograms] = useState([]);
  const [formData, setFormData] = useState({});

  // Filters UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState({
    year: false,
    type: false,
    college: false,
    department: false,
    program: false,
  });

  // Fetch jobs
  const fetchjobs = async () => {
    const result = await dispatch(fetchJobs({ token, universityName }));
    if (result.meta.requestStatus === "fulfilled") {
      setFilteredJobs(result.payload?.slice()?.sort(sortByExpiryThenPosted) || []);
    }
  };

  useEffect(() => {
    fetchjobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [universityName]);

  // Unique filter values
  const uniqueYears = jobs?.length ? [...new Set(jobs.map((j) => j.passingYear))] : [];
  const uniqueTypes = jobs?.length ? [...new Set(jobs.map((j) => j.type))] : [];

  // Helpers
  const sortByExpiryThenPosted = (a, b) => {
    const expA = new Date(a.closingDate);
    const expB = new Date(b.closingDate);
    if (expB > expA) return 1;
    if (expB < expA) return -1;
    const creA = new Date(a.createdAt);
    const creB = new Date(b.createdAt);
    if (creB > creA) return 1;
    if (creB < creA) return -1;
    return 0;
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "open":
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isJobExpired = (closingDate) => new Date(closingDate) < new Date();

  const getShortDepartmentNames = (deptIds = []) =>
    deptIds
      .slice(0, 2)
      .map((id) => departments.find((d) => d._id === id)?.name || "Unknown")
      .join(", ");

  const getCollegeNameById = (id) => colleges.find((c) => c._id === id)?.name || "Unknown College";
  const getProgramNameById = (id) => programs.find((p) => p._id === id)?.name || "Unknown Program";

  const displayCtc = (job) => {
    if (job?.ctcMin != null && job?.ctcMax != null) return `${job.ctcMin} – ${job.ctcMax} LPA`;
    if (job?.ctc != null) return `${job.ctc} LPA`;
    return "N/A";
  };

  // Filtering
  const handleFilterChange = () => {
    const filtered = (jobs || [])
      .filter((job) => {
        // search
        const matchesSearch =
          !searchTerm ||
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase());

        // year
        const yearMatch = selectedYears.length === 0 || selectedYears.includes(job.passingYear);

        // type
        const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(job.type);

        // college
        const collegeIdsSelected = colleges
          .filter((c) => selectedColleges.includes(c.name))
          .map((c) => c._id);
        const collegeMatch =
          selectedColleges.length === 0 ||
          (Array.isArray(job.colleges) &&
            job.colleges.some((id) => collegeIdsSelected.includes(id)));

        // department
        const deptIdsSelected = departments
          .filter((d) => selectedDepartments.includes(d.name))
          .map((d) => d._id);
        const deptMatch =
          selectedDepartments.length === 0 ||
          (Array.isArray(job.departments) &&
            job.departments.some((id) => deptIdsSelected.includes(id)));

        // program
        const programIdsSelected = programs
          .filter((p) => selectedPrograms.includes(p.name))
          .map((p) => p._id);
        const programMatch =
          selectedPrograms.length === 0 ||
          (Array.isArray(job.programs) &&
            job.programs.some((id) => programIdsSelected.includes(id)));

        return matchesSearch && yearMatch && typeMatch && collegeMatch && deptMatch && programMatch;
      })
      .sort(sortByExpiryThenPosted);

    setFilteredJobs(filtered);
  };

  useEffect(() => {
    handleFilterChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    selectedYears,
    selectedTypes,
    selectedColleges,
    selectedDepartments,
    selectedPrograms,
    jobs,
  ]);

  // Actions
  const handleEdit = async () => {
    try {
      const jobId = modalJob._id;
      await dispatch(updateJob({ token, formData, jobId, universityName }));
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating Job:", error);
    }
  };

  const handleDelete = async () => {
    if (!modalJob?._id) return;
    try {
      await dispatch(deleteJob({ token, jobId: modalJob._id, universityName }));
      setDeleteModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Filter dropdown mini component
  const FilterBlock = ({ label, options, selected, setSelected, keyName, Icon }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Icon className="w-4 h-4 inline mr-1" />
        {label}
      </label>
      <div
        onClick={() => setDropdownOpen((p) => ({ ...p, [keyName]: !p[keyName] }))}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer hover:border-gray-400 transition-colors"
      >
        {selected?.length ? `${selected?.length} selected` : `Select ${label}`}
      </div>
      {dropdownOpen[keyName] && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-h-40 overflow-y-auto mt-1">
          <label className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer border-b">
            <input
              type="checkbox"
              checked={selected?.length === options?.length}
              onChange={() => {
                if (selected?.length === options?.length) setSelected([]);
                else setSelected([...options]);
              }}
              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium">Select All</span>
          </label>
          {options?.map((op) => (
            <label key={op} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(op)}
                onChange={() => {
                  if (selected.includes(op)) setSelected(selected.filter((s) => s !== op));
                  else setSelected([...selected, op]);
                }}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{op}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  if (loading && jobs.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Job Management</h1>
            <p className="text-blue-100 text-lg">Manage and monitor all job postings</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{filteredJobs.length}</div>
            <div className="text-blue-200 text-sm">Total Jobs</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Dropdown filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <FilterBlock
            label="Passing Year"
            options={uniqueYears}
            selected={selectedYears}
            setSelected={setSelectedYears}
            keyName="year"
            Icon={Calendar}
          />
          <FilterBlock
            label="Job Type"
            options={uniqueTypes}
            selected={selectedTypes}
            setSelected={setSelectedTypes}
            keyName="type"
            Icon={Briefcase}
          />
          <FilterBlock
            label="College"
            options={colleges.map((c) => c.name)}
            selected={selectedColleges}
            setSelected={(val) => {
              setSelectedColleges(val);
              setSelectedDepartments([]);
              setSelectedPrograms([]);
            }}
            keyName="college"
            Icon={Building}
          />
          <FilterBlock
            label="Department"
            options={departments
              .filter((d) => {
                if (selectedColleges.length === 0) return true;
                const collegeIds = colleges
                  .filter((c) => selectedColleges.includes(c.name))
                  .map((c) => c._id);
                return collegeIds.includes(d.college);
              })
              .map((d) => d.name)}
            selected={selectedDepartments}
            setSelected={(val) => {
              setSelectedDepartments(val);
              setSelectedPrograms([]);
            }}
            keyName="department"
            Icon={Building}
          />
          <FilterBlock
            label="Program"
            options={programs
              .filter((p) => {
                // Sync Program with Department first
                if (selectedDepartments.length > 0) {
                  const deptIds = departments
                    .filter((d) => selectedDepartments.includes(d.name))
                    .map((d) => d._id);
                  return deptIds.includes(p.department);
                }
                // Else, sync with College via their Departments
                if (selectedColleges.length > 0) {
                  const collegeIds = colleges
                    .filter((c) => selectedColleges.includes(c.name))
                    .map((c) => c._id);
                  const allowedDeptIds = departments
                    .filter((d) => collegeIds.includes(d.college))
                    .map((d) => d._id);
                  return allowedDeptIds.includes(p.department);
                }
                // Else show all programs
                return true;
              })
              .map((p) => p.name)}
            selected={selectedPrograms}
            setSelected={setSelectedPrograms}
            keyName="program"
            Icon={Building}
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Card header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{job.location || "Not specified"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        job.status || "Open"
                      )}`}
                    >
                      {job.status || "Open"}
                    </span>
                    {isJobExpired(job.closingDate) && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full">
                        <Clock className="w-3 h-3 mr-1" />
                        Expired
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-medium">{displayCtc(job)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{job.type || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    <span>{job.closingDate ? new Date(job.closingDate).toLocaleDateString() : "—"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-orange-600" />
                    <span>{job.applications?.length || 0} applicants</span>
                  </div>
                </div>

                {/* Colleges preview */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Colleges:</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(job?.colleges) && job.colleges.length > 0 ? (
                      <>
                        {job.colleges.slice(0, 2).map((id) => {
                          const c = colleges.find((cc) => cc._id === id);
                          return c ? (
                            <span
                              key={id}
                              className="inline-flex px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full"
                            >
                              {c.name}
                            </span>
                          ) : null;
                        })}
                        {job.colleges.length > 2 && (
                          <button
                            onClick={() => setViewColleges(job.colleges)}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full underline"
                          >
                            +{job.colleges.length - 2} more
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </div>
                </div>

                {/* Departments preview */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Departments:</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(job?.departments) && job.departments.length > 0 ? (
                      <>
                        {job.departments.slice(0, 2).map((id) => {
                          const d = departments.find((dd) => dd._id === id);
                          return d ? (
                            <span
                              key={id}
                              className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                              {d.name}
                            </span>
                          ) : null;
                        })}
                        {job.departments.length > 2 && (
                          <button
                            onClick={() => setViewDepartments(job.departments)}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full underline"
                          >
                            +{job.departments.length - 2} more
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </div>
                </div>

                {/* Programs preview */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Programs:</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(job?.programs) && job.programs.length > 0 ? (
                      <>
                        {job.programs.slice(0, 2).map((id) => {
                          const p = programs.find((pp) => pp._id === id);
                          return p ? (
                            <span
                              key={id}
                              className="inline-flex px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full"
                            >
                              {p.name}
                            </span>
                          ) : null;
                        })}
                        {job.programs.length > 2 && (
                          <button
                            onClick={() => setViewPrograms(job.programs)}
                            className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full underline"
                          >
                            +{job.programs.length - 2} more
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card footer actions */}
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={() => {
                    setModalJob(job);
                    setViewModalOpen(true);
                  }}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">View</span>
                </button>

                <div className="flex space-x-2">
    {/* --- NEW THIRD BUTTON: Add Selected --- */}
    <button
      onClick={() => {
        setSelectedJobForApplicants(job);
        setAddApplicantsOpen(true);
      }}
      className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors"
      title="Add Selected Applicants"
    >
      <UserPlus className="w-4 h-4 mr-1" />
      <span className="text-sm">Add Selected</span>
    </button>

                  <button
                    onClick={() => {
                      setModalJob(job);
                      setFormData({ ...job });
                      setEditModalOpen(true);
                    }}
                    className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    <span className="text-sm">Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setModalJob(job);
                      setDeleteModalOpen(true);
                    }}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          </div>
        )}
      </div>

      {/* View Job Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <Dialog.Title className="text-2xl font-bold">{modalJob?.title}</Dialog.Title>
                  <p className="text-blue-100">{modalJob?.company}</p>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium">{displayCtc(modalJob || {})}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                  <span>{modalJob?.type || "N/A"}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                  <span>
                    {modalJob?.closingDate ? new Date(modalJob.closingDate).toLocaleString() : "—"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{modalJob?.location || "Not specified"}</span>
                </div>
              </div>

              {/* Programs (inside description modal) */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Eligible Programs</h3>
                <div className="flex flex-wrap gap-1">
                  {modalJob?.programs?.slice(0, 2).map((id) => {
                    const p = programs.find((pp) => pp._id === id);
                    return p ? (
                      <span
                        key={id}
                        className="inline-flex px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full"
                      >
                        {p.name}
                      </span>
                    ) : null;
                  })}
                  {modalJob?.programs?.length > 2 && (
                    <button
                      onClick={() => setViewPrograms(modalJob.programs)}
                      className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full underline"
                    >
                      View all programs (+{modalJob.programs.length - 2})
                    </button>
                  )}
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {modalJob?.description || "No description available"}
                  </p>
                </div>

                {modalJob?.role && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Role Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{modalJob.role}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* View Departments Modal */}
      <Dialog
        open={viewDepartments?.length > 2}
        onClose={() => setViewDepartments([])}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold">Departments</Dialog.Title>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <ul className="list-disc list-inside space-y-1 text-sm">
                {viewDepartments?.map((id, i) => {
                  const d = departments.find((x) => x._id === id);
                  return <li key={i}>{d ? d.name : "Unknown Department"}</li>;
                })}
              </ul>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setViewDepartments([])}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* View Colleges Modal */}
      <Dialog
        open={Array.isArray(viewColleges) && viewColleges.length > 2}
        onClose={() => setViewColleges([])}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold">Colleges</Dialog.Title>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {viewColleges?.map((id, idx) => {
                  const c = colleges.find((x) => x._id === id);
                  return <li key={idx}>{c ? c.name : "Unknown College"}</li>;
                })}
              </ol>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setViewColleges([])}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* View Programs Modal (indexed) */}
      <Dialog
        open={viewPrograms.length > 2}
        onClose={() => setViewPrograms([])}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold">Programs</Dialog.Title>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {viewPrograms.map((id, idx) => {
                  const p = programs.find((x) => x._id === id);
                  return <li key={idx}>{p ? p.name : "Unknown Program"}</li>;
                })}
              </ol>
              <div className="mt-4 text-right">
                <button
                  onClick={() => setViewPrograms([])}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-xl font-semibold">Edit Job</Dialog.Title>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit();
              }}
              className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <input
                    type="text"
                    value={formData.type || ""}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passing Year</label>
                  <input
                    type="text"
                    value={formData.passingYear || ""}
                    onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company || ""}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* CTC / Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTC (Min LPA)</label>
                  <input
                    type="number"
                    value={formData.ctcMin ?? ""}
                    onChange={(e) => setFormData({ ...formData, ctcMin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTC (Max LPA)</label>
                  <input
                    type="number"
                    value={formData.ctcMax ?? ""}
                    onChange={(e) => setFormData({ ...formData, ctcMax: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 10"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Colleges */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Colleges</label>
                  <Multiselect
                    options={colleges}
                    selectedValues={colleges.filter((c) => formData.colleges?.includes(c._id))}
                    onSelect={(list) => setFormData({ ...formData, colleges: list.map((i) => i._id) })}
                    onRemove={(list) => setFormData({ ...formData, colleges: list.map((i) => i._id) })}
                    displayValue="name"
                    showCheckbox
                    placeholder="Select Colleges"
                    className="rounded-lg"
                  />
                </div>

                {/* Departments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                  <Multiselect
                    options={departments}
                    selectedValues={departments.filter((d) => formData.departments?.includes(d._id))}
                    onSelect={(list) => setFormData({ ...formData, departments: list.map((i) => i._id) })}
                    onRemove={(list) => setFormData({ ...formData, departments: list.map((i) => i._id) })}
                    displayValue="name"
                    showCheckbox
                    placeholder="Select Departments"
                    className="rounded-lg"
                  />
                </div>

                {/* Programs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Programs</label>
                  <Multiselect
                    options={programs}
                    selectedValues={programs.filter((p) => formData.programs?.includes(p._id))}
                    onSelect={(list) => setFormData({ ...formData, programs: list.map((i) => i._id) })}
                    onRemove={(list) => setFormData({ ...formData, programs: list.map((i) => i._id) })}
                    displayValue="name"
                    showCheckbox
                    placeholder="Select Programs"
                    className="rounded-lg"
                  />
                </div>

                {/* Closing Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Closing Date</label>
                  <input
                    type="datetime-local"
                    value={
                      formData.closingDate
                        ? new Date(formData.closingDate).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, closingDate: new Date(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>

            <div className="text-center">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                Delete Job
              </Dialog.Title>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the job <strong>"{modalJob?.title}"</strong>? This action cannot be undone.
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Job
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>


    </div>
  );
};

export default JobManager;
