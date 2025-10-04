<<<<<<< HEAD
=======
// src/Redux/Placement/roundsSlice.js
>>>>>>> vbuzzUpdatedFrontend/main
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
<<<<<<< HEAD

// 1️⃣ Fetch all rounds for a job
=======
const shapeError = (err) => err?.response?.data ?? { message: err?.message || "Request failed" };

// GET all rounds for a job
>>>>>>> vbuzzUpdatedFrontend/main
export const fetchRoundsByJob = createAsyncThunk(
  "rounds/fetchByJob",
  async ({ token, universityName, jobId }, thunkAPI) => {
    try {
<<<<<<< HEAD
      const res = await axios.get(
        `${BASE_URL}/job/jobs/${jobId}/getAllRounds?universityName=${universityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // API returns data[0].rounds
      return res.data.data[0]?.rounds || [];
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch rounds");
=======
      const { data } = await axios.get(`${BASE_URL}/job/jobs/${jobId}/getAllRounds`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { universityName },
      });
      // API returns { success, message, data: [ ...rounds ], meta: {...} }
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(shapeError(err));
>>>>>>> vbuzzUpdatedFrontend/main
    }
  }
);

<<<<<<< HEAD
// 2️⃣ Add a new round
=======
// POST add round
>>>>>>> vbuzzUpdatedFrontend/main
export const addRound = createAsyncThunk(
  "rounds/add",
  async ({ token, universityName, jobId, roundData, applicants }, thunkAPI) => {
    try {
<<<<<<< HEAD
      await axios.post(
        `${BASE_URL}/job/jobs/${jobId}/addRounds?universityName=${universityName}`,
        { roundData, applicants },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // return payload so we can refetch
      return { jobId };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to add round");
=======
      const { data } = await axios.post(
        `${BASE_URL}/job/jobs/${jobId}/addRounds`,
        { roundData, applicants },
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return data; // component can refetch after this
    } catch (err) {
      return thunkAPI.rejectWithValue(shapeError(err));
>>>>>>> vbuzzUpdatedFrontend/main
    }
  }
);

<<<<<<< HEAD
// 3️⃣ Update an existing round
=======
// PUT update round at index
>>>>>>> vbuzzUpdatedFrontend/main
export const updateRound = createAsyncThunk(
  "rounds/update",
  async ({ token, universityName, jobId, roundIndex, updateData }, thunkAPI) => {
    try {
<<<<<<< HEAD
      await axios.put(
        `${BASE_URL}/job/jobs/${jobId}/updateRounds/${roundIndex}?universityName=${universityName}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { jobId };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to update round");
=======
      const { data } = await axios.put(
        `${BASE_URL}/job/jobs/${jobId}/updateRounds/${roundIndex}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(shapeError(err));
>>>>>>> vbuzzUpdatedFrontend/main
    }
  }
);

<<<<<<< HEAD
// 4️⃣ Delete a round
=======
// DELETE round at index
>>>>>>> vbuzzUpdatedFrontend/main
export const deleteRound = createAsyncThunk(
  "rounds/delete",
  async ({ token, universityName, jobId, roundIndex }, thunkAPI) => {
    try {
<<<<<<< HEAD
      await axios.delete(
        `${BASE_URL}/job/jobs/${jobId}/deleteRounds/${roundIndex}?universityName=${universityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { jobId };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to delete round");
=======
      const { data } = await axios.delete(
        `${BASE_URL}/job/jobs/${jobId}/deleteRounds/${roundIndex}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { universityName },
        }
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(shapeError(err));
>>>>>>> vbuzzUpdatedFrontend/main
    }
  }
);

const roundsSlice = createSlice({
  name: "rounds",
  initialState: {
    roundsList: [],
    loading: false,
    error: null,
<<<<<<< HEAD
  },
  reducers: {},
  extraReducers: (b) => {
    b
      // FETCH
      .addCase(fetchRoundsByJob.pending, (s) => { s.loading = true; s.error = null })
      .addCase(fetchRoundsByJob.fulfilled, (s, { payload }) => {
        s.loading = false; s.roundsList = payload;
      })
      .addCase(fetchRoundsByJob.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      })

      // ADD → refetch
      .addCase(addRound.fulfilled, (s, { payload }) => {
        s.loading = false; 
      })
      .addCase(addRound.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      })

      // UPDATE → refetch
      .addCase(updateRound.fulfilled, (s) => { s.loading = false })
      .addCase(updateRound.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      })

      // DELETE → refetch
      .addCase(deleteRound.fulfilled, (s) => { s.loading = false })
      .addCase(deleteRound.rejected, (s, { payload }) => {
        s.loading = false; s.error = payload;
      });
  },
});

export default roundsSlice.reducer;
export const roundsReducer = roundsSlice.reducer;
=======
    lastResponse: null,
  },
  reducers: {
    clearRoundsError: (s) => { s.error = null; },
  },
  extraReducers: (b) => {
    b
      // FETCH
      .addCase(fetchRoundsByJob.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchRoundsByJob.fulfilled, (s, { payload }) => { s.loading = false; s.roundsList = payload; })
      .addCase(fetchRoundsByJob.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })

      // ADD
      .addCase(addRound.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(addRound.fulfilled, (s, { payload }) => { s.loading = false; s.lastResponse = payload; })
      .addCase(addRound.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })

      // UPDATE
      .addCase(updateRound.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(updateRound.fulfilled, (s, { payload }) => { s.loading = false; s.lastResponse = payload; })
      .addCase(updateRound.rejected, (s, { payload }) => { s.loading = false; s.error = payload; })

      // DELETE
      .addCase(deleteRound.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(deleteRound.fulfilled, (s, { payload }) => { s.loading = false; s.lastResponse = payload; })
      .addCase(deleteRound.rejected, (s, { payload }) => { s.loading = false; s.error = payload; });
  },
});

export const { clearRoundsError } = roundsSlice.actions;
export const roundsReducer = roundsSlice.reducer;
export default roundsSlice.reducer;
>>>>>>> vbuzzUpdatedFrontend/main
