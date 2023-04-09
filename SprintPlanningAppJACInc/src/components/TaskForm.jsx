import React, { useState, useEffect } from "react";

const TaskForm = ({
  onSubmit,
  editingTask,
  onCancel,
  sprints,
  teamMembers,
}) => {
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
  const [priority, setPriority] = useState(
    editingTask ? editingTask.estimate : 0
  );
  const [subTasks, setsubTasks] = useState(
    editingTask
      ? editingTask.subTasks
      : [{ value: "", actualHours: 0, estimatedTime: 0 }]
  );

  const [subTasksAssignee, setSubTasksAssignee] = useState(
    editingTask ? editingTask.subTasksAssignee : []
  );

  const assignSubtask = (index, assignee) => {
    const newAssignee = [...subTasksAssignee];
    newAssignee[index] = assignee;
    setSubTasksAssignee(newAssignee);
  };

  const addSubtask = () => {
    setsubTasks([...subTasks, { value: "" }]);
  };

  const updateSubtask = (index, value, actualHours, estimatedTime) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks[index] = { value, actualHours, estimatedTime };
    setsubTasks(updatedSubTasks);
  };

  const removeSubtask = (index) => {
    setsubTasks(subTasks.filter((_, i) => i !== index));
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
      setPriority(editingTask.priority);
      setsubTasks(editingTask.subTasks);
      setSubTasksAssignee(editingTask.subTasksAssignee);
    } else {
      setSprint(sprints[0].name);
      setStatus("Todo");
      setDescription("");
      setTeamMember("");
      setCost(0);
      setEstimate(0);
      setPriority(0);
      setsubTasks([{ value: "" }]);
      setSubTasksAssignee([]);
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
      priority,
      subTasks,
      subTasksAssignee,
    });
    setSprint(sprints[0].name);
    setStatus("Todo");
    setDescription("");
    setTeamMember("");
    setCost(0);
    setEstimate(0);
    setPriority(0);
    setsubTasks([{ value: "", actualHours: 0, estimatedTime: 0 }]);
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
        <select
          value={teamMember}
          onChange={(e) => setTeamMember(e.target.value)}
        >
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
        <label>Priority:</label>
        <input
          type="number"
          value={priority}
          onChange={(e) => setPriority(parseInt(e.target.value))}
        />
      </div>
      <div className="task-form__field">
        <label>Subtask:</label>
        {subTasks.map((subTask, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Subtask #${index + 1}`}
              value={subTask.value}
              onChange={(e) =>
                updateSubtask(
                  index,
                  e.target.value,
                  subTask.actualHours,
                  subTask.estimatedTime
                )
              }
            />
            <input
              type="number"
              placeholder="Actual Hours Worked"
              value={subTask.actualHours}
              onChange={(e) =>
                updateSubtask(
                  index,
                  subTask.value,
                  parseInt(e.target.value),
                  subTask.estimatedTime
                )
              }
            />
            <input
              type="number"
              placeholder="Estimated Time to Complete"
              value={subTask.estimatedTime}
              onChange={(e) =>
                updateSubtask(
                  index,
                  subTask.value,
                  subTask.actualHours,
                  parseInt(e.target.value)
                )
              }
            />
            <select
              value={subTasksAssignee[index] || ""}
              onChange={(e) => assignSubtask(index, e.target.value)}
            >
              <option value="" disabled>
                Assign to team member
              </option>
              {teamMembers.map((member, i) => (
                <option key={i} value={member}>
                  {member}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => removeSubtask(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addSubtask}>
        Add subtask
      </button>

      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default TaskForm;
