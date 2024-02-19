import { useState, useEffect } from 'react';
import trashIcon from './components/trash.png';
import './App.css';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const googleWeather = "https://www.google.com/search?q=weather&rlz=1C1UEAD_enIN983IN983&oq=weathe&gs_lcrp=EgZjaHJvbWUqDwgAECMYJxidAhiABBiKBTIPCAAQIxgnGJ0CGIAEGIoFMgYIARBFGDkyDAgCECMYJxiABBiKBTINCAMQABiDARixAxiABDINCAQQABiSAxiABBiKBTIQCAUQABiDARiSAxixAxiABDIGCAYQRRg8MgYIBxBFGDyoAgCwAgA&sourceid=chrome&ie=UTF-8";

  const fetchWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=af0cc3a7b32f5e5dc2fc99635149d066`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            setWeatherData(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
    }
  };

  useEffect(() => {
    const storedTodoList = JSON.parse(localStorage.getItem('todoList'));
    if (storedTodoList) {
      setTodoList(storedTodoList);
    }
    fetchWeather();
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
      <div className="navbar">
        <div className="navbar-brand">
          <span className="company-name">Todo..</span>
        </div>
        {weatherData && (
          <a href={googleWeather} target='_blank'><div className="weather-info">
            <p>{Math.round(weatherData.main.temp - 273.15)}°C</p>
            <p>{weatherData.name}</p>
          </div>
          </a>
        )}
      </div>
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
