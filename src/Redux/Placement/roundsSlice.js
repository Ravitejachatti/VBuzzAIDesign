// src/Redux/Placement/roundsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const shapeError = (err) => err?.response?.data ?? { message: err?.message || "Request failed" };

// GET all rounds for a job
export const fetchRoundsByJob = createAsyncThunk(
  "rounds/fetchByJob",
  async ({ token, universityName, jobId }, thunkAPI) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/job/jobs/${jobId}/getAllRounds`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { universityName },
      });
      // API returns { success, message, data: [ ...rounds ], meta: {...} }
      return Array.isArray(data?.data) ? data.data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(shapeError(err));
    }
  }
);

// POST add round
export const addRound = createAsyncThunk(
  "rounds/add",
  async ({ token, universityName, jobId, roundData, applicants }, thunkAPI) => {
    try {
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
    }
  }
);

// PUT update round at index
export const updateRound = createAsyncThunk(
  "rounds/update",
  async ({ token, universityName, jobId, roundIndex, updateData }, thunkAPI) => {
    try {
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
    }
  }
);

// DELETE round at index
export const deleteRound = createAsyncThunk(
  "rounds/delete",
  async ({ token, universityName, jobId, roundIndex }, thunkAPI) => {
    try {
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
    }
  }
);

const roundsSlice = createSlice({
  name: "rounds",
  initialState: {
    roundsList: [],
    loading: false,
    error: null,
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
