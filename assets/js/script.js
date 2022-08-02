var startBtn = document.querySelector("#start_btn"); // take a css style element selector
var timerEl = document.querySelector("#timer");
var containerEl = document.querySelector("#container");
var infoEl = document.querySelector("#info");
var goBackEl = document.querySelector("#go-back");
var clearScoresEl = document.querySelector("#clear-scores");
var highScoresListEl = document.querySelector("#highscores");
var viewScoresEl = document.querySelector("#view-scores");
var highScoresEl = document.querySelector("#high-score");
var correctWrongEl = document.querySelector("#correctWrong");


var quiz_titleEl = document.querySelector("#quiz_title");
var rulesEl = document.querySelector("#rules");


var timer = 75;
var timerInterval;
var currentQuestionIndex = 0;


var highScoreEl = document.querySelector("#high-score");
highScoreEl.style.display = 'none'; // do not display until it is needed



var questions = [
    {
        question: "Commonly used data types Do Not include:",
        options: ["1. Strings", "2. Booleans", "3. Alerts", "4. Numbers"],
        answer: "3. Alerts"
    },
    {
        question: "The condition in an if/else statement is enclosed with __________.",
        options: ["1. Quotes", "2. Curly brackets", "3. Parenthesis", "4. Square brackets"],
        answer: "3. Parenthesis"
    },
    {
        question: "Arrays in JavaScript can be used to store __________.",
        options: ["1. Numbers and strings", "2. Other arrays", "3. Booleans", "4. All of the above"],
        answer: "4. All of the above"
    },
    {
        question: "String values must be enclosed within __________ when being assigned to variables.",
        options: ["1. Commas", "2. Curly brackets", "3. Quotes", "4. Parenthesis"],
        answer: "3. Quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        options: ["1. JavaScript", "2. Terminal/bash", "3. For loops", "4. Console log"],
        answer: "4. Console log"
    }
];


startBtn.addEventListener("click", function() {     // event listener for start button
    timerEl.textContent = timer

    renderCurrentQuestion();

    timerInterval = setInterval(function() {    // when "start quiz" is clicked, the timer starts
        timer--;                                // 1 sec is subtracted from timer
        timerEl.textContent = timer;

        if (timer <= 0) {  
            allDone ();
            containerEl.innerHTML = "You ran out of time! ";
        }
    }, 1000);
});


function renderCurrentQuestion() {

    infoEl.innerHTML = " "; //removes "info" at the beginning of quiz
    
    containerEl.innerHTML = " ";   //removes contents of previous question
    
    var currentQuestion = questions[currentQuestionIndex];


    var header = document.createElement("h3");           // creates element/space for question (exists in js)
    header.textContent = currentQuestion.question;       // set element text to the question
    containerEl.appendChild(header);                     //insert element back into actual page
    

    var ulEl = document.createElement("ul");

    for (var i = 0; i < currentQuestion.options.length; i++) {
        var liEl = document.createElement("li");          
        liEl.textContent = currentQuestion.options[i];
        ulEl.appendChild(liEl);
    }
    containerEl.appendChild(ulEl);

};



// when answers are selected:
containerEl.addEventListener("click", function(event) {
    if (event.target.matches('li')) {
        var currentQuestion = questions[currentQuestionIndex];

        var userGuess = event.target.textContent;
        console.log(userGuess);

        if (userGuess !== currentQuestion.answer) {
            timer-=10;                                      // -10s for wrong answer 
            timerEl.textContent = timer;
            correctWrongEl.textContent = "Wrong!";          // "wrong" prompt
            console.log("Wrong!");
            
            if (timer<=0) {
                allDone(); 
            }


        } else {
            correctWrongEl.textContent = "Correct!";        // "correct" promt
            console.log("Correct!");
        }


        correctWrongEl.classList.remove("hidden");      //wrong/correct prompts disappear in 1s
        setTimeout(function(){
            correctWrongEl.setAttribute("class", "hidden")
        },1000);

        currentQuestionIndex++;
        
        if (questions.length>currentQuestionIndex) { // quiz is finished
            renderCurrentQuestion();
        }else {
            allDone(); 
        }
    }
    
}); 

function allDone(){
    clearInterval(timerInterval); // stops the timer when the last question as answered
    containerEl.textContent=" "; //clear content for container

    var allDone = containerEl.appendChild(document.createElement('h3')); //create h3 element and append in container
    allDone.textContent="All Done!";

    var score = containerEl.appendChild(document.createElement("p"));//create p element and append to container
    score.textContent="Your final score is " + timer;

    var enterInitials = containerEl.appendChild(document.createElement("form"));
    enterInitials.textContent="Enter your initials:"

    var input = containerEl.appendChild(document.createElement("input"));
    var submitButton = containerEl.appendChild(document.createElement("button"));
    submitButton.textContent = "Submit";

    
    submitButton.addEventListener("click", function() {
        var initials = input.value.trim();

        if (initials !== ""){
            var scores = JSON.parse(localStorage.getItem("scores")) || []; //save scores in local storage
            var newScore = {
                score: timer, initials:initials
            }
            scores.push(newScore)
            localStorage.setItem("scores", JSON.stringify(scores));

            containerEl.innerHTML = " ";
            renderHighScores();
        }

    });

}

function renderHighScores() {                   // high score list
    highScoreEl.style.display = "block";

    var scores = JSON.parse(localStorage.getItem("scores")) || [];
    var highscores = document.querySelector("#highscores");
    scores.sort(function(a,b){                  // list scores in descending order
        return b.score - a.score
    })

    for (var i = 0; i < scores.length; i++){
        var liEl = document.createElement("li");          
        liEl.textContent = scores[i].initials + ' - ' + scores[i].score;
        highscores.appendChild(liEl);
    }
}


goBackEl.addEventListener("click", () => {  // go to the beginning of the quiz
    window.location.reload();
});


clearScoresEl.addEventListener("click", function() {  //clears scores from local storage
    window.localStorage.clear();
    highScoresListEl.innerHTML = " ";
});


viewScoresEl.addEventListener("click", function() { // display the scores
    infoEl.style.display = 'none';
    containerEl.style.display = 'none';
    renderHighScores();
});
