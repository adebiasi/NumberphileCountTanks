let allTanks;
let foundTanks;
let maxTankId;
let y, minX, maxX, deltaX;
let estimate, estimateX;
let realTotTanks, maxValue;

let numEstimatedValueWins, numLastTankIdWin;
let numSimulationsLeft;

let simulationButton;
let interactiveButton;
let resultLabel, descLabel;

let imgTank;
let imgTankBlack;

let diffEstimate,diffLastTank;
const minPossibleTanks = 40;
const maxPossibleTanks = 200;
const totSimulations = 200;

function reset() {
    allTanks = [];
    foundTanks = [];
    maxTankId = 0;
    estimate = 0;
    maxValue = 0;
    realTotTanks = floor(random(minPossibleTanks, maxPossibleTanks));

    for (let i = 1; i <= realTotTanks; i++) {
        allTanks.push(i);
    }
    redraw();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    y = height / 2;
    deltaX = 100;
    minX = 50;
    maxX = width - deltaX;
    textAlign(CENTER, CENTER);
    numEstimatedValueWins = 0;
    numLastTankIdWin = 0;

    descLabel = createDiv('');
    descLabel.position(150, 20);
    descLabel.style('font-size', '18px');
    descLabel.html("What is the best way to estimate the number of tanks? Simply taking the max tank id or performing the formula m+m/k-1?<br>The number of tanks to find is randomly generated in a range between "+minPossibleTanks+" and "+maxPossibleTanks+" each simulation. ");


    resetButton = createButton('Reset');
    resetButton.position(150, 70);
    resetButton.mousePressed(reset);

    interactiveButton = createButton('Interactive step');
    interactiveButton.position(150, 110);
    interactiveButton.mousePressed(interactiveStep);

    simulationButton = createButton("Perform "+totSimulations+" simulations");
    simulationButton.position(150, 150);
    simulationButton.mousePressed(startSimulation);

    resultLabel = createDiv('');
    resultLabel.position(150, 190);
    resultLabel.style('font-size', '18px');

    imgTank = loadImage('tank.png');
    imgTankBlack = loadImage('tank_black.png');
    reset();
}

function draw() {

    console.log("draw")

    if (numSimulationsLeft > 0) {
        resultLabel.html("");

        simulate();
        numSimulationsLeft--;
        loop();
        resultLabel.html("# Simulation with m+m/k-1 closer to the real # of tanks: " + numEstimatedValueWins + "<br># Simulation with last tank id closer to the real # of tanks: " + numLastTankIdWin);

    } else {
        noLoop();
    }

    background(255);
    fill(0);
    stroke(0);
    line(minX, y - 25, minX, y + 25)
    line(minX, y, maxX, y)

    for (let i = 0; i < foundTanks.length; i++) {

        textSize(22);
        let idTank = foundTanks[i].idTank;
        let x = map(idTank, 0, maxValue, minX, maxX);
        // fill(255, 0, 0);
        // ellipse(x, y, 50, 50);
        if (maxTankId == idTank) {
            textSize(32);
            line(x, y - 10, x, y - 70)
            fill(0);
            stroke(255);
            text("max tank id", x, y - 100);
            if (diffEstimate > diffLastTank) {
                text("closer!", x, y - 150);
            }
            fill(255);
            stroke(0);
            image(imgTank, x + 40, y + 30, -80, -80);
        } else {
            fill(0);
            stroke(0);
            image(imgTankBlack, x + 40, y + 30, -80, -80);
        }

        text(idTank, x, y);
    }

    textSize(32);

    estimateX = map(estimate, 0, maxValue, minX, maxX);
    line(estimateX, y - 10, estimateX, y - 70)
    fill(0);
    stroke(255);
    text(estimate, estimateX, y);
    text("estimated \n# of tanks", estimateX, y - 100);
    if (diffEstimate < diffLastTank) {
        console.log("diffEstimate < diffLastTank")

        console.log("diffEstimate: "+diffEstimate)
        console.log("diffLastTank: "+diffLastTank)
        text("closer!", estimateX, y - 150);
    }

    realTotTanksX = map(realTotTanks, 0, maxValue, minX, maxX);
    textStyle(BOLD);
    text(realTotTanks, realTotTanksX, y);
    fill(255);
    stroke(0);
    line(realTotTanksX, y + 10, realTotTanksX, y + 70)
    fill(0);
    stroke(255);
    text("real #\nof tanks", realTotTanksX, y + 100);
    textStyle(NORMAL);

}

function step() {
    let idTank;

    if (allTanks.length > 0) {
        let index = floor(random(allTanks.length));
        idTank = allTanks[index];
        allTanks.splice(index, 1);
    } else {
        console.log("No more tanks");
    }

    maxTankId = max(idTank, maxTankId);
    foundTanks.push({idTank: idTank});
    estimate = estimateNumTanks()
    maxValue = max(estimate, realTotTanks)
    redraw();

}

function estimateNumTanks() {
    return floor(maxTankId + (maxTankId / foundTanks.length) - 1);
}

function checkResult() {

    diffEstimate = abs(estimate - realTotTanks);
    diffLastTank = abs(maxTankId - realTotTanks);

    console.log("estimate: "+estimate)
    console.log("realTotTanks: "+realTotTanks)
    console.log("maxTankId: "+maxTankId)
    console.log("diffEstimate: "+diffEstimate)
    console.log("diffLastTank: "+diffLastTank)
}

function interactiveStep() {
    step();
    checkResult();
    redraw();
}

function updateResultLabel() {
    if (diffEstimate < diffLastTank) {
        numEstimatedValueWins++;
    } else if (diffEstimate > diffLastTank) {
        numLastTankIdWin++;
    }
}

function simulate() {
    reset();
    let numTanskToFind = floor(random(realTotTanks));
    for (let i = 0; i < numTanskToFind; i++) {
        step();
    }
    checkResult();
    updateResultLabel();
}


function startSimulation() {
    resultLabel.html("");
    numEstimatedValueWins = 0;
    numLastTankIdWin = 0;
    reset();

    numSimulationsLeft = totSimulations;
    redraw();
}
