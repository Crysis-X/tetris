import { useEffect, useRef, useState } from "react";
import Game from "./modules/Game/Game";

export default function App() {
  const wrapper = useRef<HTMLDivElement>(null);
  const game = useRef<Game | undefined>();
  const [point, setPoint] = useState(0);
  useEffect(() => {
    if (!wrapper.current) return;
    game.current = new Game(350);
    game.current.appendBoardTo(wrapper.current);
    game.current.onGameEnd(() => {
      alert("Вы проиграли. Кол. очков: " + point);
      game.current?.restart();
    });
    game.current.onUpdatePoint((newPoint) => setPoint(newPoint));
  }, []);
  useEffect(() => {
    game.current?.onGameEnd(() => {
      alert("Вы проиграли. Кол. очков: " + point);
      game.current?.restart();
    });
  }, [point]);
  return (
    <div className="flex justify-around">
      <div
        ref={wrapper}
        className="flex items-center h-[100vh] justify-center"
      ></div>
      <div className="flex flex-col justify-around">
        <div className="text-6xl">{point}</div>
        <button
          onClick={(e) => {
            game.current?.start();
            e.currentTarget.style.display = "none";
          }}
          className="text-2xl"
        >
          Start
        </button>
      </div>
    </div>
  );
}
