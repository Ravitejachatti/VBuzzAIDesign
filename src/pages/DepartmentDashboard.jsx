import { useState, useEffect } from 'react';
import DepartmentInfo from '../Dashboards/DepartmentDashboard/DepartmentInformation';
import { useParams, useLocation } from 'react-router-dom';
import ViewStudents from '../Dashboards/DepartmentDashboard/ViewStudents';
import PlacementReports from "../Dashboards/DepartmentDashboard/PlacementReports";
import DepartProgram from '../Dashboards/DepartmentDashboard/Programs/DepartProgram';
import DepartFaculty from '../Dashboards/DepartmentDashboard/Faculty/DepartFaculty';
import DepartNotice from '../Dashboards/DepartmentDashboard/Notice/DepartNotice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColleges } from '../Redux/UniversitySlice';
import { fetchDept } from '../Redux/DepartmentSlice';
import { fetchProgram } from '../Redux/programs';
import { fetchStudents } from '../Redux/Placement/StudentsSlice';
import LoadingSpinner from '../components/Resuable/LoadingSpinner';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function DepartmentDashboard() {
  const dispatch = useDispatch();
  const { universityName } = useParams();
  const location = useLocation();
  const { user, token } = location.state || {};
  const departmentName = user?.departmentName;
  const CollegeName = user?.collegeName;

  const [students, setStudents] = useState([]);
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [load, setLoad] = useState(false);
  const [activeComponent, setActiveComponent] = useState('ViewStudents');
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);

  // Fetch data
  const fetchCollegesData = async () => {
    if (!token) return setError("Authentication token is missing.");
    setLoad(true);
    try {
      const result = await dispatch(fetchColleges({ token, universityName, BASE_URL }));
      if (result.meta.requestStatus === "fulfilled") {
        setError(""); setSuccess("Colleges fetched successfully."); setColleges(result.payload);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch colleges."); console.log("Error fetching colleges:", err);
    }
    setLoad(false);
  };

  const fetchDepartments = async () => {
    if (!token) return setError("Authentication token is missing.");
    setLoad(true);
    try {
      const result = await dispatch(fetchDept({ token, universityName, BASE_URL }));
      if (result.meta.requestStatus === "fulfilled") {
        setError(""); setSuccess("Departments fetched successfully."); setDepartments(result.payload);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch departments."); console.log("Error fetching departments:", err);
    }
    setLoad(false);
  };

  const fetchPrograms = async () => {
    if (!token) return setError("Authentication token is missing.");
    setLoad(true);
    try {
      const result = await dispatch(fetchProgram({ token, universityName, BASE_URL }));
      if (result.meta.requestStatus === "fulfilled") {
        setError(""); setSuccess("Programs fetched successfully."); setPrograms(result.payload);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch programs."); console.log("Error fetching programs:", err);
    }
    setLoad(false);
  };

  const handleFetchStudents = async () => {
    if (!token) return setError("Authentication token is missing.");
    setLoad(true);
    try {
      const result = await dispatch(fetchStudents({ token, universityName, BASE_URL }));
      if (result.meta.requestStatus === "fulfilled") {
        setError(""); setSuccess("Students fetched successfully."); setStudents(result.payload);
      } else {
        setError("Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch students."); console.log("Error fetching students:", err);
    }
    setLoad(false);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsFetchingAll(true);
      await Promise.all([
        fetchCollegesData(),
        fetchDepartments(),
        fetchPrograms(),
        handleFetchStudents()
      ]);
      setIsFetchingAll(false);
    };
    fetchAll();
  }, [universityName]);

  // Component map
  const components = {
    ViewStudents: (
      <ViewStudents
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    PlacementReports: (
      <PlacementReports
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartProgram: (
      <DepartProgram
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartFaculty: (
      <DepartFaculty
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartNotice: (
      <DepartNotice
        departmentId={user?.departmentId}
        token={token}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    ),
    DepartmentInfo: (
      <DepartmentInfo
        departmentId={user?.departmentId}
        colleges={colleges}
        departments={departments}
        programs={programs}
      />
    )
  };

  const sidebarItems = [
    { id: 'ViewStudents', label: 'Students' },
    { id: 'PlacementReports', label: 'Placements' },
    { id: 'DepartProgram', label: 'Programs' },
    { id: 'DepartFaculty', label: 'Faculty' },
    { id: 'DepartNotice', label: 'Notices' },
    { id: 'DepartmentInfo', label: 'Information' }
  ];

  if (isFetchingAll) return <LoadingSpinner />;

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800 p-6">
            {departmentName} Department
          </h1>
          <nav className="space-y-2 px-6">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveComponent(item.id)}
                className={`w-full text-left py-2 px-4 rounded-md text-gray-700 hover:bg-gray-200 ${
                  activeComponent === item.id ? 'bg-gray-200' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Sidebar */}
        <div className="bg-white shadow-lg md:hidden w-full">
          <select
            onChange={(e) => setActiveComponent(e.target.value)}
            className="w-full p-3 bg-gray-100 text-gray-700"
          >
            {sidebarItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4">
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            Department Management Dashboard
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-full overflow-auto">
            {components[activeComponent]}
          </div>
        </div>
      </div>
    </>
  );
}

export default DepartmentDashboard;
