import React, { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const App = () => {
  const [sprints, setSprints] = useState([
    {
      name: "Backlog",
      columns: ["Todo", "InProgress", "UnderReview", "Done"],
      tasks: {
        Todo: [],
        InProgress: [],
        UnderReview: [],
        Done: [],
      },
    },
    {
      name: "Sprint 1",
      columns: ["Todo", "InProgress", "UnderReview", "Done"],
      tasks: {
        Todo: [],
        InProgress: [],
        UnderReview: [],
        Done: [],
      },
    },
  ]);

  const [editingTask, setEditingTask] = useState(null);

  const handleTaskSubmit = (task) => {
    if (editingTask) {
      setSprints((prevSprints) => {
        const newSprints = [...prevSprints];
        const prevSprintIndex = newSprints.findIndex(
          (s) => s.name === editingTask.sprint
        );
        const prevTaskList =
          newSprints[prevSprintIndex].tasks[editingTask.status];
        const prevTaskIndex = prevTaskList.findIndex(
          (t) => t.description === editingTask.description
        );
        if (prevTaskIndex !== -1) {
          newSprints[prevSprintIndex].tasks[editingTask.status] =
            prevTaskList.filter(
              (t) => t.description !== editingTask.description
            );
          const updatedTask = { ...editingTask, ...task };
          const newSprintIndex = newSprints.findIndex(
            (s) => s.name === updatedTask.sprint
          );
          const newTaskList =
            newSprints[newSprintIndex].tasks[updatedTask.status];
          newSprints[newSprintIndex].tasks[updatedTask.status] = [
            ...newTaskList,
            updatedTask,
          ];
        }
        setEditingTask(null);
        return newSprints;
      });
    } else {
      setSprints((prevSprints) => {
        const newSprints = [...prevSprints];
        const sprintIndex = newSprints.findIndex((s) => s.name === task.sprint);
        newSprints[sprintIndex].tasks[task.status] = [
          ...newSprints[sprintIndex].tasks[task.status],
          task,
        ];
        return newSprints;
      });
    }
  };
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleRemove = (task) => {
    setSprints((prevSprints) => {
      const newSprints = [...prevSprints];
      const sprintIndex = newSprints.findIndex((s) => s.name === task.sprint);
      const taskList = newSprints[sprintIndex].tasks[task.status];
      const index = taskList.findIndex(
        (t) => t.description === task.description
      );
      if (index !== -1) {
        taskList.splice(index, 1);
      }
      return newSprints;
    });
  };

  const handleCreateSprint = () => {
    const newSprint = {
      name: `Sprint ${sprints.length}`,
      columns: ["Todo", "InProgress", "UnderReview", "Done"],
      tasks: {
        Todo: [],
        InProgress: [],
        UnderReview: [],
        Done: [],
      },
    };
    setSprints((prevSprints) => [...prevSprints, newSprint]);
  };

  const getSprintTotals = (sprint) => {
    let totalCost = 0;
    let totalEstimate = 0;

    Object.values(sprint.tasks).forEach((taskList) => {
      taskList.forEach((task) => {
        totalCost += task.cost;
        totalEstimate += task.estimate;
      });
    });

    return { totalCost, totalEstimate };
  };

  const handleDisplaySprintSummary = (sprintName) => {
    const sprint = sprints.find((s) => s.name === sprintName);
    const summary = sprint.columns
      .map((column) => {
        const tasks = sprint.tasks[column];
        const totalTimeSpent = tasks.reduce((acc, task) => acc + task.cost, 0);
        const totalEstimate = tasks.reduce(
          (acc, task) => acc + task.estimate,
          0
        );
        const taskCount = tasks.length;
        return `${column}: ${taskCount} tasks, ${totalTimeSpent} hours spent, ${totalEstimate} hours estimated`;
      })
      .join("\n");

    alert(`Sprint Summary for ${sprintName}:\n${summary}`);
  };

  return (
    <div className="app">
      <h1>Task Tracker</h1>
      <TaskForm
        onSubmit={handleTaskSubmit}
        editingTask={editingTask}
        onCancel={() => setEditingTask(null)}
        sprints={sprints}
      />
      <div className="sprint-list">
        {sprints.map((sprint) => {
          const { totalCost, totalEstimate } = getSprintTotals(sprint);
          return (
            <div key={sprint.name} className="sprint">
              <h2>{sprint.name}</h2>
              <div className="sprint-totals">
                <span>
                  {sprint.name} Relative Cost: {totalCost}
                </span>

                <span>
                  {sprint.name} Relative Estimate: {totalEstimate}
                </span>
              </div>
              <div className="task-lists">
                {sprint.columns.map((column) => (
                  <TaskList
                    key={`${sprint.name}-${column}`}
                    title={column}
                    tasks={sprint.tasks[column]}
                    onEdit={handleEdit}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
              <button
                onClick={() => handleDisplaySprintSummary(sprint.name)}
                className="display-summary"
              >
                Display Sprint Summary
              </button>
            </div>
          );
        })}
        <button onClick={handleCreateSprint}>Create Sprint</button>
      </div>
    </div>
  );
};
export default App;
