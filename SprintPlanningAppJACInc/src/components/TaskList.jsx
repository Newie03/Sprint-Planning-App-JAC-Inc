import React from "react";

const TaskList = ({ title, tasks, onEdit, onRemove, onSub }) => (
  <div className="task-list">
    <h3>{title}</h3>
    <ul>
      {tasks.map((task) => (
        <li
          key={`${task.sprint}-${task.description}`}
          className="task-list__item"
        >
          <div className="task-list__item-status">Status: {task.status}</div>
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
          <div className="task-list__item-cost">Subtasks: {task.subTasks.length}</div>
          <div className="task-list__item-actions">
          <button onClick={() => onSub(task)}>Show Subtasks</button>
            <button onClick={() => onEdit(task)}>Edit</button>
            <button onClick={() => onRemove(task)}>Remove</button>
          </div>
        </li>
      ))}
    </ul>{" "}
  </div>
);
export default TaskList;
