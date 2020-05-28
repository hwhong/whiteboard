import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { Toolbar } from "./component/toolbar";
import styles from "./app.module.css";
const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT);

interface Coordinate {
  x: number;
  y: number;
}

interface User {
  color: string;
  strokes: Coordinate[];
}

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(
    undefined
  );
  const [isPainting, setIsPainting] = React.useState(false);
  const [strokes, setStrokes] = React.useState<Coordinate[]>([]);

  useEffect(() => {
    socket.on("receive-strokes", (resp) => {
      console.log(resp);
      resp.forEach((coord, i, arr) => {
        if (i <= arr.length - 2) {
          drawLine(resp[i], resp[i + 1]);
        }
      });
    });
  });

  const startPaint = React.useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setMousePosition(coordinates);
      setIsPainting(true);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener("mousedown", startPaint);

    return () => {
      canvas.removeEventListener("mousedown", startPaint);
    };
  }, [startPaint]);

  const paint = React.useCallback(
    (event: MouseEvent) => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);

          setStrokes([...strokes, newMousePosition]);
        }
      }
    },
    [isPainting, mousePosition]
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener("mousemove", paint);

    // emit the strokes
    socket.emit("emit-strokes", strokes);

    return () => {
      canvas.removeEventListener("mousemove", paint);
    };
  }, [paint]);

  const exitPaint = React.useCallback(() => {
    setIsPainting(false);
    setMousePosition(undefined);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener("mouseup", exitPaint);
    canvas.addEventListener("mouseleave", exitPaint);
    return () => {
      canvas.removeEventListener("mouseup", exitPaint);
      canvas.removeEventListener("mouseleave", exitPaint);
    };
  }, [exitPaint]);

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop,
    };
  };

  const drawLine = (
    originalMousePosition: Coordinate,
    newMousePosition: Coordinate
  ) => {
    if (!canvasRef.current || !originalMousePosition || !newMousePosition) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      context.strokeStyle = "red";
      context.lineJoin = "round";
      context.lineWidth = 5;

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();

      context.stroke();
    }
  };

  return (
    <>
      <Toolbar />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={styles.root}
      />
    </>
  );
}

export default App;
