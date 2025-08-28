import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


/**
* Thunk to add selected applicants to a job
* payload = { baseUrl, universityName, jobId, registeredNumbers, token }
*
* NOTE: API + Redux are kept together as requested.
* Sends exactly:
* { jobId: "...", registeredNumbers: ["123..."] }
*/
export const addSelectedApplicants = createAsyncThunk(
"selectedApplicants/add",
async ({ BASE_URL, universityName, jobId, registeredNumbers, token }, { rejectWithValue }) => {
try {
const url = `${BASE_URL}/job/jobs/addSelectedApplicants?universityName=${encodeURIComponent(
universityName
)}`;
const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
const body = { jobId, registeredNumbers };
const { data } = await axios.post(url, body, { headers });
return data;
} catch (err) {
const msg = err?.response?.data?.message || err.message || "Request failed";
return rejectWithValue(msg);
}
}
);


const slice = createSlice({
name: "selectedApplicants",
initialState: { status: "idle", error: null, lastResult: null },
reducers: {
resetSelectedApplicantsState: (s) => {
s.status = "idle"; s.error = null; s.lastResult = null;
},
},
extraReducers: (b) => {
b.addCase(addSelectedApplicants.pending, (s) => { s.status = "loading"; s.error = null; });
b.addCase(addSelectedApplicants.fulfilled, (s, a) => { s.status = "succeeded"; s.lastResult = a.payload; });
b.addCase(addSelectedApplicants.rejected, (s, a) => { s.status = "failed"; s.error = a.payload || "Unknown error"; });
}
});


export const { resetSelectedApplicantsState } = slice.actions;
export const selectAddSelectedApplicantsStatus = (s) => s.selectedApplicants.status;
export const selectAddSelectedApplicantsError = (s) => s.selectedApplicants.error;
export const selectAddSelectedApplicantsResult = (s) => s.selectedApplicants.lastResult;
export default slice.reducer;
export const selectAddSelectedApplicantsReducer = slice.reducer;