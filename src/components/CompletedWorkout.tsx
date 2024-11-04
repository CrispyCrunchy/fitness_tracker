import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CompletedWorkout ({ workout }) {

  Number.prototype.padLeft = function(base: any,chr: any) {
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
  }
  
  const queryClient = useQueryClient();
  var date = new Date(workout.dateOfWorkout),
      dateFormat =  [ date.getDate().padLeft(),
                      (date.getMonth()+1).padLeft(), 
                      date.getFullYear()].join('/') + ' ' +
                    [ date.getHours().padLeft(),
                      date.getMinutes().padLeft(),
                      date.getSeconds().padLeft()].join(':');

  const deleteCompletedWorkout = useMutation({
    mutationFn: () => api.deleteCompletedWorkout(workout.id),
    onSuccess: () => {
      queryClient.invalidateQueries();
    }
  })
                      
  return (
    <div className="flex flex-col bg-gray-900 rounded-lg m-2 p-4 gap-2">
      <h2 className="font-bold text-xl text-orange-300">{workout.name}</h2>
      <div className="flex justify-between">
        <p>{workout.distance} meters,</p>
        <p>{dateFormat}</p>
      </div>
      <p>Time goal of {(Math.floor(workout.timeGoal/60000)).padLeft()}:{(Math.floor((workout.timeGoal%60000)/1000)).padLeft()}</p>
      <div className="flex justify-between">
        <p>Finish time of {(Math.floor(workout.compleationTime/60000)).padLeft()}:{(Math.floor((workout.compleationTime%60000)/1000)).padLeft()},{((workout.compleationTime%60000)%1000).padLeft()}</p>
        <button onClick={() => deleteCompletedWorkout.mutate()} className="bg-red-500 hover:bg-red-600 rounded-lg p-1">
          {deleteCompletedWorkout.isPending ? 
            <svg className="animate-spin m-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          :
            "Delete"
          }
        </button>
      </div>
    </div>
  );
}