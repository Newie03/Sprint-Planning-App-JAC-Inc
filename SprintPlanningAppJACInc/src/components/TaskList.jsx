import React from "react";

const TaskList = ({ title, tasks, onEdit, onRemove }) => (
  <div className="task-list">
    <h2>{title}</h2>
    <ul>
      {tasks.map((task) => (
        <li key={task.description} className="task-list__item">
          <div className="task-list__itemtask-list__item-status">
            Status: {task.status}
          </div>
          <div className="task-list__item-description">
            Description: {task.description}
          </div>
          <div className="task-list__item-team-member">
            Team Member: {task.teamMember}
          </div>
          <div className="task-list__item-cost">Relative Cost: {task.cost}</div>
          <div className="task-list__item-estimate">
            Relative Estimate: {task.estimate}
          </div>
          <div className="task-list__item-actions">
            <button onClick={() => onEdit(task)}>Edit</button>
            <button onClick={() => onRemove(task)}>Remove</button>
          </div>
        </li>
      ))}
    </ul>{" "}
  </div>
);
export default TaskList;
