import React from "react";

const TaskList = ({ title, tasks, onEdit, onRemove }) => (
  <div>
    <h2>{title}</h2>
    <ul>
      {tasks.map((task) => (
        <li key={task.description}>
          <div>Status: {task.status}</div>
          <div>Description: {task.description}</div>
          <div>Team Member: {task.teamMember}</div>
          <div>Relative Cost: {task.cost}</div>
          <div>Relative Estimate: {task.estimate}</div>
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onRemove(task)}>Remove</button>
        </li>
      ))}
    </ul>
  </div>
);

export default TaskList;
