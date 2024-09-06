
export default function ScheduledWorkout ({ workout }) {

  Number.prototype.padLeft = function(base: any,chr: any) {
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
  }
  
  var date = new Date(workout.dateOfWorkout),
      dateFormat =  [ date.getDate().padLeft(),
                    (date.getMonth()+1).padLeft(), 
                    date.getFullYear()].join('/');
                      
  return (
    <div className="flex flex-col bg-gray-900 rounded-lg m-2 p-4">
      <h2 className="font-bold text-xl text-orange-300">{workout.name}</h2>
      <p className="flex start-0">{dateFormat}</p>
      <div className="flex justify-between">
        <p>{workout.distance} meters,</p>
        <p>time goal of {(Math.floor(workout.timeGoal/6000)).padLeft()}:{(Math.floor((workout.timeGoal%6000)/100)).padLeft()}</p>
      </div>
    </div>
  );
}