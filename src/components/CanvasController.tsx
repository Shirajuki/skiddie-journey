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
  popup: boolean;
  setPopup: (popup: boolean) => void;
};
const CanvasController: React.FC<canvasControllerType> = ({
  popup,
  setPopup,
}) => {
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
          // Check position of PCs and edit topic state accordingly, before setting popup to true
          if (!popup) {
            const pos = {
              x: Math.round(game.player.x / 50),
              y: Math.round(game.player.y / 50),
            };
            const tile = game.map[pos.y][pos.x];
            if ("xyzXYZ".includes(tile.toLowerCase())) {
              // console.log(tile, pos.x, pos.y);
              if (pos.x >= 22 && pos.x <= 24 && pos.y >= 21 && pos.y <= 22)
                console.log("it");
              else if (pos.x >= 39 && pos.x <= 41 && pos.y >= 22 && pos.y <= 23)
                console.log("javascript");
              else if (pos.x >= 60 && pos.x <= 62 && pos.y >= 28 && pos.y <= 29)
                console.log("python");
              else if (pos.x >= 69 && pos.x <= 71 && pos.y >= 21 && pos.y <= 22)
                console.log("gamedesign");
              else if (pos.x >= 39 && pos.x <= 41 && pos.y >= 8 && pos.y <= 9)
                console.log("webdesign");
              else if (pos.x >= 19 && pos.x <= 21 && pos.y >= 8 && pos.y <= 9)
                console.log("cybersecurity");
              setPopup(true);
            }
          }
          break;
      }
    };
    if (canvas) {
      console.log("LOAD");
      game.init(canvas, map);
      game.draw();
      setTimeout(() => console.log(game), 500);
      document.addEventListener("keydown", keyDownHandler, false);
      document.addEventListener("keyup", keyUpHandler, false);
    }
  }, [game, setPopup]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default CanvasController;
