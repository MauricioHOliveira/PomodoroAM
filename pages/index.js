import React, { useState, useEffect } from 'react';
import '../app/globals.css';
import Head from "next/head";
import Link from "next/link";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [timerValue, setTimerValue] = useState(''); // Deixar vazio inicialmente


  // Atualiza o temporizador a cada segundo, mas apenas no cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const intervalId = setInterval(() => {
        const currentTime = new Date();
        const hours = String(currentTime.getHours()).padStart(2, '0');
        const minutes = String(currentTime.getMinutes()).padStart(2, '0');
        const seconds = String(currentTime.getSeconds()).padStart(2, '0');
        setTimerValue(`${hours}:${minutes}:${seconds}`);
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Lógica do temporizador movida para cá
  useEffect(() => {
    let focusButton = document.getElementById("focus");
    let buttons = document.querySelectorAll(".btn");
    let shortBreakButton = document.getElementById("shortbreak");
    let longBreakButton = document.getElementById("longbreak");
    let startBtn = document.getElementById("btn-start");
    let reset = document.getElementById("btn-reset");
    let pause = document.getElementById("btn-pause");
    let time = document.getElementById("time");
    let set;
    let active = "focus";
    let count = 59;
    let paused = true;
    let minCount = 24;
    time.textContent = `${minCount + 1}:00`;
    const appendZero = (value) => {
      value = value < 10 ? `0${value}` : value;
      return value;
    };

    // Definindo a função pauseTimer
    const pauseTimer = () => {
      paused = true;
      clearInterval(set);
      startBtn.classList.remove("hide");
      pause.classList.remove("show");
      reset.classList.remove("show");
    };

    const resetTime = () => {
      pauseTimer();
      switch (active) {
        case "long":
          minCount = 14;
          break;
        case "short":
          minCount = 4;
          break;
        default:
          minCount = 24;
          break;
      }
      count = 59;
      time.textContent = `${minCount + 1}:00`;
    };

    reset.addEventListener("click", resetTime);

    const removeFocus = () => {
      buttons.forEach((btn) => {
        btn.classList.remove("btn-focus");
      });
    };

    focusButton.addEventListener("click", () => {
      removeFocus();
      focusButton.classList.add("btn-focus");
      pauseTimer();
      minCount = 24;
      count = 59;
      time.textContent = `${minCount + 1}:00`;
    });

    shortBreakButton.addEventListener("click", () => {
      active = "short";
      removeFocus();
      shortBreakButton.classList.add("btn-focus");
      pauseTimer();
      minCount = 4;
      count = 59;
      time.textContent = `${appendZero(minCount + 1)}:00`;
    });

    longBreakButton.addEventListener("click", () => {
      active = "long";
      removeFocus();
      longBreakButton.classList.add("btn-focus");
      pauseTimer();
      minCount = 14;
      count = 59;
      time.textContent = `${minCount + 1}:00`;
    });

    pause.addEventListener("click", pauseTimer);

    startBtn.addEventListener("click", () => {
      reset.classList.add("show");
      pause.classList.add("show");
      startBtn.classList.add("hide");
      startBtn.classList.remove("show");
      if (paused) {
        paused = false;
        time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;
        set = setInterval(() => {
          count--;
          time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;
          if (count == 0) {
            if (minCount != 0) {
              minCount--;
              count = 60;
            } else {
              clearInterval(set);
            }
          }
        }, 1000);
      }
    });

    // Limpe os event listeners ao desmontar o componente
    return () => {
      reset.removeEventListener("click", resetTime);
      focusButton.removeEventListener("click", () => {});
      shortBreakButton.removeEventListener("click", () => {});
      longBreakButton.removeEventListener("click", () => {});
      pause.removeEventListener("click", pauseTimer);
      startBtn.removeEventListener("click", () => {});
    };
  }, []);

  return (
    <>
      <div className="container">
        <div className="section-container">
          <button id="focus" className="btn btn-timer btn-focus">Focus</button>
          <button id="shortbreak" className="btn btn-shortbreak">Short Break</button>
          <button id="longbreak" className="btn btn-longbreak">Long Break</button>
        </div>
        <div className="time-btn-container">
          <span id="time"></span>
          <div className="btn-container">
            <button id="btn-start" className="show">Start</button>
            <button id="btn-pause" className="hide">Pause</button>
            <button id="btn-reset" className="hide">Resetar</button>
          </div>
        </div>
      </div>
      <div className="tasks-container">
        <div className="tasks-header">
          <h1 className="taskname">Minhas Tarefas</h1>
          <Link className="create-button" href="/create">
            Criar</Link>
        </div>
        <ul className='tasks-list'>
          {tasks.map((task) => (
            <li key={task.id} className="tasks-list-item">
              <span>
                <strong>{task.title}</strong> - {task.description}
              </span>
              <span className="tasks-actions">
                <Link className="tasks-action edit-button" href={`/${task.id}/edit`}>Editar</Link>
                <Link className="tasks-action delete-button" href={`/${task.id}/delete`}>Deletar</Link>
              </span>
            </li>
          ))}
          {tasks.length === 0 && <div className="tasks-empty">Sem Tarefas</div>}
        </ul>
      </div>
      <Head>
        <title>Promofocus</title>
      </Head>
    </>
  );
};

export default Home;