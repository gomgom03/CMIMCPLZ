function doGET(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            // The request is done; did it work?
            if (xhr.status == 200) {
                // ***Yes, use `xhr.responseText` here***
                callback(xhr.responseText);
            } else {
                // ***No, tell the callback the call failed***
                callback(null);
            }
        }
    };
    xhr.open("GET", path);
    xhr.send();
}

function handleFileData(fileData) {
    if (!fileData) {
        // Show error
        return;
    }
    inputData = fileData;
    solveProblem();
    // Use the file data
}

// Do the request
doGET("./data_files/robotrecovery1.txt", handleFileData);


let inputData;
let inputFormat = [];
let worldGrid = [];


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
    shuffle(robots);
    //console.log(robots, exit)
    let solution = "";
    while (robots.length !== 0) {
        let tSolution = pathFind(robots[0], exit)
        solution += tSolution;
        robots.shift();
        for (let j = 0; j < tSolution.length; j++) {
            switch (tSolution[j]) {
                case "R":
                    for (let k = 0; k < robots.length; k++) {
                        if (robots[k].c + 1 < c && worldGrid[robots[k].r][robots[k].c + 1] == 1) {
                            robots[k].c += 1
                        }
                        if (robots[k].c == exit.c && robots[k].r == exit.r) {
                            robots.splice(k, 1);
                        }
                    }
                    break;
                case "L":
                    for (let k = 0; k < robots.length; k++) {
                        if (robots[k].c - 1 >= 0 && worldGrid[robots[k].r][robots[k].c - 1] == 1) {
                            robots[k].c -= 1
                        }
                        if (robots[k].c == exit.c && robots[k].r == exit.r) {
                            robots.splice(k, 1);
                        }
                    }
                    break;
                case "U":
                    for (let k = 0; k < robots.length; k++) {
                        if (robots[k].r - 1 >= 0 && worldGrid[robots[k].r - 1][robots[k].c] == 1) {
                            robots[k].r -= 1
                        }
                        if (robots[k].c == exit.c && robots[k].r == exit.r) {
                            robots.splice(k, 1);
                        }
                    }
                    break;
                case "D":
                    for (let k = 0; k < robots.length; k++) {
                        if (robots[k].r + 1 < r && worldGrid[robots[k].r + 1][robots[k].c] == 1) {
                            robots[k].r += 1
                        }
                        if (robots[k].c == exit.c && robots[k].r == exit.r) {
                            robots.splice(k, 1);
                        }
                    }
                    break;
            }
        }
    }
    console.log(solution)
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

