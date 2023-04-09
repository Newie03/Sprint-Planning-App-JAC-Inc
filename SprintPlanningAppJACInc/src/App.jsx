import React, { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TeamMembers from "./components/TeamMember";
import "./App.css";

const App = () => {
  const [productName, setProductName] = useState("Sprint Planning App");
  const [teamName, setTeamName] = useState(" JAC Inc.");
  const [startDate, setStartDate] = useState("March 1 2023");
  const [storyPointHours, setStoryPointHours] = useState("3");
  const [estStoryPoint, setEstStoryPoint] = useState("3");
  const [estCost, setEstCost] = useState("$2560");
  const [projectDescription, setProjectDescription] = useState(
    "A simple sprint planning tool."
  );
  const [teamMembers, setTeamMembers] = useState([
    "Jeesung Shin",
    "Connor McPhail",
    "Aaron Newham",
  ]);
  const [sprints, setSprints] = useState([
    {
      name: "Backlog",
      columns: ["Todo", "InProgress", "UnderReview", "Done"],
      teamMember: teamMembers,
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
      teamMember: teamMembers,
      tasks: {
        Todo: [],
        InProgress: [],
        UnderReview: [],
        Done: [],
      },
    },
  ]);

  const [editingTask, setEditingTask] = useState(null);

  const addTeamMember = (newMember) => {
    setTeamMembers((prevMembers) => [...prevMembers, newMember]);
  };

  const removeTeamMember = (member) => {
    setTeamMembers((prevMembers) => prevMembers.filter((m) => m !== member));
  };

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
      teamMember: ["Jeesung", "Connor", "Aaron", ""],
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

  const showSubtask = (task) => {
    const summary = task.subTasks
      .map((sub) => {
        return `${sub.value}`;
      })
      .join("\n");
    alert(`List of subtask for ${task.description}:\n${summary}`);
  };

  const handleCompleteSprint = (currentSprintName) => {
    setSprints((prevSprints) => {
      const newSprints = [...prevSprints];
      const currentSprintIndex = newSprints.findIndex(
        (s) => s.name === currentSprintName
      );
      let nextSprintIndex = currentSprintIndex + 1;

      // Create a new sprint if there is no next sprint.
      if (nextSprintIndex >= newSprints.length) {
        handleCreateSprint();
        nextSprintIndex = newSprints.length; // Update nextSprintIndex after creating sprint.
      }

      const currentSprint = newSprints[currentSprintIndex];
      const nextSprint = newSprints[nextSprintIndex];

      // Move tasks that are not 'Done' to the next sprint.
      Object.entries(currentSprint.tasks).forEach(([status, taskList]) => {
        if (status !== "Done") {
          taskList.forEach((task) => {
            // Remove any subtasks with an estimateTime of 0.
            task.subTasks = task.subTasks.filter(
              (subTask) => subTask.estimatedTime !== 0
            );

            task.sprint = nextSprint.name;
          });
          nextSprint.tasks[status] = [...nextSprint.tasks[status], ...taskList];
        }
      });

      // Remove tasks that are not 'Done' from old sprint.
      newSprints[currentSprintIndex].tasks = {
        ...currentSprint.tasks,
        Todo: [],
        InProgress: [],
        UnderReview: [],
      };

      return newSprints;
    });
  };

  return (
    <div className="app">
      <div className="project-info">
        <h3>Project Information</h3>
        <input
          type="text"
          placeholder="Enter product name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="product-name-input"
        />
        <input
          type="text"
          placeholder="Enter team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="team-name-input"
        />
        <input
          type="text"
          placeholder="Enter project start date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="project-start-date-input"
        />
        <input
          type="text"
          placeholder="Enter the number of hours equivalent to 1 Story Point"
          value={storyPointHours}
          onChange={(e) => setStoryPointHours(e.target.value)}
          className="story-point-hours-input"
        />
        <input
          type="text"
          placeholder="Enter total estimated Story Points"
          value={estStoryPoint}
          onChange={(e) => setEstStoryPoint(e.target.value)}
          className="est-story-point-input"
        />
        <input
          type="text"
          placeholder="Enter total estimated cost"
          value={estCost}
          onChange={(e) => setEstCost(e.target.value)}
          className="est-cost-input"
        />
        <h3>Project Description:</h3>
        <textarea
          placeholder="Enter project description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="project-description-input"
        />
      </div>
      <h1>Task Tracker</h1>
      <TeamMembers
        teamMembers={teamMembers}
        onAdd={addTeamMember}
        onRemove={removeTeamMember}
      />
      <TaskForm
        onSubmit={handleTaskSubmit}
        editingTask={editingTask}
        onCancel={() => setEditingTask(null)}
        sprints={sprints}
        teamMembers={teamMembers}
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
                    onSub={showSubtask}
                  />
                ))}
              </div>
              <button
                onClick={() => handleDisplaySprintSummary(sprint.name)}
                className="display-summary"
              >
                Display Sprint Summary
              </button>
              {sprint.name !== "Backlog" && (
                <button
                  onClick={() => handleCompleteSprint(sprint.name)}
                  className="complete-sprint"
                >
                  Complete Sprint
                </button>
              )}
            </div>
          );
        })}
        <button onClick={handleCreateSprint}>Create Sprint</button>
      </div>
    </div>
  );
};
export default App;
