import React, { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TeamMembers from "./components/TeamMember";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
    " ",
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
      teamMember: ["Jeesung", "Connor", "Aaron"],
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
        nextSprintIndex = newSprints.length;
      }

      const currentSprint = newSprints[currentSprintIndex];
      const nextSprint = newSprints[nextSprintIndex];

      // Move tasks that are not 'Done' to the next sprint.
      Object.entries(currentSprint.tasks).forEach(([status, taskList]) => {
        if (status !== "Done") {
          taskList.forEach((task) => {
            // Remove any subtasks with an estimateTime of 0 <- Doesn't work?
            task.subTasks = task.subTasks.filter(
              (subTask) => subTask.estimatedTime !== 0
            );

            task.sprint = nextSprint.name;
          });
          nextSprint.tasks[status] = [...nextSprint.tasks[status], ...taskList];
        }
      });

      newSprints[currentSprintIndex].tasks = {
        ...currentSprint.tasks,
        Todo: [],
        InProgress: [],
        UnderReview: [],
      };

      return newSprints;
    });
  };

  const handleGenerateSprintSummary = (sprintName) => {
    const sprint = sprints.find((s) => s.name === sprintName);
    const sprintData = sprint.columns.map((column) => {
      const tasks = sprint.tasks[column];
      return { column, tasks };
    });

    generateSprintSummaryPdf(sprintName, sprintData);
  };

  const generateSprintSummaryPdf = (sprintName, sprintData) => {
    const doc = new jsPDF();
    const columns = [
      "Priority",
      "Task",
      "Team Member",
      "Subtasks",
      "Relative Cost",
      "Relative Estimate",
    ];
    const rows = sprintData.flatMap((columnData) => {
      const { column, tasks } = columnData;
      return tasks.map((task) => {
        const subtasks = task.subTasks
          .map(
            (sub) =>
              `${sub.value} (Assigned to: ${sub.assignee}, Actual Hours: ${sub.actualHours}, Estimated Time: ${sub.estimatedTime})`
          )
          .join("\n");

        return [
          task.priority,
          task.description,
          task.teamMember,
          subtasks,
          task.cost,
          task.estimate,
        ];
      });
    });

    // Calculations for  Total: row
    const totalActualHours = sprintData
      .flatMap((columnData) => columnData.tasks)
      .reduce(
        (total, task) =>
          total +
          task.subTasks.reduce(
            (subTotal, sub) => subTotal + sub.actualHours,
            0
          ),
        0
      );

    // Total: row
    rows.push(["Total:", "", "", "", "", totalActualHours.toFixed(2)]);

    doc.setFontSize(18);
    doc.text(`Team Summary for ${sprintName}`, 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
    });

    doc.save(`${sprintName}_team_summary.pdf`);
  };

  const handleGenerateSprintTaskSummary = (sprintName) => {
    const sprint = sprints.find((s) => s.name === sprintName);
    const sprintData = sprint.columns.map((column) => {
      const tasks = sprint.tasks[column];
      return { column, tasks };
    });

    generateSprintTaskSummaryPdf(sprintName, sprintData);
  };

  const generateSprintTaskSummaryPdf = (sprintName, sprintData) => {
    const doc = new jsPDF();
    const columns = [
      "Task",
      "Assigned Team Member",
      "Percent Complete",
      "Original Hours Estimate",
      "Actual Hours Worked",
      "Re-Estimate to Complete",
    ];

    const rows = [];

    sprintData.forEach((columnData) => {
      const { column, tasks } = columnData;
      tasks.forEach((task) => {
        const percentComplete = `${(
          (task.hours / (task.hours + task.estimateComplete)) *
          100
        ).toFixed(2)}%`;

        rows.push([
          task.description,
          task.teamMember,
          percentComplete,
          task.estimate,
          task.hours,
          task.estimateComplete,
        ]);

        task.subTasks.forEach((sub) => {
          rows.push([
            task.description + ": " + sub.value,
            sub.assignee,
            "",
            sub.estimatedTime,
            sub.actualHours,
            sub.estimatedTime,
          ]);
        });
      });
    });

    // Calculations for  Total: row
    const summaryData = sprintData
      .flatMap((columnData) => columnData.tasks)
      .reduce(
        (acc, task) => {
          acc.originalHours += task.estimate;
          acc.actualHours += task.hours;
          acc.reEstimate += task.estimateComplete;
          acc.percentCompleteSum +=
            (task.hours / (task.hours + task.estimate)) * 100;
          acc.count += 1;
          return acc;
        },
        {
          originalHours: 0,
          actualHours: 0,
          reEstimate: 0,
          percentCompleteSum: 0,
          count: 0,
        }
      );

    const averagePercentComplete = (
      summaryData.percentCompleteSum / summaryData.count
    ).toFixed(2);

    // Total: row
    rows.push([
      "Total:",
      "",
      averagePercentComplete + "%",
      summaryData.originalHours.toFixed(2),
      summaryData.actualHours.toFixed(2),
      summaryData.reEstimate.toFixed(2),
    ]);

    doc.setFontSize(18);
    doc.text(`Task Summary for ${sprintName}`, 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
    });

    doc.save(`${sprintName}_task_summary.pdf`);
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
              {sprint.name !== "Backlog" && (
                <button
                  onClick={() => handleGenerateSprintSummary(sprint.name)}
                  className="generate-summary"
                >
                  Generate Team Member Work Summary
                </button>
              )}
              {sprint.name !== "Backlog" && (
                <button
                  onClick={() => handleGenerateSprintTaskSummary(sprint.name)}
                  className="generate-sprint-summary"
                >
                  Generate Sprint Summary Report
                </button>
              )}
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
