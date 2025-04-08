import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [playerY, setPlayerY] = useState(270);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [score, setScore] = useState(0);

  const gameAreaHeight = 300;
  const gameAreaWidth = 800;
  const playerSize = 30;
  const gravity = 1;
  const jumpStrength = -12;
  const obstacleGap = 200;

  const handleKeyDown = (event) => {
    if (event.code === 'Space' && !gameOver) { // Игрок может прыгать только если игра не закончена
      setVelocity(jumpStrength);
    }
  };

  // Создаем препятствия
  useEffect(() => {
    const intervalId = setInterval(() => {
      setObstacles((obs) => {
        if (obs.length === 0 || obs[obs.length - 1].x < gameAreaWidth - obstacleGap) {
          return [
            ...obs,
            { x: gameAreaWidth, width: 30, height: 50 + Math.random() * 50 },
          ];
        }
        return obs;
      });
    }, 1500);

    return () => clearInterval(intervalId);
  }, []);

  // Двигаем препятствия
  useEffect(() => {
    const intervalId = setInterval(() => {
      setObstacles((obs) =>
        obs
          .map((obstacle) => ({ ...obstacle, x: obstacle.x - speed }))
          .filter((obstacle) => obstacle.x + 30 > 0)
      );
    }, 50);

    return () => clearInterval(intervalId);
  }, [speed]);

  // Движение игрока
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlayerY((y) => Math.min(gameAreaHeight - playerSize, y + velocity));
      setVelocity((v) => v + gravity);
    }, 30);

    return () => clearInterval(intervalId);
  }, [velocity]);

  // Проверка на столкновения и увеличение счета
  useEffect(() => {
    obstacles.forEach((obstacle) => {
      if (
        obstacle.x < 50 + playerSize &&
        obstacle.x + obstacle.width > 50 &&
        playerY + playerSize > gameAreaHeight - obstacle.height
      ) {
        setGameOver(true);
      }

      // Увеличиваем счет, если игрок проходит препятствие
      if (!obstacle.passed && obstacle.x + obstacle.width < 50 && !gameOver) {
        setScore((prevScore) => prevScore + 1); // Увеличиваем счет только если игра не завершена
        obstacle.passed = true; // Фиксируем, что препятствие прошло
      }
    });
  }, [obstacles, playerY, gameOver]);

  // Добавляем обработчик событий клавиатуры
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  if (gameOver) {
    return <h1>Game Over! Score: {score}</h1>;
  }

  return (
    <div
      className="game-area"
      style={{ width: gameAreaWidth, height: gameAreaHeight, position: 'relative', backgroundColor: '#f0f0f0' }}
    >
      {/* Отображаем счет */}
      <div style={{ position: 'absolute', top: 10, left: 10, fontSize: '20px' }}>
        Score: {score}
      </div>

      {/* Игрок */}
      <div
        className="player"
        style={{
          position: 'absolute',
          top: playerY,
          left: 50,
          width: playerSize,
          height: playerSize,
          backgroundColor: 'blue',
        }}
      />

      {/* Препятствия */}
      {obstacles.map((obstacle, index) => (
        <svg
          key={index}
          className="obstacle"
          style={{
            position: 'absolute',
            bottom: 0,
            left: obstacle.x,
            width: obstacle.width,
            height: obstacle.height,
          }}
        >
          <polygon
            points={`0,${obstacle.height} ${obstacle.width / 2},0 ${obstacle.width},${obstacle.height}`}
            fill="red"
          />
        </svg>
      ))}
    </div>
  );
};

export default App;