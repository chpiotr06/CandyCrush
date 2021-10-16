/**
 ///// *TODO: place checking right after the square is dropped!!! 
 * *Features to be added:
 * *STYLLING!!!
 * *Checking if possible move exists
 * *Disallowing if move to be done is not valid
 * *Add web techologies logos to square
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
let colorBeingDragged; 
let squareIdBeingDragged;
let colorBeingReplaced;
let squareIdBeingReplaced;

// Create board
function createBoard(){
  for (let i = 0; i <width*width; i++) {
    const square = document.createElement("div");
    square.setAttribute("draggable", "true");
    square.setAttribute("id", i); 
    square.innerHTML = i;
    let randomColor = Math.floor(Math.random() * candyColors.length)
    square.style.backgroundColor = candyColors[randomColor];
    grid.appendChild(square);
    squares.push(square);
  }
}
createBoard();
checkRowForFour();
checkColumnForFour(); 
checkRowForThree();
checkColumnForThree(); 

squares.forEach(square => square.addEventListener("dragstart", dragStart)); 
squares.forEach(square => square.addEventListener("dragend", dragEnd)); 
squares.forEach(square => square.addEventListener("dragover", dragOver)); 
squares.forEach(square => square.addEventListener("dragenter", dragEnter)); 
squares.forEach(square => square.addEventListener("dragleave", dragLeave)); 
squares.forEach(square => square.addEventListener("drop", dragDrop));

function dragStart(){
  colorBeingDragged = this.style.backgroundColor;  
  squareIdBeingDragged = parseInt(this.id);
}

/**
 * /////! Drag does NOT work while interacting with first square
 * /////! both form left to right and bottom to up
 * ? Also sometimes diagonal moves are possible
 * ? don't really know why and how to replicate them consistently
 * ? update to above comment: didn't find any issiues lately :thinking:
 * TODO: Deal with above bugs
 * * Checking for four works as intended
 * ? Maybe i need to rewrite functions and make everything in only 2 functions (rows and cols)?
 */

function dragEnd(){
  let validMoves = [squareIdBeingDragged - 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + 1,
    squareIdBeingDragged + width
  ];
  let validMove = validMoves.includes(squareIdBeingReplaced);
  if(squareIdBeingReplaced >= 0  && validMove){
    squareIdBeingReplaced = null;
  } else {
    squares[squareIdBeingReplaced].style.backgroundColor = colorBeingReplaced;
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
  } 
  checkRowForFour();
  checkColumnForFour(); 
  checkRowForThree();
  checkColumnForThree();
}
function dragDrop(){
  colorBeingReplaced = this.style.backgroundColor; 
  squareIdBeingReplaced = parseInt(this.id);
  squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
  this.style.backgroundColor = colorBeingDragged;
}

function dragOver(e){ e.preventDefault(); }
function dragEnter(e){ e.preventDefault(); }
function dragLeave(){}

/**
 * * drop candies once some have been cleared
 */
function moveDown(){
  for(let i = 0; i < 56; i++){
    if(squares[i + width].style.backgroundColor === ""){
      squares[i + width].style.backgroundColor = squares[i].style.backgroundColor;
      squares[i].style.backgroundColor = "";
    }
    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
    const isFirstRow = firstRow.includes(i)
    if(isFirstRow && squares[i].style.backgroundColor === ""){
      let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      squares[i].style.backgroundColor = randomColor;
    }
  }
  if(squares.every(index => !(index.style.backgroundColor === "") )){
    checkRowForFour();
    checkColumnForFour(); 
    checkRowForThree();
    checkColumnForThree();
  }
}





/**
  * * Checking for matches
  * // Function chcecks for match even where row breaks to next row
  * //TODO: Repair checking 
**/
function checkRowForFour(){
  for (let i = 0; i <= 60; i++){
    let rowOfFour = [i, i + 1, i + 2, i + 3];
    let decidedColor = squares[i].style.backgroundColor;
    const isBlank = squares[i].style.backgroundColor === "";

    const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
    if (notValid.includes(i)) continue;
    
    if (rowOfFour.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank )){
      score += 4;
      rowOfFour.forEach(index => {
        squares[index].style.backgroundColor = "";
      })
    }
  }
  console.log(score);
}
function checkColumnForFour(){
  for (let i = 0; i <= 39; i++){
    let columnOfFour = [i, i + width, i + width*2, i + width*3];
    let decidedColor = squares[i].style.backgroundColor;
    const isBlank = squares[i].style.backgroundColor === "";
    
    if (columnOfFour.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank )){
      score += 4;
      columnOfFour.forEach(index => {
        squares[index].style.backgroundColor = "";
      })
    }
  }
  console.log(score);
}
function checkRowForThree(){
  for (let i = 0; i <= 61; i++){
    let rowOfThree = [i, i + 1, i + 2];
    let decidedColor = squares[i].style.backgroundColor;
    const isBlank = squares[i].style.backgroundColor === "";

    const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
    if (notValid.includes(i)) continue;
    if (rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank )){
      score += 3;
      rowOfThree.forEach(index => {
        squares[index].style.backgroundColor = "";
      })
    }
  }
  console.log(score);
}
/**
 /////* ! Last row is not taken into consideration thus chceckColumnForThree is not working as expected
 */
function checkColumnForThree() {
  for (i = 0; i < 48; i ++) {
    let columnOfThree = [i, i+width, i+width*2]
    let decidedColor = squares[i].style.backgroundColor
    const isBlank = squares[i].style.backgroundColor === ''

    if(columnOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
      score += 3
      columnOfThree.forEach(index => {
        squares[index].style.backgroundColor = ''
      })
    }
  }
  console.log(score);
}

 setInterval(() => {
    moveDown();
}, 1000)