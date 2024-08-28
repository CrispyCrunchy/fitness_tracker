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
  }
};

export default api;