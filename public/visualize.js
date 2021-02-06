let counterh1 = document.getElementById("counter");

function doGET(path, callback, option) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // The request is done; did it work?
            if (xhr.status == 200) {
                // ***Yes, use `xhr.responseText` here***
                callback(xhr.responseText, option);
            } else {
                // ***No, tell the callback the call failed***
                callback(null);
            }
        }
    };
    xhr.open("GET", path);
    xhr.send();
}
let inputData;
let graphData;
let sSize = 2;
function handleFileData(fileData, option) {
    if (!fileData) {
        // Show error
        return;
    }
    if (option == 0) {
        inputData = fileData;
    } else {
        graphData = fileData;
    }
    // Use the file data
}

// Do the request
doGET("./newsolutions.txt", handleFileData, 1);
let dataFile = 6;
doGET(`./data_files/robotrecovery${dataFile}.txt`, handleFileData, 0);
let inputFormat;
let worldGrid = [];
let tInterval = setInterval(solveProblem, 500)
let curIter = 0;
let r, c, n;
let exit;
let robots = [];
function solveProblem() {
    if (inputData != null && graphData != null) {
        clearInterval(tInterval);
        inputFormat = inputData.split("\n")
        let fLine = inputFormat[0].split(" ").map(x => parseInt(x))

        r = fLine[0];
        c = fLine[1];
        n = fLine[2];

        inputFormat.shift();


        //0 empty 1 wall 2 robot 3 entrance
        for (let i = 0; i < r; i++) {
            let tLine = inputFormat[i];
            let tPt = [];
            for (let j = 0; j < c; j++) {
                switch (tLine[j]) {
                    case ".":
                        tPt.push(1)
                        break;
                    case "X":
                        tPt.push(0)
                        break;
                    case "R":
                        robots.push(new component(1, 1, "blue", i * 1, j * 1))
                        tPt.push(1)
                        break;
                    case "E":
                        exit = (new component(1, 1, "red", i * 1, j * 1))
                        tPt.push(1)
                        break;
                }
            }
            worldGrid.push(tPt);
        }
        myGameArea.start();
    }
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = r * sSize;
        this.canvas.height = c * sSize;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1);
        this.canvas.offscreenCanvas = document.createElement('canvas');
        this.canvas.offscreenCanvas.width = this.canvas.width;
        this.canvas.offscreenCanvas.height = this.canvas.height;
        let tCtx = this.canvas.offscreenCanvas.getContext("2d");
        for (let i = 0; i < worldGrid.length; i++) {
            for (let j = 0; j < worldGrid[i].length; j++) {
                if (worldGrid[i][j] == 1) {
                    tCtx.fillStyle = "white";
                } else {
                    tCtx.fillStyle = "black";
                }
                tCtx.fillRect(i * sSize, j * sSize, sSize, sSize);
            }
        }
        this.context.drawImage(this.canvas.offscreenCanvas, 0, 0);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.width = width * sSize;
    this.height = height * sSize;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x * sSize, this.y * sSize, this.width, this.height);
    }
}

function updateGameArea() {

    myGameArea.clear();
    counterh1.textContent = curIter
    myGameArea.context.drawImage(myGameArea.canvas.offscreenCanvas, 0, 0);
    if (graphData.length > curIter) {
        switch (graphData[curIter]) {
            case "R":
                for (let k = 0; k < robots.length; k++) {
                    if (robots[k].y + 1 < c && worldGrid[robots[k].x][robots[k].y + 1] == 1) {
                        robots[k].y += 1
                        if (robots[k].y == exit.y && robots[k].x == exit.x) {
                            robots.splice(k, 1);
                            k--
                        }
                    }

                }
                break;
            case "L":
                for (let k = 0; k < robots.length; k++) {
                    if (robots[k].y - 1 >= 0 && worldGrid[robots[k].x][robots[k].y - 1] == 1) {
                        robots[k].y -= 1
                        if (robots[k].y == exit.y && robots[k].x == exit.x) {
                            robots.splice(k, 1);
                            k--
                        }
                    }
                }
                break;
            case "U":
                for (let k = 0; k < robots.length; k++) {
                    if (robots[k].x - 1 >= 0 && worldGrid[robots[k].x - 1][robots[k].y] == 1) {
                        robots[k].x -= 1
                        if (robots[k].y == exit.y && robots[k].x == exit.x) {
                            robots.splice(k, 1);
                            k--
                        }
                    }
                }
                break;
            case "D":
                for (let k = 0; k < robots.length; k++) {
                    if (robots[k].x + 1 < r && worldGrid[robots[k].x + 1][robots[k].y] == 1) {
                        robots[k].x += 1
                        if (robots[k].y == exit.y && robots[k].x == exit.x) {
                            robots.splice(k, 1);
                            k--
                        }
                    }
                }
                break;
        }
    }
    curIter++
    robots.forEach(x => x.update())
    exit.update();
    //myGamePiece.update();
}
