let fs = require('fs')

let inputData;
fs.readFile(__dirname + '/solutions.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    inputData = data;
    let abcd = inputData.split("\n");
    abcd.forEach(element => {
        console.log(element.length);
    });
})