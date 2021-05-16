import React, { useRef, useEffect, useState } from "react";
import { map } from "./map";
import Game, { STATE } from "./game";
// Extend the window interface with game
declare global {
  interface Window {
    game: any;
  }
}

type canvasControllerType = {
  setPopup: (popup: boolean) => void;
};
const CanvasController: React.FC<canvasControllerType> = ({ setPopup }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game] = useState<any>(new Game());
  const width = 900;
  const height = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    window.game = game; // Make it possible to access game from console devtools
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
        case "e":
          console.log("[INTERACT]...");
          setPopup(true);
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
  }, [game]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default CanvasController;
