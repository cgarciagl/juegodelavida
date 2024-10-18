let resolution = 4;
let grid;

function setup() {
  createCanvas(600, 600);
  grid = new Grid(width / resolution, height / resolution, resolution);
  grid.initialize();
}

function draw() {
  background(0);
  grid.display();
  grid.update();

  if (mouseIsPressed) {
    grid.addLiveCell(mouseX, mouseY);
  }
}

class Cell {
  constructor(x, y, resolution) {
    this.x = x;
    this.y = y;
    this.resolution = resolution;
    this.state = floor(random(2));
    this.nextState = this.state;
    this.color =  color('lime');
  }

  calculateNextState(grid) {
    let neighbors = this.countNeighbors(grid);
    if (this.state == 0 && neighbors == 3) {
      this.nextState = 1;
    } else if (this.state == 1 && (neighbors < 2 || neighbors > 3)) {
      this.nextState = 0;
    } else {
      this.nextState = this.state;
    }
  }

  updateState() {
    this.state = this.nextState;
  }

  display() {
    if (this.state == 1) {
      fill(this.color);
      stroke(0);
      rect(this.x * this.resolution, this.y * this.resolution, this.resolution, this.resolution);
    }
  }

  countNeighbors(grid) {
    let sum = 0;
    let cols = grid.cols;
    let rows = grid.rows;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (this.x + i + cols) % cols;
        let row = (this.y + j + rows) % rows;
        sum += grid.cells[col][row].state;
      }
    }
    sum -= grid.cells[this.x][this.y].state;
    return sum;
  }
}

class Grid {
  constructor(cols, rows, resolution) {
    this.cols = cols;
    this.rows = rows;
    this.resolution = resolution;
    this.cells = this.create2DArray();
  }

  create2DArray() {
    let arr = new Array(this.cols);
    for (let i = 0; i < this.cols; i++) {
      arr[i] = new Array(this.rows);
      for (let j = 0; j < this.rows; j++) {
        arr[i][j] = new Cell(i, j, this.resolution);
      }
    }
    return arr;
  }

  initialize() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.cells[i][j] = new Cell(i, j, this.resolution);
      }
    }
  }

  display() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.cells[i][j].display();
      }
    }
  }

  update() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.cells[i][j].calculateNextState(this);
      }
    }
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.cells[i][j].updateState();
      }
    }
  }

  addLiveCell(x, y) {
    let col = floor(x / this.resolution);
    let row = floor(y / this.resolution);
    if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
      this.cells[col][row].state = 1;
      this.cells[col][row].color = color('lime');
    }
  }
}
