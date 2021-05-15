import React, { useRef, useEffect } from "react";
import { map } from "./map";
import Game, { STATE } from "./game";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const game = new Game();

    const keyDownHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          game.player.movement.left = true;
          break;
        case "ArrowUp":
          game.player.movement.up = true;
          break;
        case "ArrowRight":
          game.player.movement.right = true;
          break;
        case "ArrowDown":
          game.player.movement.down = true;
          break;
      }
    };
    const keyUpHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          game.player.movement.left = false;
          game.player.state = STATE.idle;
          break;
        case "ArrowUp":
          game.player.movement.up = false;
          break;
        case "ArrowRight":
          game.player.movement.right = false;
          game.player.state = STATE.idle;
          break;
        case "ArrowDown":
          game.player.movement.down = false;
          break;
      }
    };
    if (canvas) {
      window.addEventListener("load", function () {
        game.init(canvas, map);
        game.draw();
        setTimeout(() => console.log(game), 500);
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
      });
    }
  }, []);

  return <canvas ref={canvasRef} width="900" height="600" />;
};

export default Canvas;
