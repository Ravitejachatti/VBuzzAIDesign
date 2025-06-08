import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import axios from "axios"; 


//addJob
//fetchDepartments
//deleteJob
//updateJob
//fetchJobs


const BASE_URL = import.meta.env.VITE_API_BASE_URL
export const fetchJobs = createAsyncThunk('/fetchjob',async ({token,universityName})=>{

    try 
     { const resJobs = await axios.get(
        `${BASE_URL}/job/getAllJobs?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } 
      );

      return resJobs.data.data
    
    } 
      catch(e){
        console.log(e);
        return thunkAPI.rejectWithValue( "Failed ");
      } 

})




export const addjob= createAsyncThunk('/addjob',async ({token,formData,universityName})=>{
     try{
      const res =   await axios.post(
        `${BASE_URL}/job/addJob?universityName=${universityName}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.data
     }
     catch(e){
        console.log(e)
        return thunkAPI.rejectWithValue( "Failed ");
     }
})

export const deleteJob= createAsyncThunk('/deletejob',async ({token,jobId,universityName})=>{
               try {
     const res =  await axios.delete(
        `${BASE_URL}/job/deleteJob/${jobId}?universityName=${universityName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {'_id':jobId}
    } catch (error) {
      console.error("Error deleting job:", error);
    }
})

export const updateJob = createAsyncThunk('/updatejob',async ({token,formData,jobId,universityName})=>{

    try{
const res = await axios.put(
        `${BASE_URL}/job/updateJob/${jobId}?universityName=${universityName}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data.data

    }
    catch(err){
        console.log(err)
    }
})


const jobslice = createSlice({
    name:'job',
    initialState:{jobs:[],loading:true},
    reducer:{},
    extraReducers:(builder)=>{
        builder.addCase(addjob.fulfilled,(state,action)=>{
            if(action.payload){
                state.jobs.push(action.payload)   
            }
            state.loading=false
        })
        .addCase(addjob.rejected,(state,action)=>{
            state.loading=false
        })
        .addCase(addjob.pending,(state,action)=>{
            state.loading=true
        })
        .addCase(fetchJobs.fulfilled,(state,action)=>{
            console.log("00oo",action.payload)
              if(action.payload){
                   state.jobs=action.payload
              }

        })
        .addCase(fetchJobs.rejected,(state,action)=>{
              state.loading=false
        })
        .addCase(fetchJobs.pending,(state,action)=>{
              state.loading=true
        })
        .addCase(deleteJob.fulfilled,(state,action)=>{
            console.log("emmuou",action.payload)
            const id=action.payload._id 
               const updated= state.jobs.filter(job=>job._id!==id) 
               state.jobs=updated 
               state.loading=false
            
        })
        .addCase(updateJob.fulfilled,(state,action)=>{
            const newDept=action.payload
            for (let i = 0; i < state.jobs.length; i++) {
                          const oldDept = state.jobs[i];
                          if (oldDept._id === action.payload._id) {
                                  state.jobs[i] = newDept; 
                                    break; 
                                              }
                   }
                   state.loading=false
        })
    }
})


export const jobs= jobslice.reducer