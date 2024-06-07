
export default function Workout ({ workout }) {

  return (
    <div className="flex flex-col bg-gray-900 rounded-lg m-2 p-4">
      <h2 className="font-bold text-xl text-orange-300">{workout.name}</h2>
      <p>{workout.dateOfWorkout}</p>
      <div className="flex justify-between">
        <p>{workout.distance} meters,</p>
        <p>time goal of {Math.floor(workout.timeGoal/6000)}:{Math.floor((workout.timeGoal%6000)/100)}</p>
      </div>
      <p>Finish time of {Math.floor(workout.compleationTime/6000)}:{Math.floor((workout.compleationTime%6000)/100)}:{(workout.compleationTime%6000)%100}</p>
    </div>
  );
}