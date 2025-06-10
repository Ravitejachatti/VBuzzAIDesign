import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import ToggleEligibility from "../Student/ToggleEligibility";
import { useMemo } from "react";
import { FaDownload, FaEye, FaFilter, FaSearch, FaChartBar, FaUsers, FaBriefcase, FaGraduationCap } from "react-icons/fa";

const PlacementReports = ({ colleges, departments, programs, students }) => {
  const { universityName } = useParams();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const currentYear = new Date().getFullYear();
  const [graduationYear, setGraduationYear] = useState(currentYear.toString());
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [viewStudent, setViewStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [placementStatusFilter, setPlacementStatusFilter] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCTC, setSelectedCTC] = useState("");

  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [availableCTCs, setAvailableCTCs] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  const token = localStorage.getItem("University authToken");

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
                ?.map((placement) => (placement.companyName || placement.company || "").toLowerCase())
                .filter((name) => name)
            )
          ].sort((a, b) => a.localeCompare(b));

          const uniqueCTCs = [
            ...new Set(
              allPlacements
                ?.map((placement) => placement.ctc)
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

  const downloadExcel = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaChartBar className="text-blue-600 text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Placement Reports</h1>
              <p className="text-gray-600">Comprehensive placement analytics for {universityName}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <FaFilter className="text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
              <input 
                type="number" 
                value={graduationYear} 
                onChange={(e) => setGraduationYear(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                min="2000"
                max={currentYear + 5}
              />
              {loading && (
                <div className="mt-1 text-xs text-blue-500">Loading data...</div>
              )}
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">CTC (in LPA)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaGraduationCap className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Placed Students</p>
                <p className="text-2xl font-bold text-green-600">{totalPlacedStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaBriefcase className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Placements</p>
                <p className="text-2xl font-bold text-purple-600">{totalPlacements}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              {selectedStudentIds.length > 0 && (
                <ToggleEligibility
                  selectedStudents={reports.filter((r) => selectedStudentIds.includes(r._id))}
                  onStatusUpdate={handleStatusUpdate}
                />
              )}
            </div>
            <button
              onClick={downloadExcel}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FaDownload className="mr-2" />
              Download Excel
            </button>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading placement data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg. Number</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placements</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Companies</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Can Apply</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="14" className="px-6 py-12 text-center text-gray-500">
                        <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                        <p>Try adjusting your filters or search criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredReports?.map((report, index) => (
                      <tr key={report._id} className="hover:bg-gray-50">
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.name}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{report.registered_number}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{report.email}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{report.phone}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{report.graduationYear}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{collegeMap[report.collegeId] || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{departmentMap[report.departmentId] || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{programMap[report.programId] || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getTotalPlacements(report)}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => {
                              setViewStudent(report);
                              setModalOpen(true);
                            }}
                          >
                            <FaEye className="mr-1" />
                            View
                          </button>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
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
                                      className="text-blue-500 underline hover:text-blue-700"
                                      onClick={() => setExpandedStudentId(report._id)}
                                    >
                                      View More
                                    </button>
                                  </>
                                )}
                              </>
                            );
                          })()}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.canApply ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[70vh] overflow-y-auto">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Student Placement Details</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setModalOpen(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{viewStudent.name}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Registered Number</p>
                    <p className="text-gray-900">{viewStudent.registered_number}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{viewStudent.email}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">{viewStudent.phone}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">College</p>
                    <p className="text-gray-900">{collegeMap[viewStudent.collegeId] || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Department</p>
                    <p className="text-gray-900">{departmentMap[viewStudent.departmentId] || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Program</p>
                    <p className="text-gray-900">{programMap[viewStudent.programId] || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Total Placements</p>
                    <p className="text-gray-900">{getTotalPlacements(viewStudent)}</p>
                  </div>
                </div>

                {/* Off-Campus Placements */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-3 text-gray-900">
                    Off-Campus Placements ({viewStudent.offCampusPlacements?.length || 0})
                  </h3>
                  {viewStudent.offCampusPlacements && viewStudent.offCampusPlacements.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">CTC</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Offer Letter</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {viewStudent.offCampusPlacements?.map((placement, idx) => (
                            <tr key={idx}>
                              <td className="px-3 py-2 text-sm text-gray-900">{placement?.companyName || "N/A"}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{placement?.role || "N/A"}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{placement?.type || "N/A"}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{placement?.ctc || "N/A"}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{placement?.offerLetter || "N/A"}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{placement?.feedback || "N/A"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No off-campus placements available</p>
                  )}
                </div>

                {/* On-Campus Placements */}
                <div>
                  <h3 className="text-md font-semibold mb-3 text-gray-900 border-t pt-4">
                    On-Campus Placements ({viewStudent.onCampusPlacements?.length || 0})
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mb-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium text-blue-700">Companies Visited</p>
                      <p className="text-blue-900">{viewStudent.totalJobCompanies?.length || 0}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="font-medium text-green-700">Total Jobs</p>
                      <p className="text-green-900">{viewStudent.totalJobs || 0}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="font-medium text-yellow-700">Applied</p>
                      <p className="text-yellow-900">{viewStudent.totalAppliedJobs || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="font-medium text-purple-700">Selected</p>
                      <p className="text-purple-900">{viewStudent.totalSelectedJobs || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium text-gray-700">Total Placements</p>
                      <p className="text-gray-900">{viewStudent.totalPlacements || 0}</p>
                    </div>
                  </div>

                  {viewStudent.onCampusPlacements && viewStudent.onCampusPlacements.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">CTC</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Applied At</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {viewStudent.onCampusPlacements?.map((placement, idx) => (
                            <tr key={idx}>
                              <td className="px-3 py-2 text-sm text-gray-900">{placement?.company || "N/A"}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{placement?.title || "N/A"}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{placement?.type || "N/A"}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">{placement?.ctc || "N/A"}</td>
                              <td className="px-3 py-2 text-sm text-gray-900">
                                {placement?.appliedAt ? new Date(placement.appliedAt).toLocaleDateString() : "N/A"}
                              </td>
                              <td className="px-3 py-2 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  placement?.status === 'Selected' ? 'bg-green-100 text-green-800' :
                                  placement?.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
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
                    <p className="text-gray-500 text-sm">No on-campus placements available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Companies & CTCs Modal */}
        {expandedStudentId && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white max-h-[60vh] overflow-y-auto">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">All Companies & CTCs</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setExpandedStudentId(null)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <ol className="list-decimal pl-5 space-y-1">
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
    </div>
  );
};

export default PlacementReports;