import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import ToggleEligibility from "../Student/ToggleEligibility";
import { useMemo } from "react";
import { 
  Users, 
  TrendingUp, 
  Building, 
  GraduationCap, 
  Download, 
  Filter, 
  Search,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Calendar,
  Award,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  User
} from "lucide-react";

const PlacementReports = ({ colleges, departments, programs, students }) => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const currentYear = new Date().getFullYear();
  const [graduationYear, setGraduationYear] = useState(currentYear.toString());
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // UI state
  const [viewStudent, setViewStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filters
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [placementStatusFilter, setPlacementStatusFilter] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCTC, setSelectedCTC] = useState("");

  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [availableCTCs, setAvailableCTCs] = useState([]);

  // Selection and eligibility
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  const token = localStorage.getItem("University authToken");

  // Create mapping objects for quick ID-to-name lookup
  const collegeMap = useMemo(() => colleges?.reduce((acc, college) => {
    acc[college._id] = college.name;
    return acc;
  }, {}), [colleges]);

  const departmentMap = useMemo(() => departments?.reduce((acc, department) => {
    acc[department._id] = department.name;
    return acc;
  }, {}), [departments]);

  const programMap = useMemo(() => programs?.reduce((acc, program) => {
    acc[program._id] = program.name;
    return acc;
  }, {}), [programs]);

  // Auto-fetch reports when graduationYear changes
  useEffect(() => {
    const fetchReports = async () => {
      if (!graduationYear) {
        setError("Please enter graduation year.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const apiUrl = `${BASE_URL}/placement/placement-reports`;
        const response = await axios.get(apiUrl, {
          params: {
            universityName: universityName,
            graduationYear: graduationYear,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.success) {
          setReports(response.data.data);

          const allPlacements = response.data.data.flatMap((report) => [
            ...(report.offCampusPlacements || []),
            ...(report.onCampusPlacements || []),
          ]);

          const uniqueCompanies = [
            ...new Set(
              allPlacements
                .map((placement) => (placement.companyName || placement.company || "").toLowerCase())
                .filter((name) => name),
            )
          ].sort((a, b) => a.localeCompare(b));

          const uniqueCTCs = [
            ...new Set(
              allPlacements
                .map((placement) => placement.ctc)
                .filter((ctc) => ctc != null)
            )
          ].sort((a, b) => b - a);

          setAvailableCompanies(uniqueCompanies);
          setAvailableCTCs(uniqueCTCs);
        } else {
          setError("No reports found.");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [graduationYear, BASE_URL, universityName, token]);

  // Filter reports based on selected criteria
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesGraduationYear = !graduationYear || report.graduationYear === parseInt(graduationYear);
      const matchesCollege = !selectedCollege || report.collegeId === selectedCollege;
      const matchesDepartment = !selectedDepartment || report.departmentId === selectedDepartment;
      const matchesProgram = !selectedProgram || report.programId === selectedProgram;

      const offCampus = report.offCampusPlacements || [];
      const onCampus = (report.onCampusPlacements || []).filter(
        (placement) => placement.status === "Selected"
      );

      const allPlacements = [...offCampus, ...onCampus];
      const hasPlacements = allPlacements.length > 0;
      const matchesPlacementStatus =
        placementStatusFilter === "all" ||
        (placementStatusFilter === "placed" && hasPlacements) ||
        (placementStatusFilter === "unplaced" && !hasPlacements);

      const matchesCompany =
        !selectedCompany ||
        allPlacements.some((p) =>
          (p.companyName || p.company || "").toLowerCase() === selectedCompany.toLowerCase()
        );

      const matchesCTC =
        !selectedCTC ||
        allPlacements.some((p) =>
          p.ctc != null && Number(p.ctc) === Number(selectedCTC)
        );

      return (
        matchesGraduationYear &&
        matchesCollege &&
        matchesDepartment &&
        matchesProgram &&
        matchesPlacementStatus &&
        matchesCompany &&
        matchesCTC
      );
    });
  }, [
    reports,
    graduationYear,
    selectedCollege,
    selectedDepartment,
    selectedProgram,
    placementStatusFilter,
    selectedCompany,
    selectedCTC,
  ]);

  // Calculate statistics
  const { totalStudents, totalPlacedStudents, totalPlacements } = useMemo(() => {
    const totalStudents = filteredReports.length;
    let totalPlacedStudents = 0;
    let totalPlacements = 0;

    const placedStudentIds = new Set();

    filteredReports.forEach((report) => {
      const offCampusCount = (report.offCampusPlacements || []).filter(
        (placement) => placement && (placement.companyName || placement.company)
      ).length;

      const onCampusCount = (report.onCampusPlacements || []).filter(
        (placement) => placement && placement.status === "Selected"
      ).length;

      const studentPlacements = offCampusCount + onCampusCount;

      if (studentPlacements > 0) {
        placedStudentIds.add(report._id);
        totalPlacements += studentPlacements;
      }
    });

    totalPlacedStudents = placedStudentIds.size;

    return { totalStudents, totalPlacedStudents, totalPlacements };
  }, [filteredReports]);

  // Helper functions
  const getCompaniesAndCTCs = (report) => {
    const offCampus = (report.offCampusPlacements || []).filter(
      (placement) => placement && (placement.companyName || placement.company)
    );
    const onCampus = (report.onCampusPlacements || []).filter(
      (placement) => placement && placement.status === "Selected"
    );

    const allPlacements = [...offCampus, ...onCampus];

    return allPlacements?.map((placement) => {
      const company = placement.companyName || placement.company || "N/A";
      const ctc = placement.ctc ? `${placement.ctc}` : "N/A";
      return `${company} (${ctc})`;
    });
  };

  const getTotalPlacements = (student) => {
    const offCampusCount = (student.offCampusPlacements || []).filter(
      (placement) => placement && (placement.companyName || placement.company)
    ).length;

    const onCampusSelected = (student.onCampusPlacements || []).filter(
      (placement) => placement && placement.status === "Selected"
    ).length;

    return offCampusCount + onCampusSelected;
  };

  const downloadExcel = () => {
    // Excel download logic here
    const data = filteredReports?.map((report) => {
      const allPlacements = [
        ...(report.offCampusPlacements || []),
        ...(report.onCampusPlacements || []),
      ];

      const placementDetails = allPlacements.length > 0
        ? allPlacements
          ?.map((placement) => {
            const company = placement.companyName || placement.company || "N/A";
            const status = placement.status || "N/A";
            return `${company} (${status})`;
          })
          .join(", ")
        : "No placements";

      return {
        Name: report.name,
        "Registered Number": report.registered_number,
        Email: report.email,
        Phone: report.phone,
        College: collegeMap[report.collegeId] || "N/A",
        Department: departmentMap[report.departmentId] || "N/A",
        Program: programMap[report.programId] || "N/A",
        "Total Placements": report.totalPlacements,
        "Placement Details": placementDetails,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Placement Reports");
    XLSX.writeFile(workbook, "placement_reports.xlsx");
  };

  const handleStatusUpdate = (updatedStudents) => {
    setReports((prevReports) =>
      prevReports?.map((report) => {
        const updated = updatedStudents.find((s) => s._id === report._id);
        return updated ? { ...report, canApply: updated.canApply } : report;
      })
    );
    setSelectedStudentIds([]);
  };

  const placementRate = totalStudents > 0 ? Math.round((totalPlacedStudents / totalStudents) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Placement Reports</h1>
            <p className="text-blue-100 text-lg">Comprehensive placement analytics and insights</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{placementRate}%</div>
            <div className="text-blue-200 text-sm">Placement Rate</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-xs text-blue-600 mt-1">↗ Eligible students</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Placed Students</p>
              <p className="text-3xl font-bold text-gray-900">{totalPlacedStudents}</p>
              <p className="text-xs text-green-600 mt-1">↗ Successfully placed</p>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl">
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Offers</p>
              <p className="text-3xl font-bold text-gray-900">{totalPlacements}</p>
              <p className="text-xs text-purple-600 mt-1">↗ Including multiple offers</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Graduation Year
            </label>
            <input 
              type="number" 
              value={graduationYear} 
              onChange={(e) => setGraduationYear(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              min="2000"
              max={currentYear + 5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-1" />
              College
            </label>
            <select 
              value={selectedCollege} 
              onChange={(e) => setSelectedCollege(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Colleges</option>
              {colleges?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select 
              value={selectedDepartment} 
              onChange={(e) => setSelectedDepartment(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments?.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="w-4 h-4 inline mr-1" />
              Program
            </label>
            <select 
              value={selectedProgram} 
              onChange={(e) => setSelectedProgram(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Programs</option>
              {programs?.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Company
            </label>
            <select 
              value={selectedCompany} 
              onChange={(e) => setSelectedCompany(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Companies</option>
              {availableCompanies?.map((company, idx) => <option key={idx} value={company}>{company}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CTC (LPA)</label>
            <select 
              value={selectedCTC} 
              onChange={(e) => setSelectedCTC(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All CTCs</option>
              {availableCTCs?.map((ctc, idx) => <option key={idx} value={ctc}>{ctc}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              value={placementStatusFilter} 
              onChange={(e) => setPlacementStatusFilter(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="placed">Placed</option>
              <option value="unplaced">Unplaced</option>
            </select>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={downloadExcel}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading placement data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Placement Data</h2>
              <span className="text-sm text-gray-600">{filteredReports.length} students</span>
            </div>
          </div>

          {selectedStudentIds.length > 0 && (
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
              <ToggleEligibility
                selectedStudents={reports.filter((r) => selectedStudentIds.includes(r._id))}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          )}

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placements</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Companies</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={
                        selectedStudentIds.length === filteredReports.length &&
                        filteredReports.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudentIds(filteredReports?.map((r) => r._id));
                        } else {
                          setSelectedStudentIds([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No placement data found</p>
                      <p className="text-sm">Try adjusting your filters or graduation year</p>
                    </td>
                  </tr>
                ) : (
                  filteredReports?.map((report, index) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{report.name}</div>
                            <div className="text-sm text-gray-500">{report.registered_number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Mail className="w-3 h-3 mr-1 text-gray-400" />
                            {report.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1 text-gray-400" />
                            {report.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">{collegeMap[report.collegeId] || "N/A"}</div>
                          <div className="text-gray-500">{departmentMap[report.departmentId] || "N/A"}</div>
                          <div className="text-gray-500">{programMap[report.programId] || "N/A"}</div>
                          <div className="text-gray-500">Class of {report.graduationYear}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-blue-600 mr-2">
                            {getTotalPlacements(report)}
                          </span>
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={() => {
                              setViewStudent(report);
                              setModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {(() => {
                            const companies = getCompaniesAndCTCs(report);
                            const displayCompanies = companies.slice(0, 2).join(", ");
                            const hasMore = companies.length > 2;

                            return (
                              <>
                                {displayCompanies}
                                {hasMore && (
                                  <>
                                    ,{" "}
                                    <button
                                      className="text-blue-600 hover:text-blue-800 underline transition-colors"
                                      onClick={() => setExpandedStudentId(report._id)}
                                    >
                                      +{companies.length - 2} more
                                    </button>
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {report.canApply ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">Eligible</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <XCircle className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">Ineligible</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(report._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds((prev) => [...prev, report._id]);
                            } else {
                              setSelectedStudentIds((prev) =>
                                prev.filter((id) => id !== report._id)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {modalOpen && viewStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{viewStudent.name}</h2>
                  <p className="text-blue-100">{viewStudent.registered_number}</p>
                </div>
                <button
                  className="text-white hover:text-gray-200 transition-colors"
                  onClick={() => setModalOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Student Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Personal</span>
                  </div>
                  <p className="font-semibold">{viewStudent.name}</p>
                  <p className="text-sm text-gray-600">{viewStudent.registered_number}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Mail className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Contact</span>
                  </div>
                  <p className="font-semibold">{viewStudent.email}</p>
                  <p className="text-sm text-gray-600">{viewStudent.phone}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Building className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Academic</span>
                  </div>
                  <p className="font-semibold">{collegeMap[viewStudent.collegeId] || "N/A"}</p>
                  <p className="text-sm text-gray-600">{departmentMap[viewStudent.departmentId] || "N/A"}</p>
                  <p className="text-sm text-gray-600">{programMap[viewStudent.programId] || "N/A"}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Award className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Placements</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{getTotalPlacements(viewStudent)}</p>
                  <p className="text-sm text-gray-600">Total Offers</p>
                </div>
              </div>

              {/* Off-Campus Placements */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                  Off-Campus Placements ({viewStudent.offCampusPlacements?.length || 0})
                </h3>
                {viewStudent.offCampusPlacements && viewStudent.offCampusPlacements.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTC</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offer Letter</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewStudent.offCampusPlacements?.map((placement, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{placement?.companyName || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.role || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.type || "N/A"}</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-600">{placement?.ctc || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.offerLetter || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.feedback || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No off-campus placements available</p>
                  </div>
                )}
              </div>

              {/* On-Campus Placements */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  On-Campus Placements ({viewStudent.onCampusPlacements?.length || 0})
                </h3>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium">Companies Visited</p>
                    <p className="text-2xl font-bold text-blue-700">{viewStudent.totalJobCompanies?.length || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Applications</p>
                    <p className="text-2xl font-bold text-green-700">{viewStudent.totalAppliedJobs || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-600 font-medium">Selected</p>
                    <p className="text-2xl font-bold text-purple-700">{viewStudent.totalSelectedJobs || 0}</p>
                  </div>
                </div>

                {viewStudent.onCampusPlacements && viewStudent.onCampusPlacements.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTC</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewStudent.onCampusPlacements?.map((placement, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{placement?.company || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.title || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{placement?.type || "N/A"}</td>
                            <td className="px-4 py-3 text-sm font-medium text-green-600">{placement?.ctc || "N/A"}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {placement?.appliedAt ? new Date(placement.appliedAt).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                placement?.status === "Selected" 
                                  ? "bg-green-100 text-green-800" 
                                  : placement?.status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {placement?.status || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No on-campus placements available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Companies Modal */}
      {expandedStudentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[60vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Companies & CTCs</h2>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setExpandedStudentId(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              <ol className="list-decimal pl-5 space-y-2">
                {getCompaniesAndCTCs(
                  filteredReports.find((r) => r._id === expandedStudentId)
                )?.map((entry, idx) => (
                  <li key={idx} className="text-sm text-gray-700">{entry}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementReports;