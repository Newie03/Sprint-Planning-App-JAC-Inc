import React, { useState, useEffect } from "react";

const TaskForm = ({ onSubmit, editingTask, onCancel, sprints }) => {
  const [sprint, setSprint] = useState(
    editingTask ? editingTask.sprint : sprints[0].name
  );
  const [status, setStatus] = useState(
    editingTask ? editingTask.status : "Todo"
  );
  const [description, setDescription] = useState(
    editingTask ? editingTask.description : ""
  );
  const [teamMember, setTeamMember] = useState(
    editingTask ? editingTask.teamMember : ""
  );
  const [cost, setCost] = useState(editingTask ? editingTask.cost : 0);
  const [estimate, setEstimate] = useState(
    editingTask ? editingTask.estimate : 0
  );
  const [subTasks, setsubTasks] = useState( editingTask ? editingTask.subTasks : [{ value: '' }]);
  const [subTasksdetail, setsubTasksdetail] = useState("");

  const addsubTasks = () => {
    setsubTasks([...subTasks, { value: '' }]);
  };
  useEffect(() => {
    if (editingTask) {
      console.log(editingTask);
      setSprint(editingTask.sprint);
      setStatus(editingTask.status);
      setDescription(editingTask.description);
      setTeamMember(editingTask.teamMember);
      setCost(editingTask.cost);
      setEstimate(editingTask.estimate);
      setsubTasks(editingTask.subTasks);
    } else {
      setSprint(sprints[0].name);
      setStatus("Todo");
      setDescription("");
      setTeamMember("");
      setCost(0);
      setEstimate(0);
      setsubTasks([{ value: '' }]);
    }
  }, [editingTask, sprints]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      sprint,
      status,
      description,
      teamMember,
      cost,
      estimate,
      subTasks,
    });
    setSprint(sprints[0].name);
    setStatus("Todo");
    setDescription("");
    setTeamMember("");
    setCost(0);
    setEstimate(0);
    setsubTasks([{ value: '' }]);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="task-form__field">
        <label>Sprint:</label>
        <select value={sprint} onChange={(e) => setSprint(e.target.value)}>
          {sprints.map((sprint) => (
            <option key={sprint.name} value={sprint.name}>
              {sprint.name}
            </option>
          ))}
        </select>
      </div>
      <div className="task-form__field">
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {sprints
            .find((s) => s.name === sprint)
            .columns.map((column) => (
              <option key={`${sprint}-${column}`} value={column}>
                {column}
              </option>
            ))}
        </select>
      </div>
      <div className="task-form__field">
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="task-form__field">
        <label>Team Member:</label>
        <select value={teamMember} onChange={(e) => setTeamMember(e.target.value)}>
          {sprints
            .find((s) => s.name === sprint)
            .teamMember.map((teammember) => (
              <option key={`${teammember}`} value={teammember}>
                {teammember}
              </option>
            ))}
        </select>
      </div>
      <div className="task-form__field">
        <label>Relative Cost:</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(parseInt(e.target.value))}
        />
      </div>
      <div className="task-form__field">
        <label>Relative Estimate:</label>
        <input
          type="number"
          value={estimate}
          onChange={(e) => setEstimate(parseInt(e.target.value))}
        />
      </div>
      <div className="task-form__field">
        <label>Subtask:</label>
        {subTasks.map((subtask, index) => (
        <input
          key={index}
          value={subtask.value}
          onChange={(e) => {
            const newInputs = [...subTasks];
            newInputs[index].value = e.target.value;
            setsubTasks(newInputs);
          }}
        />
      ))}
        <button type="button" onClick={addsubTasks} >Add subtask</button>
      </div>
      <div className="task-form__actions">
        <button type="submit">
          {editingTask ? "Update Task" : "Create Task"}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
