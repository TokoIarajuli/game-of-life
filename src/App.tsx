import React, { useCallback, useRef, useState } from "react";
import produce from "immer";
import "./App.css";

const numRows = 30;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbours += g[newI][newJ];
              }
            });

            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbours === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 150);
  }, []);

  return (
    <div className="App">
      <div className="buttonWrapper">
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.7 ? 0 : 1))
              );
            }

            setGrid(rows);
          }}
        >
          Random
        </button>
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          Clear
        </button>
      </div>

      <div className="rules">
        <h4 style={{ textAlign: "center" }}>Rules:</h4>
        <p>1. Any live cell with two or three live neighbours survives.</p>
        <p>2. Any dead cell with three live neighbours becomes a live cell.</p>
        <p>
          3.All other live cells die in the next generation. Similarly, all
          other dead cells stay dead.
        </p>
        <p>
          P.S. Feel free to experiment with grid and create new forms. If you're
          too lazy for that, just press Random and then Start.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              className="grid"
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                marginLeft: "22vw",
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "#FF10F0" : undefined,
                border: "solid 1px white",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
