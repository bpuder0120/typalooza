$(function(){
  $("body").keydown(function(e) { keyHandler(e) });
  gameOver = true;
});

//stops letter creation/movement
function endGame() {
  clearInterval(tileMovement);
  clearInterval(tileCreation);
  gameOver = true;
  $("#message-text").text("Game Over! Press the SPACE bar to start over.")
}

//setup all intial variables and start tile movement/creation
function initializeGame() {
  $("#message-text").html("Type the letters before they reach the red line. Press ESC to end game.");
  $(".letter-tile").remove();
  lettersInPlay = [];
  gameOver = false;
  tileId = 0;
  score = 0;
  $("#numeric-score").html(score);
  gameBoxWidth = parseInt($("#game-box").css("width"));
  letterTileWidth = 48;
  speed = 5;
  tileMovement = setInterval(function(){ moveTiles() }, 50);
  tileCreation = setInterval(function(){ randomLetter() }, 1000);
}

function keyHandler(e) {
  //escape key pressed
  if (e.keyCode == 27) {
    $(".letter-tile").remove();
    endGame();
  //space bar pressed
  } else if (e.keyCode == "32" && gameOver) {
    initializeGame();
  //any other key pressed
  } else {
    var letter = String.fromCharCode(e.keyCode);
    var index = lettersInPlay.indexOf(letter);
    //incorrect letter
    if ( index == -1) {
      $("#message-text").text(letter + " is not on the board! -1 point")
      $("#message-text").css("color", "red");
      score--;
      $("#numeric-score").html(score);
      setTimeout(function(){
        $("#message-text").text("Type the letters before they reach the red line.");
        $("#message-text").css("color", "black");
      }, 2000);
    } else {
      lettersInPlay.splice(index, 1);
      removeLetter(letter);
    }
  }
}

//decrease speed by 10% after every 20 correct guesses
function decreaseSpeed() {
  speed = speed * 0.9;
}

function removeLetter(letter) {
  if (gameOver) return;
  score++;
  if (score % 20 == 0) decreaseSpeed();
  var $letter = $(".letter-" + letter).first();
  var id = $letter.attr("id");

  //doesn't display letter tile
  move("#" + id)
    .set('display', 'none')
    .duration('1s')
    .end()

  //letter tile content replaced/restyled with +1 for correct guess
  $letter.find(".letter").text("+1").css("color", "black");
  $letter.css({"background-color" : "white", "border" : "0px solid white", "color" : "black"})

  // +1 displayed after correct guess
  move("#" + id)
    .set('display', 'block')
    .duration('1s')
    .end()

  //score updated and letter tile removed from DOM
  $("#numeric-score").html(score);
  setTimeout(function(){
    $(".letter-" + letter).first().remove();
  }, 300);

}

//move all tiles
function moveTiles() {
  $.each($(".letter-tile"), function(i, tile){
    moveTile(tile);
  });
}

//move a particular tile
function moveTile(tile){
  //find existing margin, letter, and id
  var leftMargin = parseInt($(tile).css('margin-left'));
  var letter = $(tile).last().attr("class").split(" ")[1];
  var id = parseInt($(tile).last().attr("id").split("-")[1]);

  //check to see if tile is already at the end of the game-box. Initially set at 5px per 50ms, of 10px per 100ms
  if (leftMargin < (gameBoxWidth - letterTileWidth)) {
    move("#tile-" + id)
      .add('margin-left', speed)
      .duration('0s')
      .end(); 
  } else {
    move("#tile-" + id)
      .set('background-color', 'red')
      .duration('1s')
      .end();

    $(".letter-tile").not("#tile-" + id).remove();
    endGame();    
  }
}

//choosed a random letter and places it in a random location within the game-box
function randomLetter(){
  tileId += 1
  var letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  var left = Math.floor(Math.random() * 300);
  var top = Math.floor(Math.random() * (500 - letterTileWidth));
  $tile = $("<div id='tile-" + tileId + "' class='letter-tile letter-" + letter.toUpperCase() + "'/>").append($("<div class='letter'>" + letter.toUpperCase() + "</div>"));
  $tile.css({"margin-left" : left + "px", "margin-top" : top + "px"});
  lettersInPlay.push(letter.toUpperCase());
  $("#game-box").append($tile);
}

          