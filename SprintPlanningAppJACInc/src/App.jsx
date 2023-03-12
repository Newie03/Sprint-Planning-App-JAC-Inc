import React, { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const App = () => {
  const [tasks, setTasks] = useState({
    Backlog: [],
    Todo: [],
    InProgress: [],
    UnderReview: [],
    Done: [],
  });
  const [editingTask, setEditingTask] = useState(null);

  const handleTaskSubmit = (task) => {
    if (editingTask) {
      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        const taskList = newTasks[editingTask.status];
        const index = taskList.findIndex(
          (t) => t.description === editingTask.description
        );
        if (index !== -1) {
          taskList[index] = task;
          if (task.status !== editingTask.status) {
            newTasks[editingTask.status] = taskList.filter(
              (t) => t.description !== editingTask.description
            );
            newTasks[task.status] = [...newTasks[task.status], task];
          }
        }
        setEditingTask(null);
        return newTasks;
      });
    } else {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [task.status]: [...prevTasks[task.status], task],
      }));
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleRemove = (task) => {
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      const taskList = newTasks[task.status];
      const index = taskList.findIndex(
        (t) => t.description === task.description
      );
      if (index !== -1) {
        taskList.splice(index, 1);
      }
      return newTasks;
    });
  };

  return (
    <div>
      <h1>Task Tracker</h1>
      <TaskForm
        onSubmit={handleTaskSubmit}
        editingTask={editingTask}
        onCancel={() => setEditingTask(null)}
      />
      <div className="task-lists">
        <TaskList
          title="Backlog"
          tasks={tasks.Backlog}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
        <TaskList
          title="Todo"
          tasks={tasks.Todo}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
        <TaskList
          title="In Progress"
          tasks={tasks.InProgress}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
        <TaskList
          title="Under Review"
          tasks={tasks.UnderReview}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
        <TaskList
          title="Done"
          tasks={tasks.Done}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
};

export default App;
