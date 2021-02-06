const { Graph, astar } = require("../public/astar/astar.js")
let fs = require('fs')

let inputData;
let inputFormat = [];
let worldGrid = [];
fs.readFile('../public/data_files/robotrecovery3.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    inputData = data;
    solveProblem();
})

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function solveProblem() {
    inputFormat = inputData.split("\n")
    let fLine = inputFormat[0].split(" ").map(x => parseInt(x))
    let r, c, n;
    r = fLine[0];
    c = fLine[1];
    n = fLine[2];
    inputFormat.shift();
    let exit = {}
    let robots = [];
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
                    tPt.push(1)
                    robots.push({ r: i, c: j })
                    break;
                case "E":
                    tPt.push(1)
                    exit = { r: i, c: j }
                    break;
            }
        }
        worldGrid.push(tPt);
    }
    //console.log(robots, exit)
    //robots.sort((a, b) => Math.hypot(a.r - exit.r, a.c - exit.c) - Math.hypot(b.r - exit.r, b.c - exit.c))
    //shuffle(robots);
    //console.log(robots, exit)
    let solution = "";
    let prev;
    while (robots.length !== 0) {
        console.log(robots.length);
        let tempDir = {
            R: 0,
            L: 0,
            U: 0,
            D: 0
        }
        let tX;
        robots.forEach(x => {
            tX == null ? tX = pathFind(x, exit) : null;
            tempDir[tX[0]] += 1 / tX[1]
        })
        if (prev != null) {
            if (prev == "R") {
                tempDir["L"] = -1;
            } else if (prev == "L") {
                tempDir["R"] = -1;
            } else if (prev == "U") {
                tempDir["D"] = -1;
            } else if (prev == "D") {
                tempDir["U"] = -1;
            }
        }
        let tSolution = robots.length > 2 ? Object.keys(tempDir).reduce(function (a, b) { return tempDir[a] > tempDir[b] ? a : b }) : tX[0];
        prev = tSolution;
        solution += tSolution;
        //robots.shift();
        for (let j = 0; j < tSolution.length; j++) {
            switch (tSolution) {
                case "R":
                    for (let k = 0; k < robots.length; k++) {
                        if (robots[k].c + 1 < c && worldGrid[robots[k].r][robots[k].c + 1] == 1) {
                            robots[k].c += 1
                            if (robots[k].c == exit.c && robots[k].r == exit.r) {
                                robots.splice(k, 1);
                                k--
                            }
                        }
                    }
                    break;
                case "L":
                    for (let k = 0; k < robots.length; k++) {
                        if (robots[k].c - 1 >= 0 && worldGrid[robots[k].r][robots[k].c - 1] == 1) {
                            robots[k].c -= 1
                            if (robots[k].c == exit.c && robots[k].r == exit.r) {
                                robots.splice(k, 1);
                                k--
                            }
                        }
                    }
                    break;
                case "U":
                    for (let k = 0; k < robots.length; k++) {
                        if (robots[k].r - 1 >= 0 && worldGrid[robots[k].r - 1][robots[k].c] == 1) {
                            robots[k].r -= 1
                            if (robots[k].c == exit.c && robots[k].r == exit.r) {
                                robots.splice(k, 1);
                                k--
                            }
                        }
                    }
                    break;
                case "D":
                    for (let k = 0; k < robots.length; k++) {
                        if (robots[k].r + 1 < r && worldGrid[robots[k].r + 1][robots[k].c] == 1) {
                            robots[k].r += 1
                            if (robots[k].c == exit.c && robots[k].r == exit.r) {
                                robots.splice(k, 1);
                                k--
                            }
                        }
                    }
                    break;
                default:
                    console.log("wtf");
            }
        }
    }
    fs.writeFile("../public/newsolutions.txt", solution, (err) => {
        if (err) throw err;
        console.log(solution.length);
        console.log('The file has been saved!');
    })
}


function pathFind(initial, target) {

    let graph = new Graph(worldGrid);
    let start = graph.grid[initial.r][initial.c];
    let end = graph.grid[target.r][target.c];
    let result = astar.search(graph, start, end);

    for (let i = 0; i < result.length; i++) {
        result[i] = { r: result[i].x, c: result[i].y }
    }
    result.unshift(initial);
    let str = "";
    let t0 = result[0]
    let t1 = result[1]
    let horz = t1.c - t0.c
    let vert = t1.r - t0.r
    if (horz != 0) {
        if (horz == 1) {
            return ["R", result.length]
        } else {
            return ["L", result.length];
        }
    } else {
        if (vert == 1) {
            return ["D", result.length];
        } else {
            return ["U", result.length];
        }
    }
    // let usefulInfo = []
    // for (let i = 0; i < result.length; i++) {
    //     usefulInfo.push({ x: result[i].x, y: result[i].y })
    // }
    // usefulInfo.length !== 0 ? humanObj.curPath = usefulInfo : humanObj.curTask === "goHomeF" ? humanObj.curTask = "wanderF" : humanObj.curTask = "none";
}

