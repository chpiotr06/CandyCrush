/**
 * *Features to be added:
 * *Checking if possible move exists
 * *Disallowing if move to be done is not valid
 * *Add web techologies to square
 */
const grid = document.querySelector(".grid");
const width = 8;
const squares = [];
let score = 0;

const candyColors = [
  "red",
  "yellow",
  "orange",
  "purple",
  "green",
  "blue"
];

// Create board
function createBoard(){
  for (let i = 0; i <width*width; i++) {
    const square = document.createElement("div");
    square.setAttribute("draggable", "true");
    square.setAttribute("id", i); 
    let randomColor = Math.floor(Math.random() * candyColors.length)
    square.style.backgroundColor = candyColors[randomColor];
    grid.appendChild(square);
    squares.push(square);
  }
}

createBoard();

let colorBeingDragged; 
let squareIdBeingDragged;
let colorBeingReplaced;
let squareIdBeingReplaced;

//Drag the candies
squares.forEach(square => square.addEventListener("dragstart", dragStart)); 
squares.forEach(square => square.addEventListener("dragend", dragEnd)); 
squares.forEach(square => square.addEventListener("dragover", dragOver)); 
squares.forEach(square => square.addEventListener("dragenter", dragEnter)); 
squares.forEach(square => square.addEventListener("dragleave", dragLeave)); 
squares.forEach(square => square.addEventListener("drop", dragDrop));

function dragStart(){
  colorBeingDragged = this.style.backgroundColor;  
  squareIdBeingDragged = parseInt(this.id);
  
  console.log(this.id, "Start");
}

/**
 * ! Drag does NOT work while interacting with first square
 * ! both form left to right and bottom to up
 * ! Also sometimes diagonal moves are possible
 * ! don't really know why
 * TODO: Deal with above bugs
 */

function dragEnd(){
  //what is a valid move?
  let validMoves = [squareIdBeingDragged - 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + 1,
    squareIdBeingDragged + width
  ];
  let validMove = validMoves.includes(squareIdBeingReplaced);

  if(squareIdBeingReplaced && validMove){
    squareIdBeingReplaced = null;
  } else if(squareIdBeingReplaced && !validMove){
    squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
  } else {
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
  }
  console.log(this.id, "End");
}

function dragOver(e){
  e.preventDefault();
  console.log(this.id, "Over");
}

function dragEnter(e){
  e.preventDefault();
  console.log(this.id, "Enter");
}

function dragLeave(){
  console.log(this.id, "Leave");
}

function dragDrop(){
  colorBeingReplaced = this.style.backgroundColor; 
  squareIdBeingReplaced = parseInt(this.id);
  squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
  this.style.backgroundColor = colorBeingDragged;
  console.log(this.id, "Drop");
}


/**
  * * Checking for matches
  * ! Function chcecks for match even where row breaks to next row
  * TODO: Repair checking 
**/
function checkRowForThree(){
  for (let i = 0; i < 61; i++){
    let rowOfThree = [i, i+1, i+2];
    let decidedColor = squares[i].style.backgroundColor;
    const isBlank = squares[i].style.backgroundColor === "";
    
    if (rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank )){
      score += 3;
      rowOfThree.forEach(index => {
        squares[index].style.backgroundColor = "";
      })
    }
  }
}
/**
 * 
 */
function checkColumnForThree(){
  for (let i = 0; i < 47; i++){
    let columnOfThree = [i, i+width, i+width*2];
    let decidedColor = squares[i].style.backgroundColor;
    const isBlank = squares[i].style.backgroundColor === "";
    
    if (columnOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank )){
      score += 3;
      columnOfThree.forEach(index => {
        squares[index].style.backgroundColor = "";
      })
    }
  }
}

// *TODO: place checking right after the square is dropped!!! 
window.setInterval(function(){
   checkRowForThree();
   checkColumnForThree(); 
}, 100)
