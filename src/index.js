/**
 * TODO: refactor functions responsible for checking rows an collumns
 * *Features to be added:
 * *STYLLING!!!
 * *Add web techologies logos to square
 */

class colors {
  constructor(color, tag){
    this.color = color;
    this.tag = tag;
  }
}

const grid = document.querySelector(".grid");
const width = 8;
const squares = [];
let score = 0;

/**
 * /////TODO: Need to add swapping tags between two squares if move is valid
 * *candyColors should be an obcject containing color and html tag of logo inside.
 */
const candyColors = [
  new colors("#f59598", "<i class=\"fab fa-vuejs\"></i>"),
  new colors("#faf28d", "<i class=\"fab fa-react\"></i>"),
  new colors("#fcbc7c", "<i class=\"fab fa-angular\"></i>"),
  new colors("#b3b3da", "<i class=\"fab fa-js-square\"></i>"),
  new colors("#bbdcad", "<i class=\"fab fa-node-js\"></i>"),
  new colors("#6a9aaa", "<i class=\"fab fa-docker\"></i>")
]


const scoreHolder = document.querySelector(".score");
let colorBeingDragged; 
let squareIdBeingDragged;
let colorBeingReplaced;
let squareIdBeingReplaced;

/**
 * * Checking after creating a board is done in order to ensure that there are no 
 * * valid rows or collumns
 */
function createBoard(){
  for (let i = 0; i <width*width; i++) {
    const square = document.createElement("div");
    square.setAttribute("draggable", "true");
    square.setAttribute("class", "square");
    square.setAttribute("id", i); 

    let randomColor = Math.floor(Math.random() * candyColors.length)
    square.style.backgroundColor = candyColors[randomColor].color;
    square.innerHTML = candyColors[randomColor].tag;
    grid.appendChild(square);
    squares.push(square);
  }
  scoreHolder.innerHTML = "Score: " + score;
}
createBoard();
checkRow();
checkColumn();


/**
 * Initialize drag API
 */
squares.forEach(square => square.addEventListener("dragstart", dragStart)); 
squares.forEach(square => square.addEventListener("dragend", dragEnd)); 
squares.forEach(square => square.addEventListener("dragover", dragOver)); 
squares.forEach(square => square.addEventListener("dragenter", dragEnter)); 
squares.forEach(square => square.addEventListener("dragleave", dragLeave)); 
squares.forEach(square => square.addEventListener("drop", dragDrop));

function dragStart(){
  colorBeingDragged = this.style.backgroundColor;  
  tagBeingDragged = this.innerHTML;
  squareIdBeingDragged = parseInt(this.id);
}

/**
 * ? Also sometimes diagonal moves are possible
 * ? don't really know why and how to replicate them consistently
 * ? update to above comment: didn't find any issiues lately :thinking:
 * TODO: Deal with above bugs
 */

/**
 * * dragEnd prevents user from moving differently than just one left, right, up or down.
 * * If yes squareIdBeingReplaced is nulled so it is ready for next call, then
 * * dragDrop is called.
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
    squares[squareIdBeingReplaced].innerHTML = tagBeingReplaced;
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
    squares[squareIdBeingDragged].innerHTML = tagBeingDragged;

  } 
  checkRow();
  checkColumn(); 
}

/**
 * /////* Correct if statement below because it looks funny.
 * * This function also check if move that is to be done results in breaking block of candies
 * * Firstly it perform move, then checks if block is able to break. If yes, block is broken
 * * and game is ready to continue. If not, move is reversed which blocks player from making such move.
 */
function dragDrop(){
  colorBeingReplaced = this.style.backgroundColor;
  tagBeingReplaced = this.innerHTML; 
  squareIdBeingReplaced = parseInt(this.id);
  squares[squareIdBeingDragged].style.backgroundColor = colorBeingReplaced;
  squares[squareIdBeingDragged].innerHTML = tagBeingReplaced;
  this.style.backgroundColor = colorBeingDragged;
  this.innerHTML = tagBeingDragged;

  if(!(checkRowThree() || checkColumnThree())){
    this.style.backgroundColor = colorBeingReplaced;
    this.innerHTML = tagBeingReplaced;
    squares[squareIdBeingDragged].style.backgroundColor = colorBeingDragged;
    squares[squareIdBeingDragged].innerHTML = tagBeingDragged;
  }
}

function dragOver(e){ e.preventDefault(); }
function dragEnter(e){ e.preventDefault(); }
function dragLeave(){}

/**
 * * Dropping candies is performed once in 150 ms. One call of moveDown 
 * * moves the candies one row down. If there is no room to move 
 * * function just does nothing apart from checking if there are any breakable blocks.
 * * Second if is responsible for generating new candies if there is the space for them.
 * * If yes then blocks are broken and score is updated. 
 */
function moveDown(){
  for(let i = 0; i < 56; i++){
    if(squares[i + width].style.backgroundColor === ""){
      squares[i + width].style.backgroundColor = squares[i].style.backgroundColor;
      squares[i + width].innerHTML = squares[i].innerHTML
      squares[i].style.backgroundColor = "";
      squares[i].innerHTML = "";
    }
    const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
    const isFirstRow = firstRow.includes(i)
    if(isFirstRow && squares[i].style.backgroundColor === ""){
      randomNumber = Math.random()
      squares[i].style.backgroundColor = candyColors[Math.floor(randomNumber * candyColors.length)].color;
      squares[i].innerHTML = candyColors[Math.floor(randomNumber * candyColors.length)].tag;
    }
  }
  if(squares.every(index => !(index.style.backgroundColor === "") )){
    checkRow();
    checkColumn(); 
    scoreHolder.innerHTML = "Score: " + score;
    
  }
}
/**
 * * Checking for matches is based upon the element background color
 * * It is fine but consider using "data" html field.
 * TODO: strong refactor
 * * Code below needs some strong refactoring. Too much functions. Reduce them to max 2 functions.
 * * One to check for rows and one for collumns.
 * * Make more readable and better code.
 * * Remember that functions checkRowThree and checkColumnThree are used to chech if move 
 * * resolves in breaking block of candies. 
 * * Other functions are just for checking if such blocks exists.
 * * Primarly i did it because those functions were not returning anything and i needed bolean value.
 * * notValid array is there to ensure that no blocks are valid if block breaks in another row.
 * // Function chcecks for match even where row breaks to next row
 * //TODO: Repair checking 
 **/
function checkRowThree(){
  for (let i = 0; i <= 61; i++){
    let rowOfThree = [i, i + 1, i + 2];
    let decidedColor = squares[i].style.backgroundColor;
    const isBlank = squares[i].style.backgroundColor === "";

    const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
    if (notValid.includes(i)) continue;
    if (rowOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank )){
      return true;
    }
  }
  return false;
}
function checkColumnThree() {
  for (i = 0; i < 48; i ++) {
    let columnOfThree = [i, i+width, i+width*2];
    let decidedColor = squares[i].style.backgroundColor;
    const isBlank = squares[i].style.backgroundColor === '';

    if(columnOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
      return true;
    }
  }
  return false;
}
function checkRow(){
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
        squares[index].innerHTML = "";
      })
    }
  }
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
        squares[index].innerHTML = "";
      })
    }
  }
}
function checkColumn(){
  for (let i = 0; i <= 39; i++){
    let columnOfFour = [i, i + width, i + width*2, i + width*3];
    let decidedColor = squares[i].style.backgroundColor;
    const isBlank = squares[i].style.backgroundColor === "";
    
    if (columnOfFour.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank )){
      score += 4;
      columnOfFour.forEach(index => {
        squares[index].style.backgroundColor = "";
        squares[index].innerHTML = "";
      })
    }
  }
  for (i = 0; i < 48; i ++) {
    let columnOfThree = [i, i+width, i+width*2];
    let decidedColor = squares[i].style.backgroundColor;
    const isBlank = squares[i].style.backgroundColor === '';

    if(columnOfThree.every(index => squares[index].style.backgroundColor === decidedColor && !isBlank)) {
      score += 3;
      columnOfThree.forEach(index => {
        squares[index].style.backgroundColor = ''
        squares[index].innerHTML = "";
      })
    }
  }
}

 setInterval(() => {
    moveDown();
}, 100)