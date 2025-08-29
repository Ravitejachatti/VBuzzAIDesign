import CollegeInformation from "./collegeInfo";

const Index = (collegeId, token , universityName) => {
  const sampleData = {
    collegeName: "Springfield University",
    collegeCode: "SPU2024",
    deanName: "Dr. Sarah Johnson",
    establishedYear: "1985",
    email: "info@springfield.edu",
    phone: "+1 (555) 123-4567",
    website: "https://www.springfield.edu",
    address: "123 Academic Drive",
    city: "Springfield",
    state: "Illinois",
    zip: "62701",
    vision: "To be a leading institution of higher education that transforms lives through innovative teaching, groundbreaking research, and meaningful community engagement.",
    mission: "Our mission is to provide accessible, high-quality education that prepares students for successful careers and lifelong learning while contributing to the advancement of knowledge and society.",
    about: "Springfield University is a comprehensive public research university serving over 15,000 students from around the world. Founded in 1985, we offer over 150 undergraduate and graduate programs across multiple disciplines.",
    totalDepartments: 12,
    totalFaculty: 450,
    totalStudents: 15000,
    researchCenters: 8,
    facilities: ["Central Library", "Science Research Lab", "Student Recreation Center", "Conference Hall"],
    accreditations: ["Higher Learning Commission", "AACSB International", "ABET"],
    achievements: ["Top 100 Universities 2023", "Research Excellence Award", "Sustainability Champion"],
    partnerships: ["Tech Industries Consortium", "Local Community Foundation", "International Exchange Program"]
  };
  console.log("Index component initialized with collegeId, token, universityName:", collegeId, token, universityName);

  const handleSave = (data) => {
    console.log("Saving college data:", data);
    // Here you would typically save to your backend
  };

  return (
    <CollegeInformation 
      collegeId
      token 
      universityName
      // initialData={sampleData}
      // onSave={handleSave}
    
    />
  );
};

export default Index;
