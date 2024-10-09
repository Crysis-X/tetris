export default class Cell {
    private x: number;
    private y: number;
    private cell = document.createElement("div");
    private classNames = {
        empty: " w-[1.5vw] aspect-square bg-white border-2 border-black",
        full: " w-[1.5vw] aspect-square bg-black border-2 border-white"
    };
    private status = false; 
    constructor(x: number, y: number, width?: string){
        this.x = x;
        this.y = y;
        this.cell.className = this.classNames.empty;
        if(width) this.cell.style.width = width;
    }
    getX = () => this.x;
    getY = () => this.y;
    getStatus = () => this.status;
    setStatus = (status: boolean) => {
        if(status){
            this.cell.className = this.classNames.full;
            this.status = true;
        }
        else {
            this.cell.className = this.classNames.empty;
            this.status = false;    
        }
        return this.status;
    } 
    appendTo = (element: HTMLElement) => element.append(this.cell);
} 