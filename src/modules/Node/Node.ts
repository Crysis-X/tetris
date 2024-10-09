import generateNode, { NodeList, Nodes } from "./generateNode";
import Cell from "../Cell/Cell";

type NodeEvent = {
  nodeStop?: () => any;
};

export default class Node {
  private type: Nodes = "cube";
  private fallPause: boolean = false;
  private pos: { x: number; y: number };
  private cells: Cell[][];
  private nodeCells: Cell[];
  private event: NodeEvent = {};
  private rotateLevel: 1 | 2 | 3 | 4 = 1;
  constructor(cells: Cell[][], type?: Nodes, x?: number, y?: number) {
    this.cells = cells;
    if (x && y) this.pos = { x, y };
    else this.pos = { y: 0, x: Math.floor(cells[0].length / 2) };
    let id = Math.floor(Math.random() * 7);
    if (type) id = NodeList[type];
    switch (id) {
      case 0: {
        this.type = "cube";
        break;
      }
      case 1: {
        this.type = "pistolRight";
        break;
      }
      case 2: {
        this.type = "pistolLeft";
        break;
      }
      case 3: {
        this.type = "line";
        break;
      }
      case 4: {
        this.type = "thunderLeft";
        if (!this.cells[this.pos.y - 1]) this.pos.y++;
        break;
      }
      case 5: {
        this.type = "thunderRight";
        if (!this.cells[this.pos.y - 1]) this.pos.y++;
        break;
      }
      default: {
        this.type = "mountain";
        if (!this.cells[this.pos.y - 1]) this.pos.y++;
        break;
      }
    }
    const res = generateNode(this.type, this.pos.x, this.pos.y);
    if (!res[this.type]) throw Error();
    const nodeCells: Cell[] = [];
    res[this.type]?.forEach((pos) => nodeCells.push(this.cells[pos.y][pos.x]));
    this.nodeCells = nodeCells;
  }
  getType = () => this.type;
  rotate = () => {
    if (this.type == "cube") return;
    this.remove();
    let newCells: Cell[] = [];
    const res = generateNode(this.type, this.pos.x, this.pos.y);
    if (
      this.type == "line" ||
      this.type == "thunderLeft" ||
      this.type == "thunderRight"
    ) {
      let canRotate = true;
      if (this.rotateLevel == 1) {
        if ("r1_" + this.type in res) {
          res["r1_" + this.type].forEach((pos) => {
            if (this.cells[pos.y] && this.cells[pos.y][pos.x]) {
              newCells.push(this.cells[pos.y][pos.x]);
            } else canRotate = false;
          });
        }
      } else
        res[this.type]?.forEach((pos) => {
          if (this.cells[pos.y] && this.cells[pos.y][pos.x]) {
            newCells.push(this.cells[pos.y][pos.x]);
          } else canRotate = false;
        });
      if (!canRotate) {
        this.spawn();
        return;
      }
      for (let i = 0; i < newCells.length; i++) {
        if (newCells[i].getStatus()) {
          this.spawn();
          return;
        }
      }
      this.rotateLevel = this.rotateLevel == 1 ? 2 : 1;
    } else if (
      this.type == "mountain" ||
      this.type == "pistolLeft" ||
      this.type == "pistolRight"
    ) {
      let canRotate = true;
      switch (this.rotateLevel) {
        case 1:
          res["r1_" + this.type]?.forEach((pos) => {
            if (this.cells[pos.y] && this.cells[pos.y][pos.x]) {
              newCells.push(this.cells[pos.y][pos.x]);
            } else canRotate = false;
          });
          if (!canRotate) break;
          this.rotateLevel = 2;
          break;
        case 2:
          res["r2_" + this.type]?.forEach((pos) => {
            if (this.cells[pos.y] && this.cells[pos.y][pos.x]) {
              newCells.push(this.cells[pos.y][pos.x]);
            } else canRotate = false;
          });
          if (!canRotate) break;
          this.rotateLevel = 3;
          break;
        case 3:
          res["r3_" + this.type]?.forEach((pos) => {
            if (this.cells[pos.y] && this.cells[pos.y][pos.x]) {
              newCells.push(this.cells[pos.y][pos.x]);
            } else canRotate = false;
          });
          if (!canRotate) break;
          this.rotateLevel = 4;
          break;
        default:
          res[this.type]?.forEach((pos) => {
            if (this.cells[pos.y] && this.cells[pos.y][pos.x]) {
              newCells.push(this.cells[pos.y][pos.x]);
            } else canRotate = false;
          });
          if (!canRotate) break;
          this.rotateLevel = 1;
      }
      if (!canRotate) return;
    }
    this.nodeCells = newCells;
    this.spawn();
  };
  spawn = () => {
    for (let i = 0; i < this.nodeCells.length; i++) {
      if (this.nodeCells[i].getStatus()) return false;
      this.nodeCells[i].setStatus(true);
    }
    return true;
  };
  remove = () => this.nodeCells.forEach((cell) => cell.setStatus(false));
  pause = () => (this.fallPause = true);
  moveTo = (direction: "down" | "left" | "right") => {
    const newCells: Cell[] = [];
    if (direction == "down") {
      for (let i = 0; i < this.nodeCells.length; i++) {
        const cell = this.nodeCells[i];
        if (this.cells[cell.getY() + 1]) {
          const newCell = this.cells[cell.getY() + 1][cell.getX()];
          if (newCell.getStatus() && !this.isNodeCell(newCell)) return false;
          newCells.push(newCell);
        } else return false;
      }
      this.pos.y++;
    } else if (direction == "left") {
      for (let i = 0; i < this.nodeCells.length; i++) {
        const cell = this.nodeCells[i];
        if (this.cells[cell.getY()][cell.getX() - 1]) {
          const newCell = this.cells[cell.getY()][cell.getX() - 1];
          if (newCell.getStatus() && !this.isNodeCell(newCell)) return false;
          newCells.push(newCell);
        } else return false;
      }
      this.pos.x--;
    } else if (direction == "right") {
      for (let i = 0; i < this.nodeCells.length; i++) {
        const cell = this.nodeCells[i];
        if (this.cells[cell.getY()][cell.getX() + 1]) {
          const newCell = this.cells[cell.getY()][cell.getX() + 1];
          if (newCell.getStatus() && !this.isNodeCell(newCell)) return false;
          newCells.push(newCell);
        } else return false;
      }
      this.pos.x++;
    }
    this.remove();
    this.nodeCells = newCells;
    this.spawn();

    return true;
  };
  fall = (gameSpeed: number) => {
    this.fallPause = false;
    const interval = setInterval(() => {
      if (this.fallPause) {
        clearInterval(interval);
        return;
      }
      const result = this.moveTo("down");
      if (!result) {
        this.event.nodeStop && this.event.nodeStop();
        clearInterval(interval);
      }
    }, gameSpeed);
  };
  fullDown = () => {
    while (true) {
      const status = this.moveTo("down");
      if (!status) break;
    }
  };
  onNodeStop = (handler: typeof this.event.nodeStop) => {
    this.event.nodeStop = handler;
  };
  private isNodeCell = (cell: Cell) => {
    let isNodeCell = false;
    for (let i = 0; i < this.nodeCells.length; i++) {
      const nodeCell = this.nodeCells[i];
      if (nodeCell.getY() == cell.getY() && nodeCell.getX() == cell.getX())
        isNodeCell = true;
    }
    return isNodeCell;
  };
}
