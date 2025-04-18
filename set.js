// TODO
// add timer
// add end screen
// add play again
// custom color scheme
// custom shape scheme
// tailwind

// what about just having a hashSet of all 81 tiles that we pull from instead of dynamically generating them
//  that's how the real game works with cards

/*
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
            tiles.push([i, j, k])
        }
    }
}

alternatively

for (let i = 0; i < 81; i++) {
    tiles.push([i / 27, i / 9, i /3]);
}

alternatively (probably cleanest one but not readable at all)

let tiles = Array.from((x, i) => [i / 27, i / 9, i /3]);
*/
class Tile {
    constructor(color, number, shape, shading) {
      this.color = color;
      this.number = number;
      this.shape = shape;
      this.shading = shading;
      this.selected = false;
    }
}

const Colors1 = {
    0: "rgb(255,0,200)",
    1: "rgb(150,150,250)",
    2: "rgb(50,237,110)"
};

const Colors2 = {
    0: "rgb(150,200,0)",
    1: "rgb(255,150,0)",
    2: "rgb(0,100,250)"
};

let Colors = Colors1;

const Shapes = {
    0: "squiggle",
    1: "pill",
    2: "diamond"
};

const Shading = {
    0: "hollow",
    1: "lines",
    2: "filled"
};

let theme = "light";

let score = 0;
let scoreboard = document.getElementById('scoreboard');
// // scoreboard.style.display = 'block';
// scoreboard.style.margin = 'auto';

const canvas = document.getElementById("main-canvas");
canvas.style.border = 'none';
canvas.style.outline = 'none';
canvas.style.display = 'block';
canvas.style.margin = 'auto';
const ctx = canvas.getContext("2d");

let baseTileWidth = 200;
let baseDropShadowWidth = 215;

let baseTileHeight = 150;
let baseDropShadowHeight = 165;

let tileXOffset = 40;
let tileYOffset = 50;
let dropShadowXOffset = 35;
let dropShadowYOffset = 45;

let setExists = false;
let tiles = [];
let numTilesSelected = 0;

while (!setExists) {
    let tileSet = new Set();
    for (let i = 0; i < 12; i++) {
        let inserted = false;
        while (!inserted) {
            let tile = generateTilePossiblyDuplicate();
            if (tileSet.has(tile)) {
                continue;
            }
            tileSet.add(tile);
            inserted = true;
        }
    }

    tileSet.forEach(x => tiles.push(JSON.parse(x)));
    //check if at least one set exists in 12 tiles
    for (let i = 0; i < 10; i++) {
        let tile1 = tiles[i];
        for (let j = i + 1; j < 11; j++) {
            let tile2 = tiles[j];
            for (let k = j + 1; k < 12; k++) {
                // alternatively, hash what the third set should be and check for it in the set
                let tile3 = tiles[k];

                if (threeTilesAreSet(tile1, tile2, tile3)) {
                    continue;
                }

                setExists = true;
                break;
            }
        }
    }
}

// findAtLeastOneSetIn12Tiles(tiles) {

// }



drawTiles();

function drawTile(i, tile) {
    let x = 240 * (i%4);
    let y = 200 * Math.floor(i / 4);
    let tileHeight = tile.selected ? baseTileHeight * 0.9 : baseTileHeight;
    let tileWidth = tile.selected ? baseTileWidth * 0.9 : baseTileWidth;
    let dropShadowHeight = tile.selected ? baseDropShadowHeight * 0.9 : baseDropShadowHeight;
    let dropShadowWidth = tile.selected ? baseDropShadowWidth * 0.9 : baseDropShadowWidth;

    // clear the canvas
    ctx.fillStyle = theme == "dark" ? "rgb(50,50,50)" : "white";
    ctx.beginPath();
    ctx.roundRect(x + dropShadowXOffset, y + dropShadowYOffset, baseDropShadowWidth, baseDropShadowHeight, 25);
    ctx.fill();

    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.beginPath();
    ctx.roundRect(x + dropShadowXOffset, y + dropShadowYOffset, dropShadowWidth, dropShadowHeight, 25);
    ctx.fill();

    ctx.fillStyle = theme == "dark" ? "rgb(50,50,50)" : "white";
    ctx.beginPath();
    ctx.roundRect(x + tileXOffset, y + tileYOffset, tileWidth, tileHeight, 20);
    ctx.fill();

    // color
    ctx.fillStyle = Colors[tile.color];
    ctx.strokeStyle = Colors[tile.color];
    ctx.lineWidth = 3;

    let tileX = x + tileXOffset + tileWidth / 2;
    let tileY = y + tileYOffset + tileHeight / 2;

    let shape = Shapes[tile.shape];
    let shading = Shading[tile.shading];
    
    // shape
    switch (tile.number) {
        case 1:
            drawShape(tileX, tileY, shape, shading)
            break;
        case 2:
            drawShape(tileX + 25, tileY, shape, shading)
            drawShape(tileX - 25, tileY, shape, shading)
            break;
        case 3:
            drawShape(tileX, tileY, shape, shading);
            drawShape(tileX + 50, tileY, shape, shading);
            drawShape(tileX - 50, tileY, shape, shading);
            break;
        default:
            break;     
    }
}

function drawTiles(){
    ctx.fillStyle = theme == "dark" ? "rgb(50,50,50)" : "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    for (let i = 0; i < 12; i++) {
        drawTile(i, tiles[i])
    }
}

function drawShape(x, y, shape, shading) {
    switch (shape) {
        case "diamond":
            drawDiamond(x, y, shading)
            break;
        case "pill":
            ctx.beginPath();
            ctx.roundRect(x - 20, y - 37, 40, 75, 25);
            shade(shading);
            break;
        case "squiggle":
            drawSquiggle(x, y, shading)
            break;
        default:
            ctx.beginPath();
            ctx.fillRect(x, y, 50, 50);
            break;
    }
}

function drawDiamond(x, y, shading) {
    ctx.beginPath();
    ctx.moveTo(x, y - 41);
    ctx.lineTo(x + 22, y);
    ctx.lineTo(x, y + 41);
    ctx.lineTo(x - 22, y);
    ctx.closePath();

    shade(shading);
}

function drawSquiggle(squiggleX, squiggleY, shading) {
    let size = 39;
    let x = squiggleX - (size * 3 / 10);
    let y = squiggleY - size;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + size, y, x + (size * 3 / 4), y + (size * 3 / 4));
    ctx.quadraticCurveTo(x + (size / 2), y + (size * 27 / 20), x + (size * 3 / 4), y + (size * 17 / 10));
    ctx.quadraticCurveTo(x + size, y + size * 2, x + (size * 3 / 5), y + size * 2);
    ctx.quadraticCurveTo(x - (size * 2 / 5), y + size * 2, x - (size * 3 / 20), y + (size * 5 / 4));
    ctx.quadraticCurveTo(x + (size * 1 / 10), y + (size * 13 / 20), x - (size * 3 / 20), y + (size * 3 / 10));
    ctx.quadraticCurveTo(x - (size * 2 / 5), y, x, y);
    
    shade(shading);
}

function shade(shading) {
    switch (shading){
        case "hollow":
            ctx.stroke();
            break;
        case "lines":
            ctx.save();
            // ctx.closePath();
            ctx.stroke();
            ctx.clip();
            ctx.lineWidth = 2;
            for (let i = -2000; i < 2000; i = i + 12) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + 1000, 800);
                ctx.stroke();
                ctx.closePath();
            }
            ctx.restore();
            break;
        case "filled":
            ctx.fill();
            break;
        default:
            break;
    }
}

function generateTilePossiblyDuplicate() {
    return JSON.stringify(new Tile(
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 3) + 1,
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 3)
    ));
}

// maybe tiles should just be tuples. easier logic but harder readability there. easier readability here though...
function generateThirdTileGivenTwoTiles(tile1, tile2) {
    let set = [0, 1, 2];
    let numberSet = [1, 2, 3];
    let tile3 = new Tile();

    for (const attribute in tile1) {
        if (tile1.hasOwnProperty(attribute) && tile2.hasOwnProperty(attribute)) {
            if (tile1[attribute] == tile2[attribute]) {
                tile3[attribute] = tile1[attribute];
            } else {
                if (attribute == "number") {
                    tile3[attribute] = numberSet.filter(a => ![tile1[attribute], tile2[attribute]].includes(a))[0];
                } else {
                    tile3[attribute] = set.filter(a => ![tile1[attribute], tile2[attribute]].includes(a))[0];
                }
            }
        }
    }

    return tile3;
}

function threeTilesAreSet (tile1, tile2, tile3) {
    if (
    (new Set([tile1.color, tile2.color, tile3.color])).size == 2 ||
    (new Set([tile1.number, tile2.number, tile3.number])).size == 2 ||
    (new Set([tile1.shading, tile2.shading, tile3.shading])).size == 2 ||
    (new Set([tile1.shape, tile2.shape, tile3.shape])).size == 2
    ) {
        return false
    }

    return true;
}

function setTheme () {
    var checkbox = document.getElementById('dark-mode-toggle');
    if (checkbox.checked) {
	    theme = "dark";
    }else{
	    theme = "light";
    }
    document.body.style.backgroundColor = theme == "dark" ? "rgb(50,50,50)" : "white";
    drawTiles();
}

function setColors (colorsSet) {
    switch(colorsSet) {
        case '1':
            Colors = Colors1;
            break;
        case '2':
            Colors = Colors2;
            break;
        //   case 'option3':
        //     option3Func();
        //     break;
        default:
            console.log('Unknown option selected');
            break;
    }
    drawTiles();
}

canvas.addEventListener('click', function(event) {
    const x = event.offsetX;
    const y = event.offsetY;
  
    let i = -1;
    if (  0 + tileYOffset < y && y <   0 + tileYOffset + baseTileHeight) { i = 0; }
    if (200 + tileYOffset < y && y < 200 + tileYOffset + baseTileHeight) { i = 4; }
    if (400 + tileYOffset < y && y < 400 + tileYOffset + baseTileHeight) { i = 8; }
  
    if (  0 + tileXOffset < x && x <   0 + tileXOffset + baseTileWidth)  { i += 0; }
    if (240 + tileXOffset < x && x < 240 + tileXOffset + baseTileWidth)  { i += 1; }
    if (480 + tileXOffset < x && x < 480 + tileXOffset + baseTileWidth)  { i += 2; }
    if (720 + tileXOffset < x && x < 720 + tileXOffset + baseTileWidth)  { i += 3; }
  
    if (0 <= i && i < 12) {
      if (tiles[i].selected) {
          tiles[i].selected = false;
          numTilesSelected -= 1;
      } else if (numTilesSelected < 3) {
          tiles[i].selected = true;
          numTilesSelected += 1;
      }
      drawTile(i, tiles[i]);
  
      if (numTilesSelected == 3) {
          // let selectedTiles = [];
          let selectedIndices = [];
          for (let i = 0; i < 12; i++) {
              let tile = tiles[i];
  
              if (tile.selected) {
                  // selectedTiles.add(tile);
                  selectedIndices.push(i);
              }
          }
  
          let tileSet = new Set();
          tiles.forEach(tile => tileSet.add(JSON.stringify(tile)));
  
          let selectedTiles = Array.from(selectedIndices, i => tiles[i])
  
          // when we generate a new 3 tiles, should I just guarantee one tile is a set then make random?
          if (threeTilesAreSet(...selectedTiles)) {
              score += 1;
              scoreboard.textContent = score;

              selectedIndices.forEach(i => {
                  tiles[i] = new Tile();
                  tileSet[i] = "";
  
                  //guarantee that the third tile of the 3 new tiles is settable
                  if (selectedIndices.indexOf(i) == 2) {
                      let randomTileIndex1 = Math.floor(Math.random()*12);
                      let randomTileIndex2;
                      do {
                          randomTileIndex2 = Math.floor(Math.random()*12);
                      } while (randomTileIndex2 == randomTileIndex1);
  
                      let inserted = false;
                      while (!inserted) {
                          let newTile = generateThirdTileGivenTwoTiles(tiles[randomTileIndex1], tiles[randomTileIndex2]);
                          if (tileSet.has(newTile)) {
                              continue;
                          }
                          // this newTile might be a duplicate
                          console.log(newTile);
  
                          tileSet[i] = JSON.stringify(newTile);
                          tiles[i] = newTile;
                          inserted = true;
                      }
                  } else {
                      let inserted = false;
                      while (!inserted) {
                          let newTile = generateTilePossiblyDuplicate();

                          // IT's BECAUSE IT"S INCLUDING SELECTED
                          if (tileSet.has(newTile)) {
                              continue;
                          }
  
                          tileSet[i] = newTile;
                          tiles[i] = JSON.parse(newTile);
                          
                          inserted = true;
                      }
                  }
  
                  drawTile(i, tiles[i]);
              });
          } else {
              selectedIndices.forEach(i => {
                  tiles[i].selected = false;
                  drawTile(i, tiles[i]);
              })
          }
          numTilesSelected = 0;
      }
    }
  });
  
  document.querySelectorAll('input[name=\'colors\']').forEach((radio) => {
    radio.addEventListener('click', (event) => {
      if (event.target.checked) {
        setColors(event.target.value);
      }
    });
  });