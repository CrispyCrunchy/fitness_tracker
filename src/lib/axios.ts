import axios from "axios";

const api = {
  createCompletedWorkout: async (postData: { name: string, distance: number, timeGoal: number, dateOfWorkout: Date, compleationTime: number }) => {
    const { data } = await axios.post("/api/create-completed-workout", postData);
    return data;
  },
  createScheduledWorkout: async (postData: { name: string, distance: number, timeGoal: number, dateOfWorkout: Date}) => {
    const { data } = await axios.post("/api/create-scheduled-workout", postData);
    return data;
  },
  createOngoingWorkout: async (postData: { name: string, distance: number, timeGoal: number, dateOfWorkout: Date}) => {
    const { data } = await axios.post("/api/create-ongoing-workout", postData);
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await axios.get("/api/get-current-user");
    return data;
  },
  getUserCompletedWorkouts: async (userId: string) => {
    const { data } = await axios.get("/api/get-user-completed-workouts/" + userId);
    return data;
  },
  getUserScheduledWorkouts: async (userId: string) => {
    const { data } = await axios.get("/api/get-user-scheduled-workouts/" + userId);
    return data;
  },
  getUserOngoingWorkout: async (userId: string) => {
    const { data } = await axios.get("/api/get-user-ongoing-workout/" + userId);
    return data;
  },
  deleteCompletedWorkout: async (workoutId: string) => {
    const { data } = await axios.delete("/api/delete-completed-workout/" + workoutId);
    return data;
  },
  deleteScheduledWorkout: async (workoutId: string) => {
    const { data } = await axios.delete("/api/delete-scheduled-workout/" + workoutId);
    return data;
  },
  deleteOngoingWorkout: async (workoutId: string) => {
    const { data } = await axios.delete("/api/delete-ongoing-workout/" + workoutId);
    return data;
  },
  editScheduledWorkout: async (postData: {workoutId: string, name: string, distance: number, timeGoal: number, dateOfWorkout: Date}) => {
    const { data } = await axios.put("/api/edit-scheduled-workout/" + postData.workoutId, postData);
    return data;
  }
};

export default api;