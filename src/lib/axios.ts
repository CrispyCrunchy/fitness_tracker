import axios from "axios";

const api = {
  createWorkout: async (postData: { name: string, distance: number, timeGoal: number, dateOfWorkout: Date, compleationTime: number }) => {
    const { data } = await axios.post("/api/create-workout", postData);
    console.log(data);
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await axios.get("/api/get-current-user");
    return data;
  }
};

export default api;