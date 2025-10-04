// src/Dashboards/Placement/Rounds/AddRound.jsx
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Target, Plus, Eye, Edit, Trash2, Calendar, X,
  Building, Users, FileText, Link as LinkIcon, Search, Filter, ChevronDown
} from "lucide-react";

import { fetchJobs, fetchApplicantsByJob } from "../../../Redux/Jobslice";
import {
  fetchRoundsByJob,
  addRound,
  updateRound,
  deleteRound,
} from "../../../Redux/Placement/roundsSlice";

// Modal components
import ApplicantsModal from "./AddRound/ApplicantModal";
import AddRoundModal from "./AddRound/AddRoundModal2";
import UpdateRoundModal from "./AddRound/UpdateRoundModal";

// NEW
import AddSelectedApplicantsModal from "./AddRound/AddSelectedApplicantsModal";

const AddRound = () => {
  const { universityName } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("University authToken");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL; // NEW

  // ✅ Select from store BEFORE any effects that use these
  const jobsState = useSelector((s) => s.jobs);
  const jobs = jobsState?.jobs ?? [];
  const jobsLoading = jobsState?.loading ?? false;

  // 👇 your rounds slice is mounted as "roundsData" in the store
  const roundsState = useSelector((s) => s.roundsData);
  const roundsList = roundsState?.roundsList ?? [];

  // departments is fine
  const departments = useSelector((s) => s.department?.departments) || [];

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  // Modals
  const [showRoundsModal, setShowRoundsModal] = useState(false);
  const [showAddRoundModal, setShowAddRoundModal] = useState(false);
  const [showUpdateRoundModal, setShowUpdateRoundModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);

  // NEW: modal for adding selected applicants
  const [addApplicantsOpen, setAddApplicantsOpen] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [studentsForAddSelected, setStudentsForAddSelected] = useState([]); // what we pass to modal

  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null);

  const today = new Date().toISOString().slice(0, 10);
  const [roundData, setRoundData] = useState({ name: "", date: today, description: "", pdfLink: "", examLink: "" });
  const [updateRoundData, setUpdateRoundData] = useState({ name: "", date: "", description: "", pdfLink: "", examLink: "" });
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantsError, setApplicantsError] = useState(null);

  const [showSelectApplicantsModal, setShowSelectApplicantsModal] = useState(false); // (kept, unused here)
  const [selectedApplicants, setSelectedApplicants] = useState([]); // (kept, unused here)

  // fetch jobs
  useEffect(() => {
    dispatch(fetchJobs({ token, universityName }));
  }, [dispatch, universityName, token]);

  // filter jobs
  useEffect(() => {
    const sorted = [...jobs].sort(
      (a, b) => new Date(b.closingDate) - new Date(a.closingDate)
    );
    const byDept = selectedDepartment
      ? sorted.filter((j) => j.departments.includes(selectedDepartment))
      : sorted;
    const bySearch = searchTerm
      ? byDept.filter((j) =>
          j.title?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : byDept;

    setFilteredJobs(bySearch);
  }, [jobs, selectedDepartment, searchTerm]);

  // excel upload (kept as is)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      setApplicants(
        rows.map((r) => ({
          registered_number: String(r.registered_number ?? r.reg_no ?? "").trim(),
          name: String(r.name ?? r.student_name ?? "").trim(),
          message: String(r.message ?? r.status ?? "").trim(),
          feedback: String(r.feedback ?? "").trim(),
        }))
      );
    };
    reader.readAsBinaryString(file);
  };

  // open add round and prefetch applicants for that job (existing flow)
  const openAddRoundForJob = async (job) => {
    setSelectedJobId(job._id);
    setSelectedJobTitle(job.title);
    setApplicants([]);
    setApplicantsError(null);
    setLoadingApplicants(true);

    try {
      const res = await dispatch(
        fetchApplicantsByJob({ token, universityName, jobId: job._id })
      ).unwrap();

      const raw = res?.applicants ?? res?.data?.applicants ?? res ?? [];
      const normalized = (Array.isArray(raw) ? raw : []).map((a, idx) => {
        const name =
          a?.name ||
          a?.studentName ||
          [a?.firstName, a?.lastName].filter(Boolean).join(" ") ||
          a?.student?.name ||
          [a?.student?.firstName, a?.student?.lastName].filter(Boolean).join(" ") ||
          "Unnamed";
        const registered_number =
          a?.registered_number ||
          a?.reg_no ||
          a?.registrationNumber ||
          a?.roll ||
          a?.student?.registered_number ||
          a?.student?.registrationNumber ||
          a?.student?.regNo ||
          "";
        return {
          id: a?._id || a?.id || registered_number || `row-${idx}`,
          name,
          registered_number,
        };
      });

      setApplicants(normalized.filter(a => a.registered_number && a.name));
    } catch (err) {
      setApplicantsError(err?.response?.data?.message || err?.message || "Failed to fetch applicants");
    } finally {
      setLoadingApplicants(false);
      setShowAddRoundModal(true);
    }
  };

  // NEW: open "Add Selected Applicants" button flow
  const openAddSelectedForJob = async (job) => {
    setSelectedJobForApplicants(job);
    setStudentsForAddSelected([]); // reset
    try {
      // Use same API (your constraint): fetch applicants for this job,
      // then allow selecting some of them again (or supplement manually).
      const res = await dispatch(
        fetchApplicantsByJob({ token, universityName, jobId: job._id })
      ).unwrap();

      const raw = res?.applicants ?? res?.data?.applicants ?? res ?? [];
      const normalized = (Array.isArray(raw) ? raw : []).map((a, idx) => {
        const name =
          a?.name ||
          a?.studentName ||
          [a?.firstName, a?.lastName].filter(Boolean).join(" ") ||
          a?.student?.name ||
          [a?.student?.firstName, a?.student?.lastName].filter(Boolean).join(" ") ||
          "Unnamed";
        const reg =
          a?.registered_number ||
          a?.reg_no ||
          a?.registrationNumber ||
          a?.roll ||
          a?.student?.registered_number ||
          a?.student?.registrationNumber ||
          a?.student?.regNo ||
          "";
        return { id: a?._id || a?.id || reg || `row-${idx}`, name, registered_number: reg };
      });

      setStudentsForAddSelected(
        normalized.filter((s) => s.registered_number && s.name)
      );
    } catch (e) {
      // If this call ever fails, modal still opens—user can add manual reg numbers.
      console.error("[AddSelected] fetchApplicantsByJob failed:", e);
    } finally {
      setAddApplicantsOpen(true);
    }
  };

  const getDepartmentName = (deptIds = []) => {
    const label =
      deptIds
        .slice(0, 2)
        .map((id) => departments.find((d) => d._id === id)?.name || "Unknown")
        .join(", ") || "-";
    return label + (deptIds.length > 2 ? ` +${deptIds.length - 2} more` : "");
  };

  const handleAddRound = async (selectedApplicantsList) => {
    if (!selectedJobId) {
      alert("Pick a job first.");
      return;
    }
    if (!roundData.name || !roundData.date || !roundData.description) {
      alert("Round name, date, and description are required.");
      return;
    }
    if (!Array.isArray(selectedApplicantsList) || selectedApplicantsList.length === 0) {
      alert("Please select at least one applicant.");
      return;
    }

    const payload = { ...roundData, date: roundData.date };

    try {
      await dispatch(
        addRound({
          token,
          universityName,
          jobId: selectedJobId,
          roundData: payload,
          applicants: selectedApplicantsList,
        })
      ).unwrap();
      alert("Round added successfully!");
      await dispatch(fetchRoundsByJob({ token, universityName, jobId: selectedJobId })).unwrap();
      setShowAddRoundModal(false);
      setRoundData({ name: "", date: "", description: "", pdfLink: "", examLink: "" });
      setApplicants([]);
    } catch (e) {
      const msg = e?.message || e?.error || e?.errors || "Failed to add round";
      console.error("[addRound] error:", e);
      alert(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  useEffect(() => {
    console.log("[Rounds] roundsList updated:", roundsList?.length ?? 0);
    console.debug("[Rounds] roundsList:", roundsList);
  }, [roundsList]);

  const handleUpdateRound = async () => {
    if (selectedRoundIndex == null) return alert("Select a round to update.");
    try {
      await dispatch(
        updateRound({
          token,
          universityName,
          jobId: selectedJobId,
          roundIndex: selectedRoundIndex,
          updateData: updateRoundData,
        })
      ).unwrap();
      alert("Round updated successfully!");
      dispatch(fetchRoundsByJob({ token, universityName, jobId: selectedJobId }));
      setShowUpdateRoundModal(false);
      setSelectedRoundIndex(null);
    } catch (err) {
      alert("Failed to update round: " + err);
    }
  };

  const handleDeleteRound = async (idx) => {
    if (!window.confirm("Delete this round?")) return;
    try {
      await dispatch(deleteRound({ token, universityName, jobId: selectedJobId, roundIndex: idx })).unwrap();
      alert("Round deleted successfully!");
      dispatch(fetchRoundsByJob({ token, universityName, jobId: selectedJobId }));
    } catch (err) {
      alert("Failed to delete round: " + err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Round Management</h1>
            <p className="text-purple-100 text-lg">Manage recruitment rounds for job postings</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{filteredJobs.length}</div>
            <div className="text-purple-200 text-sm">Active Jobs</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border p-6">
        <div className="flex items-center mb-6">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-1" /> Filter by Department
            </label>
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="">All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" /> Search Jobs
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or company"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      {jobsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading jobs...</span>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {index + 1}. {job.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="w-4 h-4 mr-2" />
                      <span className="font-medium">{job.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        new Date(job.closingDate) > new Date()
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {new Date(job.closingDate) > new Date() ? "Active" : "Expired"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium">Departments:</span>
                    <span className="ml-1">{getDepartmentName(job.departments)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium">Closing Date:</span>
                    <span className="ml-1">{new Date(job.closingDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedJobId(job._id);
                    setSelectedJobTitle(job.title);
                    dispatch(fetchRoundsByJob({ token, universityName, jobId: job._id }));
                    setShowRoundsModal(true);
                  }}
                  className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">View Rounds</span>
                </button>

                <div className="flex items-center gap-3">
                  {/* NEW: Add Selected */}
                  <button
                    onClick={() => openAddSelectedForJob(job)}
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                    title="Add selected applicants by registration number"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span className="text-sm">Add Selected</span>
                  </button>

                  <button
                    onClick={() => openAddRoundForJob(job)}
                    className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span className="text-sm">Add Round</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* ----- View Rounds Panel (kept inline) ----- */}
      {showRoundsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-600 to-purple-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-xl font-bold">Rounds for {selectedJobTitle}</h2>
                  <p className="text-purple-100 text-sm">{roundsList?.length || 0} rounds found</p>
                </div>
                <button onClick={() => setShowRoundsModal(false)} className="text-white hover:text-gray-200 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-6 py-4 flex-1">
              {roundsList && roundsList.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {roundsList.map((round, index) => (
                    <div key={round._id || index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Round {index + 1}: {round?.name || "No Name"}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            <span className="font-medium">Description:</span> {round?.description || "No Description"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {round?.examLink && (
                          <div className="flex items-center">
                            <LinkIcon className="w-4 h-4 mr-2 text-blue-600" />
                            <a href={round.examLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">
                              Exam Link
                            </a>
                          </div>
                        )}
                        {round?.pdfLink && (
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-green-600" />
                            <a href={round.pdfLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 text-sm underline">
                              View PDF
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setApplicants(round.applicants || []);
                            setShowApplicantsModal(true);
                          }}
                          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Applicants ({round.applicants?.length || 0})
                        </button>

                        <button
                          onClick={() => {
                            setSelectedRoundIndex(index);
                            setUpdateRoundData({
                              name: round?.name || "",
                              date: (round?.date || "").slice(0, 10),
                              description: round?.description || "",
                              pdfLink: round?.pdfLink || "",
                              examLink: round?.examLink || "",
                            });
                            setShowUpdateRoundModal(true);
                          }}
                          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteRound(index)}
                          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No rounds found</h3>
                  <p className="text-gray-500">No rounds have been created for this job yet.</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowRoundsModal(false)} className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----- Applicants Modal ----- */}
      <ApplicantsModal
        open={showApplicantsModal}
        onClose={() => setShowApplicantsModal(false)}
        applicants={applicants}
      />

      {/* ----- Add Round Modal ----- */}
      <AddRoundModal
        open={showAddRoundModal}
        onClose={() => setShowAddRoundModal(false)}
        selectedJobTitle={selectedJobTitle}
        roundData={roundData}
        setRoundData={setRoundData}
        handleFileUpload={handleFileUpload}
        applicants={applicants}
        loadingApplicants={loadingApplicants}
        applicantsError={applicantsError}
        handleAddRound={handleAddRound}
      />

      {/* ----- Update Round Modal ----- */}
      <UpdateRoundModal
        open={showUpdateRoundModal}
        onClose={() => setShowUpdateRoundModal(false)}
        updateRoundData={updateRoundData}
        setUpdateRoundData={setUpdateRoundData}
        handleUpdateRound={handleUpdateRound}
      />

      {/* ----- NEW: Add Selected Applicants Modal (mounted once) ----- */}
      <AddSelectedApplicantsModal
        open={addApplicantsOpen}
        onClose={() => setAddApplicantsOpen(false)}
        jobId={selectedJobForApplicants?._id}
        universityName={universityName}
        token={token}
        BASE_URL={BASE_URL}
        students={studentsForAddSelected}
      />
    </div>
  );
};

export default AddRound;
