// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { FaSignOutAlt } from "react-icons/fa";


// const Navbar = () => {
//   const { universityName } = useParams(); // Correctly destructure universityName from params
//   const {registeredNumber} = useParams()

//   console.log("UniversityName:", universityName);
//   console.log("registeredNumber",registeredNumber)

//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [user, setUser] = useState(null); // Holds user information
//   const [role, setRole] = useState(null); // Holds university role

//   // Toggle menu for mobile
//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const closeMenu = () => setIsMenuOpen(false);

//   // Fetch user data from localStorage on component mount
//   useEffect(() => {
//     const studentAuth = localStorage.getItem("studentAuth") === "true";
//     const universityAuth = localStorage.getItem("universityAuth") === "true";

//     if (studentAuth){
//       if(registeredNumber && !localStorage.getItem("universityName")){
//         localStorage.setItem("universityName", universityName);
//         localStorage.setItem("registeredNumber", registeredNumber);
//       }

//     }
    
//     // If universityAuth is true, persist universityName and placementName in localStorage
//     if (universityAuth) {
//       if (universityName && !localStorage.getItem("universityName")) {
//         localStorage.setItem("universityName", universityName); // Store university name if not already set
//       }

//       const storedUniversityName = localStorage.getItem("universityName");
//       const storedPlacementName = localStorage.getItem("placementName");

//       const user = JSON.parse(localStorage.getItem("user"));
//       setUser({
//         type: "university",
//         universityName: storedUniversityName,
//         placementName: storedPlacementName,
//         user,
//       });
//       setRole(user?.role);
//     } else if (studentAuth) {
//       const studentName = localStorage.getItem("studentName");
//       const registeredNumber = localStorage.getItem("registeredNumber");
//       const universityName = localStorage.getItem("universityName");
//       setUser({ type: "student", name: studentName, registeredNumber, universityName });
//     }
//   }, [universityName]);

//   console.log("User type for:", user?.type);

//   // Handle Logout
//   const handleLogout = () => {
//     if (user?.type === "student") {
//       localStorage.removeItem("studentAuth");
//       localStorage.removeItem("studentData");
//       localStorage.removeItem("studentName");
//       localStorage.removeItem("Student User");
//       localStorage.removeItem("Student token");
//       localStorage.removeItem("studentDataStudentName");
//       localStorage.removeItem("studentData_student");
//       localStorage.removeItem("registeredNumber");
//       localStorage.removeItem("universityName");
//       localStorage.removeItem("studentId");
//       localStorage.removeItem("departmentId");
//       localStorage.removeItem("department");
//     } else if (user?.type === "university") {
//       localStorage.removeItem("universityAuth");
//       localStorage.removeItem("University authToken");
//       localStorage.removeItem("universityName");
//       localStorage.removeItem("user");
//       localStorage.removeItem("placementName");
//     }

//     setUser(null); // Reset user state
//     setRole(null); // Reset role
//     toast.success("Logged out successfully!");
//     navigate("/"); // Redirect to the home page
//   };

//   // Navigate to Dashboard
//   const handleDashboardNavigation = () => {
//     if (user?.type === "student") {
//       const { universityName, registeredNumber } = user;
//       navigate(`/dashboard/${encodeURIComponent(universityName)}/student/${encodeURIComponent(registeredNumber)}`);
//     } else if (user?.type === "university") {
//       const placementName = user?.placementName; // Correctly access placementName

//       console.log("name in navbar:", placementName);

//       switch (role) {
//         case "UniversityAdmin":
//           navigate(`/dashboard/${user.universityName}`);
//           break;
//         case "PlacementAdmin":
//           navigate(`/dashboard/${encodeURIComponent(user.universityName)}/placement/${placementName}`);
//           break;
//         case "CollegeAdmin":
//           navigate(`/dashboard/${user.universityName}/colleges/${placementName}`);
//           break;
//         case "DepartmentAdmin":
//           navigate(`/dashboard/${user.universityName}/departments/${placementName}`);
//           break;
//         default:
//           toast.error("Invalid role. Please contact the administrator.");
//       }
//     }
//   };

//   return (
//     <nav className="bg-gray-900  sticky top-0 z-10">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Logo */}
//         <div className="">
//            {/* use image for the logo */}
//           <img src="/vcbil.png" alt="Logo" className="h-14 w-auto" />
//         </div>

//         {/* Hamburger Icon (Visible only on smaller screens) */}
//         <button
//           className="block md:hidden text-white focus:outline-none"
//           onClick={toggleMenu}
//           aria-label="Toggle navigation menu"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
//             />
//           </svg>
//         </button>

//         {/* Navigation Links (Visible on larger screens) */}
//         <ul className="hidden md:flex space-x-6 items-center">
//           <li>
//             <Link to="/" className="text-yellow-500 hover:text-gray-300">
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link to="/about" className="text-white hover:text-gray-300">
//               About Us
//             </Link>
//           </li>
//           <li>
//             <Link to="/services" className="text-white hover:text-gray-300">
//               Services
//             </Link>
//           </li>

//           {/* Dynamic User Display */}
//           {user ? (
//             <li className="flex items-center space-x-2">
//               {/* Navigate to Dashboard */}
//               <button
//                 className="text-white text-lg font-bold bg-yellow-500 p-2 rounded-full"
//                 onClick={handleDashboardNavigation}
//               >
//                 {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center text-white hover:text-gray-300"
//               >
//                 <FaSignOutAlt className="mr-2" />
//                 Logout
//               </button>
//             </li>
//           ) : (
//             <>
//               <li>
//                 <Link to="/student-login" className="text-white hover:text-gray-300">
//                   S. Login
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/university-login" className="text-white hover:text-gray-300">
//                   U. Login
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>

//       {/* Navigation Links (Slider for Mobile/Tablet) */}
//       <div
//         className={`${
//           isMenuOpen ? "translate-x-0" : "translate-x-full"
//         } fixed top-20 right-0 h-full w-full bg-blue-500 shadow-lg transition-transform duration-300 lg:hidden`}
//       >
//         <button
//           className="absolute top-4 right-4 text-white focus:outline-none"
//           onClick={closeMenu}
//           aria-label="Close navigation menu"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//         <ul className="flex flex-col space-y-6 p-6">
//           <li>
//             <Link to="/" className="text-yellow-500 hover:text-gray-300" onClick={closeMenu}>
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link to="/about" className="text-white hover:text-gray-300" onClick={closeMenu}>
//               About Us
//             </Link>
//           </li>
//           <li>
//             <Link to="/services" className="text-white hover:text-gray-300" onClick={closeMenu}>
//               Services
//             </Link>
//           </li>

//           {/* Dynamic User Display */}
//           {user ? (
//             <li>
//               <button
//                 onClick={handleDashboardNavigation}
//                 className="text-lg font-bold bg-yellow-500 p-2 rounded-full mr-2 text-white"
//               >
//                 {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="text-white hover:text-gray-300"
//               >
//                 Logout
//               </button>
//             </li>
//           ) : (
//             <>
//               <li>
//                 <Link to="/student-login" className="text-white hover:text-gray-300" onClick={closeMenu}>
//                   S. Login
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/university-login" className="text-white hover:text-gray-300" onClick={closeMenu}>
//                   U. Login
//                 </Link>
//               </li>
//             </>
//           )}
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../../assets/logo.png";
import { toast } from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { universityName } = useParams(); // Correctly destructure universityName from params
  const {registeredNumber} = useParams()

  console.log("UniversityName:", universityName);
  console.log("registeredNumber",registeredNumber)

  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Holds user information
  const [role, setRole] = useState(null); // Holds university role

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const studentAuth = localStorage.getItem("studentAuth") === "true";
    const universityAuth = localStorage.getItem("universityAuth") === "true";

    if (studentAuth){
      if(registeredNumber && !localStorage.getItem("universityName")){
        localStorage.setItem("universityName", universityName);
        localStorage.setItem("registeredNumber", registeredNumber);
      }

    }
    
    // If universityAuth is true, persist universityName and placementName in localStorage
    if (universityAuth) {
      if (universityName && !localStorage.getItem("universityName")) {
        localStorage.setItem("universityName", universityName); // Store university name if not already set
      }

      const storedUniversityName = localStorage.getItem("universityName");
      const storedPlacementName = localStorage.getItem("placementName");

      const user = JSON.parse(localStorage.getItem("user"));
      setUser({
        type: "university",
        universityName: storedUniversityName,
        placementName: storedPlacementName,
        user,
      });
      setRole(user?.role);
    } else if (studentAuth) {
      const studentName = localStorage.getItem("studentName");
      const registeredNumber = localStorage.getItem("registeredNumber");
      const universityName = localStorage.getItem("universityName");
      setUser({ type: "student", name: studentName, registeredNumber, universityName });
    }
  }, [universityName]);

  console.log("User type for:", user?.type);

  // Handle Logout
  const handleLogout = () => {
    if (user?.type === "student") {
      localStorage.removeItem("studentAuth");
      localStorage.removeItem("studentData");
      localStorage.removeItem("studentName");
      localStorage.removeItem("Student User");
      localStorage.removeItem("Student token");
      localStorage.removeItem("studentDataStudentName");
      localStorage.removeItem("studentData_student");
      localStorage.removeItem("registeredNumber");
      localStorage.removeItem("universityName");
      localStorage.removeItem("studentId");
      localStorage.removeItem("departmentId");
      localStorage.removeItem("department");
    } else if (user?.type === "university") {
      localStorage.removeItem("universityAuth");
      localStorage.removeItem("University authToken");
      localStorage.removeItem("universityName");
      localStorage.removeItem("user");
      localStorage.removeItem("placementName");
    }

    setUser(null); // Reset user state
    setRole(null); // Reset role
    toast.success("Logged out successfully!");
    navigate("/"); // Redirect to the home page
  };

  // Navigate to Dashboard
  const handleDashboardNavigation = () => {
    if (user?.type === "student") {
      const { universityName, registeredNumber } = user;
      navigate(`/dashboard/${encodeURIComponent(universityName)}/student/${encodeURIComponent(registeredNumber)}`);
    } else if (user?.type === "university") {
      const placementName = user?.placementName; // Correctly access placementName

      console.log("name in navbar:", placementName);

      switch (role) {
        case "UniversityAdmin":
          navigate(`/dashboard/${user.universityName}`);
          break;
        case "PlacementAdmin":
          navigate(`/dashboard/${encodeURIComponent(user.universityName)}/placement/${placementName}`);
          break;
        case "CollegeAdmin":
          navigate(`/dashboard/${user.universityName}/colleges/${placementName}`);
          break;
        case "DepartmentAdmin":
          navigate(`/dashboard/${user.universityName}/departments/${placementName}`);
          break;
        default:
          toast.error("Invalid role. Please contact the administrator.");
      }
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { 
      name: "Services", 
      path: "/services",
      submenu: [
        {name: "Overview", path: "/services"},
        { name: "Mock Interviews", path: "/services/mock-interviews" },
        { name: "Placement Guarantee Programs", path: "/services/placement-guarantee-programs" },
      ]
    },
    { 
      name: "Login", 
      path: "/login",
      submenu: [
        { name: "Student Login", path: "/student-login" },
        { name: "University Login", path: "/university-login" },
        { name: "Corporate Login", path: "/login/corporate" }
      ]
    },
    {
      name: "Explore Paths",
      submenu: [
        { name: "FInd Jobs", path: "/find-job" },
        { name: "Universities", path: "/page/universities" },
        { name: "Companies", path: "/page/companies" },
        { name: "Institute Onboarding", path: "/university-onboarding" },
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownEnter = (name) => {
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    setTimeout(() => {
      setActiveDropdown(null);
    }, 5000);
  };

  return (
    <header className={`fixed top-0 z-50 w-full font-poppins transition-all duration-300 ${scrolled ? "bg-white top-0 shadow-md" : ""}`}>
      <div
        className={`transition-all duration-300 mx-0 px-8 rounded-none sm:px-[50px] md:px-[150px] top-0 bg-white shadow-custom-nav flex items-center justify-between h-[80px]`}
      >
        <div className="flex items-center mr-4">
          <img src={logo} alt="Logo" className="h-[50px] w-auto" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center gap-4 items-center">
          {navLinks
            .filter((link) => !(user && link.name === "Login"))
            .map((link) => (
            <div 
              key={link.name} 
              className="relative"
              onMouseEnter={() => link.submenu && handleDropdownEnter(link.name)}
              onMouseLeave={handleDropdownLeave}
            >
              {link.submenu ? (
                <div className="flex items-center cursor-pointer">
                  <span className="text-xs font-semibold text-primary transition">
                    {link.name}
                  </span>
                  <ChevronDown size={16} className="text-primary" />
                </div>
              ) : (
                <Link
                  to={link.path}
                  className="text-xs font-semibold text-primary transition"
                >
                  {link.name}
                </Link>
              )}

              {link.submenu && activeDropdown === link.name && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  onMouseEnter={() => handleDropdownEnter(link.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  {link.submenu.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.path}
                      className="block px-4 py-2 text-xs text-primary hover:bg-primary/10 hover:text-primary z-50 transition-colors duration-200"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

          {user ? (
            <li className="flex items-center space-x-2">
              {/* Navigate to Dashboard */}
              <button
                className="text-white text-lg font-bold bg-yellow-500 p-2 rounded-full"
                onClick={handleDashboardNavigation}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-8 py-2 rounded-full text-sm transition hover:bg-red-700"
              >
                {/* <FaSignOutAlt className="mr-2" /> */}
                Logout
              </button>
            </li>
          ) : (
            <div className="hidden md:flex justify-end items-center ml-4">
              <Link
                to="/get-started"
                className="bg-primary text-white px-4 py-2 rounded-full text-sm transition hover:bg-red-700"
              >
                Get Started
              </Link>
            </div>
          )}
        

        {/* Mobile Toggle */}
        <div className="md:hidden ml-auto">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute mt-1 left-[50px] right-[50px] rounded-[10px] bg-white shadow-custom-nav px-4 py-4 space-y-3 font-poppins">
          {navLinks
            .filter((link) => !(user && link.name === "Login"))
            .map((link) => (
            <div key={link.name}>
              {link.submenu ? (
                <div>
                  <div 
                    className="flex items-center justify-between text-gray-700 font-medium transition cursor-pointer"
                    onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                  >
                    <span>{link.name}</span>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} 
                    />
                  </div>
                  {activeDropdown === link.name && (
                    <div className="pl-4 mt-2 space-y-2">
                      {link.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                          className="block text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 font-medium transition"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}

          {user ? (
            <li className="flex items-center space-x-2">
              {/* Navigate to Dashboard */}
              <button
                className="text-white text-lg font-bold bg-yellow-500 p-2 rounded-full"
                onClick={handleDashboardNavigation}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </button>
              <button
                onClick={handleLogout}
                className="bg-primary text-white px-8 py-2 rounded-full text-sm transition hover:bg-red-700"
              >
                {/* <FaSignOutAlt className="mr-2" /> */}
                Logout
              </button>
            </li>
          ) : (
            <div className="hidden md:flex justify-end items-center ml-4">
              <Link
                to="/get-started"
                className="bg-primary text-white px-4 py-2 rounded-full text-sm transition hover:bg-red-700"
              >
                Get Started
              </Link>
            </div>
          )}
          
        </div>
      )}
    </header>
  );
};

export default Header;