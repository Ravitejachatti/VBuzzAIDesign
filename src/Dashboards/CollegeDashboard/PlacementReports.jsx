import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { 
  TrendingUp, 
  Users, 
  Building, 
  Award, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  Calendar, 
  MapPin, 
  Briefcase,
  ChevronDown,
  X,
  BarChart3,
  PieChart,
  Target,
  Star
} from 'lucide-react';

function Reports({ colleges, departments, programs, CollegeName }) {
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
  const [searchTerm, setSearchTerm] = useState("");

  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [availableCTCs, setAvailableCTCs] = useState([]);
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  const token = localStorage.getItem("University authToken");

  const collegeMap = useMemo(() => colleges.reduce((acc, college) => {
    acc[college._id] = college.name;
    return acc;
  }, {}), [colleges]);

  const departmentMap = useMemo(() => departments.reduce((acc, department) => {
    acc[department._id] = department.name;
    return acc;
  }, {}), [departments]);

  const programMap = useMemo(() => programs.reduce((acc, program) => {
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
          params: { universityName: universityName, graduationYear: graduationYear },
          headers: { Authorization: `Bearer ${token}` },
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
                .filter((name) => name)
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

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           report.registered_number.toLowerCase().includes(searchTerm.toLowerCase());
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
        matchesSearch &&
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
    searchTerm,
    graduationYear,
    selectedCollege,
    selectedDepartment,
    selectedProgram,
    placementStatusFilter,
    selectedCompany,
    selectedCTC,
  ]);

  const { totalStudents, totalPlacedStudents, totalPlacements, placementRate } = useMemo(() => {
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
    const placementRate = totalStudents > 0 ? Math.round((totalPlacedStudents / totalStudents) * 100) : 0;

    return { totalStudents, totalPlacedStudents, totalPlacements, placementRate };
  }, [filteredReports]);

  const downloadExcel = () => {
    const data = filteredReports.map((report) => {
      const allPlacements = [
        ...(report.offCampusPlacements || []),
        ...(report.onCampusPlacements || []),
      ];

      const placementDetails = allPlacements.length > 0
        ? allPlacements
          .map((placement) => {
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
        "Total Placements": getTotalPlacements(report),
        "Placement Details": placementDetails,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Placement Reports");
    XLSX.writeFile(workbook, `placement_reports_${graduationYear}.xlsx`);
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

  const getCompaniesAndCTCs = (report) => {
    const offCampus = (report.offCampusPlacements || []).filter(
      (placement) => placement && (placement.companyName || placement.company)
    );
    const onCampus = (report.onCampusPlacements || []).filter(
      (placement) => placement && placement.status === "Selected"
    );

    const allPlacements = [...offCampus, ...onCampus];

    return allPlacements.map((placement) => {
      const company = placement.companyName || placement.company || "N/A";
      const ctc = placement.ctc ? `${placement.ctc} LPA` : "N/A";
      return `${company} (${ctc})`;
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <div className={`bg-gradient-to-r ${color} rounded-2xl p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {description && <p className="text-white/70 text-sm mt-1">{description}</p>}
        </div>
        <Icon className="w-8 h-8 text-white/60" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading placement reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Placement Reports</h2>
          <p className="text-gray-600 mt-2">Comprehensive placement analytics and student data</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={downloadExcel}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          icon={Users}
          color="from-blue-500 to-blue-600"
          description="In selected filters"
        />
        <StatCard
          title="Placed Students"
          value={totalPlacedStudents.toLocaleString()}
          icon={Award}
          color="from-green-500 to-green-600"
          description="Successfully placed"
        />
        <StatCard
          title="Total Placements"
          value={totalPlacements.toLocaleString()}
          icon={Briefcase}
          color="from-purple-500 to-purple-600"
          description="Including multiple offers"
        />
        <StatCard
          title="Placement Rate"
          value={`${placementRate}%`}
          icon={Target}
          color="from-orange-500 to-orange-600"
          description="Overall success rate"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              placeholder="Graduation Year"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="2000"
              max={currentYear + 5}
            />
          </div>

          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Colleges</option>
              {colleges.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Programs</option>
              {programs.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Companies</option>
              {availableCompanies.map((company, idx) => (
                <option key={idx} value={company}>{company}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <select
              value={selectedCTC}
              onChange={(e) => setSelectedCTC(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All CTCs</option>
              {availableCTCs.map((ctc, idx) => (
                <option key={idx} value={ctc}>{ctc} LPA</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <select
              value={placementStatusFilter}
              onChange={(e) => setPlacementStatusFilter(e.target.value)}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="placed">Placed</option>
              <option value="unplaced">Unplaced</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {filteredReports.length === 0 && !error ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Found</h3>
          <p className="text-gray-600">
            No placement reports match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Info</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placements</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Companies</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report, index) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-sm text-gray-500">{report.registered_number}</div>
                        <div className="text-sm text-gray-500">{report.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{collegeMap[report.collegeId] || "N/A"}</div>
                        <div className="text-gray-500">{departmentMap[report.departmentId] || "N/A"}</div>
                        <div className="text-gray-500">{programMap[report.programId] || "N/A"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getTotalPlacements(report) > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getTotalPlacements(report)} placements
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {(() => {
                          const companies = getCompaniesAndCTCs(report);
                          const displayCompanies = companies.slice(0, 2).join(", ");
                          const hasMore = companies.length > 2;

                          return (
                            <>
                              {displayCompanies || "No placements"}
                              {hasMore && (
                                <>
                                  {", "}
                                  <button
                                    className="text-blue-500 underline"
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setViewStudent(report);
                          setModalOpen(true);
                        }}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {modalOpen && viewStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Student Placement Details</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <span className="text-sm text-gray-500">Name:</span>
                <p className="font-medium">{viewStudent.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Registration:</span>
                <p className="font-medium">{viewStudent.registered_number}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <p className="font-medium">{viewStudent.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Phone:</span>
                <p className="font-medium">{viewStudent.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Off-Campus Placements */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Off-Campus Placements ({viewStudent.offCampusPlacements?.length || 0})
                </h3>
                {viewStudent.offCampusPlacements && viewStudent.offCampusPlacements.length > 0 ? (
                  <div className="space-y-4">
                    {viewStudent.offCampusPlacements.map((placement, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Company:</span>
                            <p className="font-medium">{placement?.companyName || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Role:</span>
                            <p className="font-medium">{placement?.role || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">CTC:</span>
                            <p className="font-medium">{placement?.ctc || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <p className="font-medium">{placement?.type || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No off-campus placements</p>
                )}
              </div>

              {/* On-Campus Placements */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  On-Campus Placements ({viewStudent.onCampusPlacements?.length || 0})
                </h3>
                {viewStudent.onCampusPlacements && viewStudent.onCampusPlacements.length > 0 ? (
                  <div className="space-y-4">
                    {viewStudent.onCampusPlacements.map((placement, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Company:</span>
                            <p className="font-medium">{placement?.company || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Role:</span>
                            <p className="font-medium">{placement?.title || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">CTC:</span>
                            <p className="font-medium">{placement?.ctc || "N/A"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              placement?.status === 'Selected' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {placement?.status || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No on-campus placements</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Companies Modal */}
      {expandedStudentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">All Companies & CTCs</h2>
              <button
                onClick={() => setExpandedStudentId(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ol className="list-decimal pl-5 space-y-1">
              {getCompaniesAndCTCs(
                filteredReports.find((r) => r._id === expandedStudentId)
              ).map((entry, idx) => (
                <li key={idx} className="text-sm">{entry}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;