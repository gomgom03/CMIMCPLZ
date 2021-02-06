const { Graph, astar } = require("../public/astar/astar.js")
let fs = require('fs')

let inputData;
let inputFormat = [];
let worldGrid = [];
fs.readFile('../public/data_files/robotrecovery5.txt', 'utf8', (err, data) => {
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
    console.log(n, robots.length)
    //console.log(robots, exit)

    //shuffle(robots);
    //console.log(robots, exit)
    //robots.reverse();
    //lonely if open plane
    //not lonely if the 1path stuck maze
    let solution = "";

    let lonelyRobots = [];
    let maxInitialPath = 200;
    // robots.sort((a, b) => pathLength(a, exit) - pathLength(b, exit));
    // sortRobotsPL();
    // for (let i = 0; i < robots.length; i++) {
    //     let t = pathLength(robots[i], exit);
    //     console.log(t + "/")
    //     if (t < maxInitialPath) {
    //         let tSolution = pathFind(robots[0], exit)
    //         solution += tSolution;
    //         robots.shift();
    //         for (let j = 0; j < tSolution.length; j++) {
    //             moveRobots(tSolution[j])
    //         }
    //     } else {
    //         break;
    //     }
    // }

    //robots.sort((a, b) => -pathLength(a, exit) + pathLength(b, exit));
    //robots.sort((a, b) => -pathLength(a, exit) + pathLength(b, exit));
    while (robots.length !== 0) {
        sortRobotsPL();
        console.log(robots.length, lonelyRobots.length)
        if (robots.length == 1) {
            lonelyRobots.unshift(robots.pop());
            break;
        }
        let tSolution;
        //robots.sort((a, b) => -pathLength(a, exit) + pathLength(b, exit));
        let curRobot1 = robots[0];
        let curRobot2 = robots[1];
        if (pathLength(curRobot1, curRobot2) < pathLength(curRobot2, exit)) {
            while (true) {
                tSolution = pathFind(curRobot1, curRobot2);
                if (tSolution !== "") {
                    solution += tSolution;
                    for (let j = 0; j < tSolution.length; j++) {
                        moveRobots(tSolution[j])
                    }
                }
                if (curRobot1.r === curRobot2.r && curRobot1.c === curRobot2.c) {
                    robots.shift();
                    break;
                }
            }
        } else {
            lonelyRobots.unshift(robots.shift());
        }
    }

    while (lonelyRobots.length !== 0) {
        let tSolution = pathFind(lonelyRobots[0], exit)
        solution += tSolution;
        lonelyRobots.shift();
        for (let j = 0; j < tSolution.length; j++) {
            moveRobots(tSolution[j])
        }
    }

    function sortRobotsPL() {
        for (let i = 0; i < robots.length; i++) {
            robots[i].pl = pathLength(robots[i], exit)
            console.log("pl robot " + i)
        }
        robots.sort((a, b) => -a.pl + b.pl);
    }

    function moveRobots(e) {
        switch (e) {
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
                for (let k = 0; k < lonelyRobots.length; k++) {
                    if (lonelyRobots[k].c + 1 < c && worldGrid[lonelyRobots[k].r][lonelyRobots[k].c + 1] == 1) {
                        lonelyRobots[k].c += 1
                        if (lonelyRobots[k].c == exit.c && lonelyRobots[k].r == exit.r) {
                            lonelyRobots.splice(k, 1);
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
                for (let k = 0; k < lonelyRobots.length; k++) {
                    if (lonelyRobots[k].c - 1 >= 0 && worldGrid[lonelyRobots[k].r][lonelyRobots[k].c - 1] == 1) {
                        lonelyRobots[k].c -= 1
                        if (lonelyRobots[k].c == exit.c && lonelyRobots[k].r == exit.r) {
                            lonelyRobots.splice(k, 1);
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
                for (let k = 0; k < lonelyRobots.length; k++) {
                    if (lonelyRobots[k].r - 1 >= 0 && worldGrid[lonelyRobots[k].r - 1][lonelyRobots[k].c] == 1) {
                        lonelyRobots[k].r -= 1
                        if (lonelyRobots[k].c == exit.c && lonelyRobots[k].r == exit.r) {
                            lonelyRobots.splice(k, 1);
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
                for (let k = 0; k < lonelyRobots.length; k++) {
                    if (lonelyRobots[k].r + 1 < r && worldGrid[lonelyRobots[k].r + 1][lonelyRobots[k].c] == 1) {
                        lonelyRobots[k].r += 1
                        if (lonelyRobots[k].c == exit.c && lonelyRobots[k].r == exit.r) {
                            lonelyRobots.splice(k, 1);
                            k--
                        }
                    }
                }
                break;
            default:
                console.log("wtf");
        }
    }



    fs.writeFile("../public/newsolutions.txt", solution, (err) => {
        if (err) throw err;
        console.log(solution.length)
        console.log('The file has been saved!');
    })
}

function pathLength(initial, target) {
    let graph = new Graph(worldGrid);
    let start = graph.grid[initial.r][initial.c];
    let end = graph.grid[target.r][target.c];
    let result = astar.search(graph, start, end);
    return result.length;
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
    for (let i = 0; i < result.length - 1; i++) {
        let t0 = result[i]
        let t1 = result[i + 1]
        let horz = t1.c - t0.c
        let vert = t1.r - t0.r
        if (horz != 0) {
            if (horz == 1) {
                str += "R"
            } else {
                str += "L"
            }
        } else {
            if (vert == 1) {
                str += "D"
            } else {
                str += "U"
            }
        }
    }
    return str
    // let usefulInfo = []
    // for (let i = 0; i < result.length; i++) {
    //     usefulInfo.push({ x: result[i].x, y: result[i].y })
    // }
    // usefulInfo.length !== 0 ? humanObj.curPath = usefulInfo : humanObj.curTask === "goHomeF" ? humanObj.curTask = "wanderF" : humanObj.curTask = "none";
}

