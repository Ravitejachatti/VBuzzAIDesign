// src/Redux/jobSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 1. Thunk: fetch all eligible jobs for this particular students
 */
export const fetchJobs = createAsyncThunk(
  "job/fetchJobs",
  async ({ universityName }, { rejectWithValue }) => {
    try {
<<<<<<< HEAD

      const token = localStorage.getItem("Student token");
      console.log("Fetching jobs for university:", universityName);
      console.log("Using token:", token);
=======
      const token = localStorage.getItem("Student token");
>>>>>>> vbuzzUpdatedFrontend/main
      const response = await axios.get(
        `${BASE_URL}/student/jobs/getEligibleJobs`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      // response.data is an array of job objects
<<<<<<< HEAD
      console.log("Fetched jobs:", response.data);
=======
>>>>>>> vbuzzUpdatedFrontend/main
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/**
<<<<<<< HEAD
=======
 * 2.Thunk : fetch applied jobs for a particular student
 * This is not used in the current code but can be useful for future features.
 */
export const fetchAppliedJobs = createAsyncThunk(
  "job/fetchAppliedJobs",
  async ({ universityName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Student token");
      const response = await axios.get(
        `${BASE_URL}/student/jobs/applied`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return response.data; // returns an array of applied job objects
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);


/**
 * 3. Thunk: fetch shortlisted Rounds for a particular jobId
 * This is not used in the current code but can be useful for future features.
 */

export const fetchShortlistedRounds = createAsyncThunk(
  "job/fetchShortlistedRounds",
  async ({ jobId, universityName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Student token");
      const response = await axios.get(
        `${BASE_URL}/student/jobs/getAllRounds`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return response.data; // returns an array of shortlisted rounds
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);


/**
 * 4. Thunk: fetch all selected jobs for a particular student
 * This is not used in the current code but can be useful for future features.
 */
export const fetchSelectedJobs = createAsyncThunk(
  "job/fetchSelectedJobs",
  async ({ universityName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Student token");
      const response = await axios.get(
        `${BASE_URL}/student/jobs/selected`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return response.data; // returns an array of selected job objects
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

/**
>>>>>>> vbuzzUpdatedFrontend/main
 * 2. Thunk: apply to a single jobId
 */
export const applyToJob = createAsyncThunk(
  "job/applyToJob",
  async ({ jobId, universityName }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Student token");
      const response = await axios.post(
        `${BASE_URL}/student/jobs/${jobId}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      // return { jobId, message } so we know which job succeeded
      return { jobId, message: response.data.message };
    } catch (err) {
      // If API returns custom error under .data.error
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;
      return rejectWithValue({ jobId, error: errorMsg });
    }
  }
);

<<<<<<< HEAD
const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],                // array of job objects
    loading: false,          // for fetchJobs
    error: null,             // for fetchJobs
    applyingJobIds: [],      // list of jobIds currently being applied
    applyError: null,        // any apply errors
    applySuccessMessage: null,
=======
/**
 * Slice
 */
const jobSlice = createSlice({
  name: "job",
  initialState: {
    eligibleJobs: [],
    appliedJobs: [],
    selectedJobs: [],
    shortlistedRounds: [],
    loading: false,
    error: null,

    applyingJobIds: [],
    applyError: null,
    applySuccessMessage: null
>>>>>>> vbuzzUpdatedFrontend/main
  },
  reducers: {
    clearApplyStatus(state) {
      state.applyError = null;
      state.applySuccessMessage = null;
<<<<<<< HEAD
    },
=======
    }
>>>>>>> vbuzzUpdatedFrontend/main
  },
  extraReducers: (builder) => {
    builder
      // fetchJobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
<<<<<<< HEAD
        // Sort by closingDate descending
        state.jobs = action.payload.sort(
          (a, b) => new Date(b.closingDate) - new Date(a.closingDate)
        );
=======
        state.eligibleJobs = action.payload.sort((a, b) => new Date(b.closingDate) - new Date(a.closingDate));
>>>>>>> vbuzzUpdatedFrontend/main
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

<<<<<<< HEAD
=======
      // fetchAppliedJobs
      .addCase(fetchAppliedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload;
      })
      .addCase(fetchAppliedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchSelectedJobs
      .addCase(fetchSelectedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSelectedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJobs = action.payload;
      })
      .addCase(fetchSelectedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchShortlistedRounds
      .addCase(fetchShortlistedRounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShortlistedRounds.fulfilled, (state, action) => {
        state.loading = false;
        state.shortlistedRounds = action.payload;
      })
      .addCase(fetchShortlistedRounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

>>>>>>> vbuzzUpdatedFrontend/main
      // applyToJob
      .addCase(applyToJob.pending, (state, action) => {
        state.applyingJobIds.push(action.meta.arg.jobId);
        state.applyError = null;
        state.applySuccessMessage = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        const { jobId, message } = action.payload;
<<<<<<< HEAD
        state.applyingJobIds = state.applyingJobIds.filter(
          (id) => id !== jobId
        );
=======
        state.applyingJobIds = state.applyingJobIds.filter((id) => id !== jobId);
>>>>>>> vbuzzUpdatedFrontend/main
        state.applySuccessMessage = message;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        const { jobId, error } = action.payload;
<<<<<<< HEAD
        state.applyingJobIds = state.applyingJobIds.filter(
          (id) => id !== jobId
        );
        state.applyError = error;
      });
  },
});

=======
        state.applyingJobIds = state.applyingJobIds.filter((id) => id !== jobId);
        state.applyError = error;
      });
  }
});


>>>>>>> vbuzzUpdatedFrontend/main
export const { clearApplyStatus } = jobSlice.actions;
export default jobSlice.reducer;
export const job=jobSlice.reducer

