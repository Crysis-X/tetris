import Cell from "../Cell/Cell";
import Node from "../Node/Node";

type Events = {
  gameEnd?: () => any;
  updatePoint?: (newPoint: number) => any;
};
export default class Game {
  private point = 0;
  private field = document.createElement("div");
  private cells: Cell[][] = [];
  private gameSpeed: number;
  private node?: Node;
  private event: Events = {};
  constructor(gameSpeed: number) {
    const fieldWidth = 10;
    const cellWidth = "2vw";

    this.cells = this.build(20, fieldWidth, cellWidth);
    this.gameSpeed = gameSpeed;
    this.field.style.width = `calc(${cellWidth} * ${fieldWidth})`;
    this.field.className += " flex flex-wrap border-2 border-black box-content";
  }
  appendBoardTo = (element: HTMLDivElement) => element.append(this.field);
  start = () => {
    this.node = new Node(this.cells);
    const result = this.node.spawn();
    if (!result) {
      document.onkeyup = null;
      this.node = undefined;
      this.event.gameEnd && this.event.gameEnd();
      return;
    }
    this.node.fall(this.gameSpeed);
    document.onkeyup = (e) => {
      if (e.key == "a" || e.key == "ArrowLeft") this.node?.moveTo("left");
      if (e.key == "d" || e.key == "ArrowRight") this.node?.moveTo("right");
      if (e.key == "s" || e.key == "ArrowDown") this.node?.moveTo("down");
      if (e.key == "w" || e.key == "ArrowUp") this.node?.rotate();
      if (e.code == "Space") this.node?.fullDown();
    };
    this.node.onNodeStop(() => {
      this.start();
      const linesForDeleting: number[] = [];
      for (let y = 0; y < this.cells.length; y++) {
        let isForDeleting = true;
        for (let x = 0; x < this.cells[y].length; x++) {
          if (!this.cells[y][x].getStatus()) {
            isForDeleting = false;
            break;
          }
        }
        if (isForDeleting) linesForDeleting.push(y);
      }
      linesForDeleting.forEach((id) => {
        this.cells[id].forEach((cell) => cell.setStatus(false));
        for(let i = id - 1; i > -1; i--){
          let isEmpty = true; 
          for(let x = 0; x < this.cells[i].length; x++){
            if(this.cells[i][x].getStatus()){
              isEmpty = false;
              break;
            }
          }
          if(isEmpty) break;
          else {
            this.cells[i].forEach(cell => {
              this.cells[i + 1][cell.getX()].setStatus(cell.getStatus());
              cell.setStatus(false);
            });
          }
        }
        this.point++;
        this.event.updatePoint && this.event.updatePoint(this.point);
      }
    );
    });
  };
  restart = () => {
    this.cells.forEach(line => line.forEach(cell => cell.setStatus(false)));
    this.start();
    this.point = 0;
    this.event.updatePoint && this.event.updatePoint(this.point);
  }
  private build = (height: number, width: number, cellWidth?: string) => {
    const cells: Cell[][] = [];
    for (let y = 0; y < height; y++) {
      const line: Cell[] = [];
      for (let x = 0; x < width; x++) {
        const cell = new Cell(x, y, cellWidth);
        line.push(cell);
        cell.appendTo(this.field);
      }
      cells.push(line);
    }
    return cells;
  };
  onGameEnd = (handler: typeof this.event.gameEnd) => {
    this.event.gameEnd = handler;
  }
  onUpdatePoint = (handler: typeof this.event.updatePoint) => {
    this.event.updatePoint = handler;
  }
}
