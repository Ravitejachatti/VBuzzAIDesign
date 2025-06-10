import React, { useState, useEffect, useRef } from "react";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import ResumeTemplate1 from "../Template/ResumeTemplate1";
import ResumeTemplate2 from "../Template/ResumeTemplate2";
// import { ResumeTemplate7, ResumeTemplate8, ResumeTemplate3, ResumeTemplate4, ResumeTemplate5 } from "../Template/ResumeTemplate7"; 

// const studentData = {
//   "name": "John Doe",
//   "surname": "Doe",
//   "email": "johndoe@example.com",
//   "phone": "+91 9876543210",
//   "gender": "male",
//   "registered_number": "1234567890",
//   "enrollment_year": 2021,
//   "graduation_year": 2025,
//   "dateOfBirth": "2003-05-15",
//   "category": "General",
//   "nationality": "Indian",
//   "bloodGroup": "B+",
//   "caste": "General",
//   "optingforplacement": true,
//   "futurePlan": "private job",

//   "professionalSummary":
//     "Strategic and results-driven professional with [X] years of experience in [Industry/Function]. Expertise in [Key Skills] with a proven track record of driving business growth, operational excellence, and digital transformation. Adept at leading cross-functional teams, optimizing processes, and delivering impactful solutions in a fast-paced global environment."
//   ,

//   "disability": {
//     "hasDisability": false,
//     "type": "",
//     "severity": "",
//     "disabilityPercentage": 0,
//     "supportRequired": ""
//   },
//   "higherEducationPreference": {
//     "interestedInHigherEducation": true,
//     "preferredDegree": "Masters",
//     "preferredField": "Artificial Intelligence",
//     "targetUniversities": ["MIT", "Stanford University"],
//     "preferredCountries": ["USA", "Canada"]
//   },

//   "tenth": {
//     "institutionName": "ABC High School",
//     "board": "CBSE",
//     "yearOfCompletion": 2019,
//     "percentageOrCGPA": "95%",
//     "notableAchievements": "Topper in Science Olympiad"
//   },

//   "twelfth": {
//     "institutionName": "XYZ Senior Secondary School",
//     "board": "CBSE",
//     "yearOfCompletion": 2021,
//     "stream": "Science",
//     "percentageOrCGPA": "92%",
//     "notableAchievements": "1st Rank in District Level Maths Competition"
//   },

//   "bachelors": {
//     "institutionName": "ABC University",
//     "university": "XYZ University",
//     "degree": "B.Tech",
//     "specialization": "Computer Science",
//     "yearOfCompletion": 2025,
//     "percentageOrCGPA": "8.9 CGPA",
//     "registrationNumber": "12345678",
//     "notableAchievements": "Developed AI-powered chatbot"
//   },
//   "masters": {
//     "institutionName": "ABC University",
//     "university": "XYZ University",
//     "degree": "B.Tech",
//     "specialization": "Computer Science",
//     "yearOfCompletion": 2025,
//     "percentageOrCGPA": "8.9 CGPA",
//     "registrationNumber": "12345678",
//     "notableAchievements": "Developed AI-powered chatbot"
//   },

//   "certification": [
//     {
//       "institutionName": "Coursera",
//       "courseName": "Machine Learning",
//       "completionYear": 2023,
//       "percentageOrCGPA": "98%"
//     }
//   ],

//   "parentDetails": {
//     "name": "Mr. Richard Doe",
//     "contactNumber": "+91 9876543210",
//     "occupation": "Businessman",
//     "address": "123, Street, City, State, Country"
//   },

//   "contactInfo": {
//     "phone": "+91 9876543210",
//     "email": "johndoe@example.com",
//     "address": {
//       "street": "123 Street Name",
//       "city": "New Delhi",
//       "state": "Delhi",
//       "postalCode": "110001",
//       "country": "India"
//     }
//   },

//   "documentVerification": {
//     "aadharNumber": "1234-5678-9012",
//     "passportNumber": "A1234567"
//   },

//   "workExperience": [
//     {
//       "companyName": "Tech Solutions",
//       "position": "Software Engineer Intern",
//       "duration": "6 months",
//       "responsibilitiesAndAchievements": ["Developed a web-based attendance system using MERN stack.", "Developed a web-based attendance system using MERN stack."],
//       "skillsAcquired": ["React", "Express.js", "MongoDB"]
//     },
//     {
//       "companyName": "Innovate Labs",
//       "position": "Backend Developer",
//       "duration": "1 year",
//       "responsibilitiesAndAchievements": "Implemented microservices architecture for an e-commerce platform.",
//       "skillsAcquired": ["Node.js", "Docker", "Kubernetes"]
//     }
//   ],

//   "jobpreferences": {
//     "fullTime": "Yes",
//     "partTime": "No",
//     "internship": "Yes",
//     "jobType": "private",
//     "skillLevel": "skilled",
//     "sector": "IT",
//     "functionalArea": "Software Development",
//     "jobLocation": "Bangalore"
//   },

//   "skillsAndCompetencies": {
//     "technicalSkills": ["JavaScript", "Node.js", "MongoDB", "Python", "React", "Express.js", "Docker", "Kubernetes"],
//     "softSkills": ["Leadership", "Teamwork", "Communication", "Problem Solving", "Time Management"],
//     "languagesKnown": [
//       { "language": "English", "proficiency": "Fluent" },
//       { "language": "Hindi", "proficiency": "Intermediate" }
//     ]
//   },

//   "academicProjects": [
//     { 
//       "title": "AI Chatbot for Universities",
//       "level": "Major Project",
//       "description": "An AI-powered chatbot that helps students with university-related queries.",
//       "role": "Lead Developer",
//       "toolsOrTechnologiesUsed": ["Python", "Flask", "Machine Learning"],
//       "outcomesOrResults": "Successfully deployed chatbot for a university",
//       "publicationsOrResearchLinks": ["https://github.com/johndoe/chatbot"]
//     },
//     {
//       "title": "E-commerce Platform",
//       "level": "Minor Project",
//       "description": "Built a scalable e-commerce platform with payment integration.",
//       "role": "Full Stack Developer",
//       "toolsOrTechnologiesUsed": ["React", "Node.js", "Stripe API"],
//       "outcomesOrResults": "Launched an MVP used by 500+ users",
//       "publicationsOrResearchLinks": ["https://github.com/johndoe/ecommerce"]
//     }
//   ],

//   "extracurricularActivities": [
//     {
//       "activityName": "Coding Hackathon",
//       "role": "Participant",
//       "achievements": "Secured 2nd place in National Coding Challenge",
//       "organizationName": "CodeFest",
//       "impact": "Improved algorithmic skills"
//     }
//   ],

//   "references": [
//     {
//       "name": "Dr. Emily Watson",
//       "contactInformation": {
//         "email": "emilywatson@university.com",
//         "phone": "+91 9876543210"
//       },
//       "relationshipToStudent": "Professor",
//       "type": "Academic"
//     }
//   ],

//   "documents": {
//     "transcripts": ["transcript.pdf"],
//     "resumeOrCV": "resume.pdf",
//     "personalStatement": "personal_statement.pdf",
//     "coverLetter": "cover_letter.pdf",
//     "lettersOfRecommendation": ["lor1.pdf", "lor2.pdf"],
//     "testScores": [
//       { "testName": "GATE", "score": "98" }
//     ]
//   },

//   "socialMedia": {
//     "linkedIn": "https://linkedin.com/in/johndoe",
//     "github": "https://github.com/johndoe",
//     "portfolioWebsite": "https://johndoe.com"
//   },

//   "placements": [
//     {
//       "jobId": "650ffcd67abc123456",
//       "companyName": "Google",
//       "role": "Software Engineer",
//       "ctc": 1500000,
//       "status": "Hired",
//       "feedback": "Great interview performance",
//       "offerLetterLink": "google_offer.pdf",
//       "additionalDetails": "Joining in July 2025"
//     }
//   ],

//   "universityId": "650ffcd67abc123456",
//   "collegeId": "650ffcd67abc123456",
//   "departmentId": "650ffcd67abc123456",
//   "programId": "650ffcd67abc123456",

//   "referralCode": "XYZ123",
//   "credentials": {
//     "username": "johndoe",
//     "password": "hashed_password"
//   },
//   "canApply": true,
//   "createdAt": "2025-03-07T12:00:00Z"
// };

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [previewUrl, setPreviewUrl] = useState(null);
  const pdfRef = useRef(null);

  const student = localStorage.getItem("studentData");
  console.log("Student Data in localStorage:", student);

  const templates = {
    template1: <ResumeTemplate1 />,
    template2: <ResumeTemplate2 />,
    // template3: <ResumeTemplate3  />,
    // template4: <ResumeTemplate4  />,
    // template5: <ResumeTemplate5  />,
    // template7: <ResumeTemplate7  />,
    // template8: <ResumeTemplate8  />,
  };
  useEffect(() => {
    const generatePreview = async () => {
      const blob = await pdf(templates[selectedTemplate]).toBlob();
      setPreviewUrl(URL.createObjectURL(blob));
    };

    generatePreview();
  }, [selectedTemplate]);

  return (
    <div className="container mx-auto p-5 mb-10">
      <div className=" flex ">
      <h1 className="text-lg font-bold">Resume Builder: </h1>
      
      <label className="font-medium mx-2 "> Choose a Resume Template:</label>
      <select
        className="border rounded"
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
      >
        <option value="template1">Template 1</option>
        <option value="template2">Template 2</option>
         {/*<option value="template3">Template 3</option>
        <option value="template4">Template 4</option>
        <option value="template5">Template 5</option>
        <option value="template7">Template 7</option>
        <option value="template8">Template 8</option> */}
      </select>

       {/* ✅ Full-Page Preview */}
       {/* {previewUrl && (
        <div className="border p-5 mt-3">
          <iframe src={previewUrl} className="w-full h-screen"></iframe>
        </div>
      )} */}

    </div>
      {/* ✅ Live Preview of Resume */}
      <div className="border p-5 mt-3">
        <PDFViewer style={{ width: "100%", height: "1000px", marginBottom: "20px", paddingBottom: "100px", border: "1px solid #ccc" }}>
          {templates[selectedTemplate]}
        </PDFViewer >
      </div>

      {/* ✅ Download Button */}
      <div className="mt-5">
        <PDFDownloadLink
          document={templates[selectedTemplate]}
          fileName="resume.pdf"
          className="bg-blue-500 text-white p-3 rounded"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download Resume")}
        </PDFDownloadLink>
      </div>
    </div>
  );
};



export default ResumeBuilder;