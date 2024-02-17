import { useState, useEffect } from 'react';
import trashIcon from './components/trash.png';
import './App.css';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const storedTodoList = JSON.parse(localStorage.getItem('todoList'));
    if (storedTodoList) {
      setTodoList(storedTodoList);
    }
  }, []);

  const handleChange = (event) => {
    setNewTask(event.target.value);
  }

  const handleTask = () => {
    const task = {
      id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
      taskName: newTask,
      completed: false
    };
    setTodoList([...todoList, task]);
    localStorage.setItem('todoList', JSON.stringify([...todoList, task]));
    document.getElementById('input-field').value = "";
  };

  const handleDelete = (id) => {
    const updatedTodoList = todoList.filter((task) => task.id !== id);
    setTodoList(updatedTodoList);
    localStorage.setItem('todoList', JSON.stringify(updatedTodoList));

  }

  const handleCompletion = (id) => {
    const updatedTodoList = todoList.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    setTodoList(updatedTodoList);
    localStorage.setItem('todoList', JSON.stringify(updatedTodoList));
  }

  const handleKey = (event) => {
    if (event.key === "Enter") handleTask();
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="company-name">Todo..</span>
        </div>
      </nav>
      <div className="container">
        <div className="input-container">
          <input type="text" id='input-field' onChange={handleChange} onKeyPress={handleKey} />
          <button onClick={handleTask}>Add Task</button>
        </div>
        <div className="task-list">
          {todoList.map((task) => (
            <div className={`task-item ${task.completed ? 'completed' : ''}`} key={task.id}>
              <p onClick={() => handleCompletion(task.id)}>{task.taskName}</p>
              <button onClick={() => handleDelete(task.id)}><img src={trashIcon} alt="Icon" width="20px" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default App;
