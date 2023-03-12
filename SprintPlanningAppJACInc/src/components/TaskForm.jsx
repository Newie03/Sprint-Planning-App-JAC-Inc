import React, { useState, useEffect } from "react";

const TaskForm = ({ onSubmit, editingTask, onCancel }) => {
  const [status, setStatus] = useState(
    editingTask ? editingTask.status : "Backlog"
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

  useEffect(() => {
    if (editingTask) {
      setStatus(editingTask.status);
      setDescription(editingTask.description);
      setTeamMember(editingTask.teamMember);
      setCost(editingTask.cost);
      setEstimate(editingTask.estimate);
    } else {
      setStatus("Backlog");
      setDescription("");
      setTeamMember("");
      setCost(0);
      setEstimate(0);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ status, description, teamMember, cost, estimate });
    setStatus("Backlog");
    setDescription("");
    setTeamMember("");
    setCost(0);
    setEstimate(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Backlog">Backlog</option>
          <option value="Todo">Todo</option>
          <option value="InProgress">InProgress</option>
          <option value="UnderReview">UnderReview</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Team Member:</label>
        <input
          type="text"
          value={teamMember}
          onChange={(e) => setTeamMember(e.target.value)}
        />
      </div>
      <div>
        <label>Relative Cost:</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Relative Estimate:</label>
        <input
          type="number"
          value={estimate}
          onChange={(e) => setEstimate(parseInt(e.target.value))}
        />
      </div>
      <button type="submit">
        {editingTask ? "Update Task" : "Create Task"}
      </button>
      {editingTask && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default TaskForm;
