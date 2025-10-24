body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  margin: 0;
  padding: 10px;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

#game {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1;
  margin-top: 20px;
}

.cell {
  background-color: #fff;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5vw;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.cell:hover {
  transform: scale(1.05);
  background-color: #f0f0f0;
}

.cell.winning {
  background-color: #4CAF50;
  color: white;
  animation: flash 0.6s ease-in-out 0s 3;
}

@keyframes flash {
  0%, 100% { background-color: #4CAF50; }
  50% { background-color: #81C784; }
}

#controls {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

button {
  padding: 10px 18px;
  margin: 5px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  background-color: #007BFF;
  color: white;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

#scores {
  margin-top: 15px;
  text-align: center;
  font-size: 1.1rem;
  color: #333;
}

#symbol-choice, #difficulty-choice {
  margin-top: 15px;
  text-align: center;
}

#symbol-choice button, #difficulty-choice button {
  background-color: #28a745;
}

#symbol-choice button:hover, #difficulty-choice button:hover {
  background-color: #218838;
}

/* Responsive design */
@media (max-width: 500px) {
  .cell {
    font-size: 12vw;
  }

  button {
    padding: 8px 14px;
    font-size: 0.9rem;
  }
}






