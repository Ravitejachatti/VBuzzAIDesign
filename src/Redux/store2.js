import { configureStore } from "@reduxjs/toolkit";
import { colleges } from "./UniversitySlice";
import { department } from "./DepartmentSlice";
import { placements } from "./PlacementSlice";
import { programs } from "./programs";
import { jobs } from "./Jobslice";

import { noticeReducer } from "./StudentDashboard/noticeSlice";
import studentReducer from "./StudentDashboard/StudentSlice.js";
import jobReducer from "./StudentDashboard/jobSlice.js";
import { roundReducer } from "./StudentDashboard/roundSlice.js";

import { educationDetailsReducer } from "./StudentDashboard/Profile/educationDetailsSlice.js";
import { personalDetailsReducer } from "./StudentDashboard/Profile/personalDetaillsSlice.js";
import { academicProjectsReducer } from "./StudentDashboard/Profile/academicProjectsSlice";
import { skillsReducer } from "./StudentDashboard/Profile/skillsSlice";
import { workExperienceReducer } from "./StudentDashboard/Profile/workExperienceSlice";
import { contactInfoReducer } from "./StudentDashboard/Profile/contactInfoSlice";
import { parentDetailsReducer } from "./StudentDashboard/Profile/parentDetailsSlice";



const store=configureStore({
       
        reducer:{
            colleges:colleges,
            department:department,
            placements:placements,
            programs:programs,

            jobs:jobs,
            notice: noticeReducer,
            student:studentReducer,
            job:jobReducer,
            round:roundReducer,

            personalDetails:personalDetailsReducer,
            educationDetails: educationDetailsReducer,
            academicProjects: academicProjectsReducer,
            skills: skillsReducer,
            workExperience: workExperienceReducer,
            contactInfo: contactInfoReducer,
            parentDetails: parentDetailsReducer,






        }
})

export default store