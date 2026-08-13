let runs = 0;
let wickets = 0;
let balls = 0;

let innings = 1;
let target = 0;

let matchStarted = false;
let matchFinished = false;

let striker = {
    name: "Rahul",
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0
};

let nonStriker = {
    name: "Rohit",
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0
};

let ballHistory = [];


// START MATCH
function startMatch() {

    striker.name =
        document.getElementById("strikerName").value || "Rahul";

    nonStriker.name =
        document.getElementById("nonStrikerName").value || "Rohit";

    document.getElementById("teamDisplay").textContent =
        document.getElementById("teamName").value || "India";

    document.getElementById("bowlerDisplay").textContent =
        document.getElementById("bowlerName").value || "Bowler";

    document.getElementById("strikerDisplay").textContent =
        striker.name;

    document.getElementById("nonStrikerDisplay").textContent =
        nonStriker.name;

    matchStarted = true;

    updateDisplay();
}


// ADD RUNS
function addRuns(value) {

    if (!matchStarted || matchFinished) {
        alert("Please start the match first.");
        return;
    }

    runs += value;
    balls++;

    striker.runs += value;
    striker.balls++;

    if (value === 4) {
        striker.fours++;
    }

    if (value === 6) {
        striker.sixes++;
    }

    ballHistory.push({
        result: value,
        batsman: striker.name,
        type: "run"
    });

    // Change strike after 1 or 3 runs
    if (value === 1 || value === 3) {
        swapStrike();
    }

    // Change strike after every completed over
    if (balls % 6 === 0) {
        swapStrike();
    }

    checkTarget();

    updateDisplay();
}


// ADD WICKET
function addWicket() {

    if (!matchStarted || matchFinished) {
        alert("Please start the match first.");
        return;
    }

    if (wickets >= 10) {
        alert("All wickets have fallen.");
        return;
    }

    let dismissal =
        document.getElementById("dismissalType").value;

    let newName =
        document.getElementById("newBatsman").value.trim();

    if (newName === "") {
        alert("Enter the new batsman's name.");
        return;
    }

    wickets++;
    balls++;

    striker.balls++;

    ballHistory.push({
        result: "W",
        batsman: striker.name,
        dismissal: dismissal,
        type: "wicket"
    });

    // New batsman replaces the dismissed striker
    striker = {
        name: newName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0
    };

    document.getElementById("newBatsman").value = "";

    if (balls % 6 === 0) {
        swapStrike();
    }

    if (wickets === 10) {
        endInnings();
        return;
    }

    updateDisplay();
}


// CHANGE STRIKE
function swapStrike() {

    let temp = striker;

    striker = nonStriker;

    nonStriker = temp;
}


// UPDATE EVERYTHING ON SCREEN
function updateDisplay() {

    document.getElementById("runs").textContent = runs;

    document.getElementById("wickets").textContent = wickets;

    let completedOvers = Math.floor(balls / 6);

    let remainingBalls = balls % 6;

    document.getElementById("overs").textContent =
        completedOvers + "." + remainingBalls;


    // RUN RATE
    let runRate = 0;

    if (balls > 0) {
        runRate = runs / (balls / 6);
    }

    document.getElementById("runRate").textContent =
        runRate.toFixed(2);


    // BATSMEN
    document.getElementById("strikerDisplay").textContent =
        striker.name;

    document.getElementById("strikerRuns").textContent =
        striker.runs;

    document.getElementById("strikerBalls").textContent =
        striker.balls;

    document.getElementById("strikerFours").textContent =
        striker.fours;

    document.getElementById("strikerSixes").textContent =
        striker.sixes;


    document.getElementById("nonStrikerDisplay").textContent =
        nonStriker.name;

    document.getElementById("nonStrikerRuns").textContent =
        nonStriker.runs;

    document.getElementById("nonStrikerBalls").textContent =
        nonStriker.balls;

    document.getElementById("nonStrikerFours").textContent =
        nonStriker.fours;

    document.getElementById("nonStrikerSixes").textContent =
        nonStriker.sixes;


    updateHistory();

    updateTarget();
}


// BALL HISTORY
function updateHistory() {

    let historyElement =
        document.getElementById("historyList");

    historyElement.innerHTML = "";

    if (ballHistory.length === 0) {

        historyElement.textContent =
            "No balls recorded yet.";

        return;
    }

    ballHistory.forEach(function(ball) {

        let span = document.createElement("span");

        span.className = "ball";

        if (ball.type === "wicket") {

            span.classList.add("wicket-ball");

            span.textContent =
                "W - " + ball.dismissal;

        } else {

            span.textContent =
                ball.result;
        }

        historyElement.appendChild(span);
    });
}


// SECOND INNINGS / TARGET
function checkTarget() {

    if (innings === 2 && runs >= target) {

        matchFinished = true;

        document.getElementById("resultBox")
            .classList.remove("hidden");

        document.getElementById("resultText").textContent =
            "🏆 " +
            document.getElementById("teamDisplay").textContent +
            " won the match!";
    }
}


// UPDATE TARGET
function updateTarget() {

    if (innings === 2) {

        document.getElementById("targetBox")
            .classList.remove("hidden");

        document.getElementById("target").textContent =
            target;

        let remaining = Math.max(target - runs, 0);

        document.getElementById("runsNeeded").textContent =
            remaining;

    } else {

        document.getElementById("targetBox")
            .classList.add("hidden");
    }
}


// END INNINGS
function endInnings() {

    if (!matchStarted) {
        alert("Start the match first.");
        return;
    }

    if (innings === 1) {

        target = runs + 1;

        innings = 2;

        runs = 0;
        wickets = 0;
        balls = 0;

        ballHistory = [];

        striker = {
            name: "New Striker",
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0
        };

        nonStriker = {
            name: "New Batsman",
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0
        };

        document.getElementById("inningsDisplay").textContent =
            "2nd Innings";

        document.getElementById("strikerName").value = "";

        document.getElementById("nonStrikerName").value = "";

        alert("2nd innings started! Target: " + target);

        updateDisplay();

    } else {

        matchFinished = true;

        document.getElementById("resultBox")
            .classList.remove("hidden");

        if (runs === target - 1) {

            document.getElementById("resultText").textContent =
                "Match tied!";

        } else {

            document.getElementById("resultText").textContent =
                "🏆 First innings team won by " +
                (target - 1 - runs) +
                " runs.";
        }
    }
}


// RESET MATCH
function resetMatch() {

    location.reload();
}