// *****************************************************
// Welcome to Hangman Fighter! Please keep the volume up 
// as this game does have sound effects.
// *****************************************************

///////////////
//PSEUDOCODE//
///////////////
/*
-Ask user to enter a letter.
-Check user input to make sure it is a single letter.
-If the letter has already been chosen, print a message to let the
user know and have them select another letter.
-If the letter matches one of the letters in our chosen word, fill
in a blank and give the list of guesses to user. Otherwise, print a
body part to the screen.
-Continue this until either the user guesses wrongly 6 times or
the user fills in all the blanks.
*/

let words = [
	'hey',
	'person',
	'you',
	'think',
	'youre',
	'better',
	'than',
	'me',
	'round',
	'one',
	'congratulations'
];

let answer; 
let nWrong;
let pastGuesses = [];
let rightGuesses;			//Used to count against the length of the answer.
let pastGames = [];
let guessesRemaining;		//The number of guesses remaining.
let totalHealth1;
let totalHealth2;

//Constructor function for GameStats
function GameStats(decision, guessList, guessAmount) {
	this.decision = decision;
	this.guessList = guessList; 
	this.guessAmount = guessAmount;
}

//This function is the main function for the logic in the game.
//It calls functions to check the status of the game and to end
//the game when it is time.
function guessALetter() {
	const guess = $('#userinput').val();
	$('#userinput').val('');

	let repeat = false;			//Resets repeat flag on each loop.
	let answerFound = false;	//Flag to proceed with a correct guess.

	//Uses regex to look for the strings given (case insensitive)
	//due to the "i".
	if (/[a-z]/i.test(guess)) {
		
		//Check for length of string.
		if (guess.length <= 1) {
			//Checks for past guesses.
			for (let i=0; i < pastGuesses.length; i++) {
				if (guess === pastGuesses[i]) {
					$('#prompts').html('You already guessed that letter.');
					repeat = true;
				};
			};

			//Process this section if the guess is not repeated.
			if (repeat === false) {	
				pastGuesses.push(guess);

				//Goes through answer string to check if guess is correct.
				for (let i=0; i < answer.length; i++) {
					if (answer[i] === guess) {
						answerFound = true;
					}
				}

				//Displays messages to let user know about their guess.
				if (answerFound === true) {
					for (let i=0; i < answer.length; i++) {
						if (guess === answer[i]) {
							rightGuesses++;
						}	
					}
					$('#prompts').html('You got a letter!');
					kenAnimation();
				}
				else {
					nWrong++;
					$('#prompts').html('Sorry, that letter is not in the word.');
					ryuAnimation();
				}
			};
		}
		else {	
			$('#prompts').html('Sorry, your guess isn\'t valid. Please use a single character.');
		}
	}
	else {
		$('#prompts').html('Sorry, your guess isn\'t valid. Please use characters eg. a, E, k, etc.');
	}

	printGameState();

	if (checkGameOver()) {
		endGame();
	}

} //guessALetter

//This function displays animations for the user's character and updates
//status to screen.
function kenAnimation() {

	//Ken animates fireball
	$('.kenIdle').attr('src','./Images/Ken-hadouken.jpg');
	$('#kensound')[0].play();
	$('.fireball').css('visibility','visible');
	$('.fireball').animate({'marginLeft':'+=30%'}, 500, () => {
		//Ryu animates getting hit
		totalHealth2 = 100 - (100*(rightGuesses/answer.length));
		$('.ryuIdle').attr('src','./Images/Ryu-hit.gif');
		$('#health2').attr('value',totalHealth2);
		
		//Reset animations and prompts after a set amount of time.
		setTimeout(() => {
			$('.ryuIdle').attr('src','./Images/Ryu-idle.gif');
			$('#prompts').html('Please enter a letter in the box below:');

			//Sets victory sounds and resets pose if game is over
			if (answer.length === rightGuesses) {
				$('.ryuIdle').attr('src','./Images/Ryu-fall.gif');
				
				//Plays sound effects for winning
				$('#yousound')[0].play();
				setTimeout(() => {
					$('#winsound')[0].play();
				}, 700);
				if (nWrong === 0) {
					setTimeout(() => {
						$('#perfectsound')[0].play();
					}, 1500);
				}
			}
			else {
				$('.ryuIdle').attr('src','./Images/Ryu-idle.gif');
			}
		}, 1500);
		
		//Reset and hide fireball
		$('.fireball').css({'visibility':'hidden','marginLeft':'-=30%'});
		$('.kenIdle').attr('src','./Images/Ken-idle.webp');
		
	});

} //kenAnimation

//This function displays animations for the opponent's character and
//updates status to screen.
function ryuAnimation() {
	//Ryu animates hurricane kick
	$('.ryuIdle').attr('src','./Images/Ryu-kick.gif');
	$('#ryusound')[0].play();
	
	//Ken animates getting hit
	$('.kenIdle').attr('src','./Images/Ken-hit.gif');
	$('#health1').attr('value',totalHealth1 -= (100*(1/6)));
	
	//Reset images
	setTimeout(() => {
		$('.kenIdle').attr('src','./Images/Ken-idle.webp');
		$('.ryuIdle').attr('src','./Images/Ryu-idle.gif');
		$('#prompts').html('Please enter a letter in the box below:');
		
		//Sets losing pose if game is over
		if (nWrong === 6) {
			$('.kenIdle').attr('src','./Images/Ken-fall.gif');
			$('#yousound')[0].play();
			setTimeout(() => {
				$('#losesound')[0].play();
			}, 700);
			
			
		}
		else {
			$('.kenIdle').attr('src','./Images/Ken-idle.webp');
		}
	}, 1500);

} //ryuAnimation

///This function starts the game and prompts the user to take a
//guess.
function startGame() {

	$('#startsound')[0].play();
	
	setUpGame();
	printGameState();

	//Updates the prompt section of html to display message to the
	//user.
	$('#prompts').html('Please enter a letter in the box below:');
	
	//This prevents the user from pressing enter to refresh the page.
	//13 refers to the enter key.
	$('#userinput').keydown((e) => {
		if (e.which === 13) {
			e.preventDefault();
		}
	});

	//Click event handler which controls most of the logic in the
	//game.
	$('#guess').click(() => {
		guessALetter();
	}) 
	
} //end startGame

//This function checks for the end of game conditions and writes out
//the status to the screen if the game is over.
function checkGameOver(){
	if (nWrong >= 6) {
		$('.status').html('YOU LOSE!');
		
		//.join(' '); joins the items in the array with a specified separator
		//which is nothing in this case.
		$('.status').append('<br />The answer is: '+answer.join(' ')+'<br />');
		
		//Add the stats of the game to an array of objects.
		pastGames.push(new GameStats('lose', pastGuesses, pastGuesses.length));
		return true;
	}
	else if (answer.length === rightGuesses) {
		$('.status').html('YOU WIN!');
		if (nWrong === 0) {
			$('.status').append('<br />PERFECT!<br />');
		}
		
		//Add the stats of the game to an array of objects.
		pastGames.push(new GameStats('win', pastGuesses, pastGuesses.length));
		return true;
	}
	else {
		return false;
	}

} //checkGameOver

//This function prints the current game state.
function printGameState(){

	if (nWrong < 6) {
		$('.status').html('Here are your previous guesses: ');
		$('.status').append('<br />'+pastGuesses+'<br />');
		$('.status').append('You have ' + (guessesRemaining - nWrong) + ' guesses left.');
	}

	console.log('\n');
	let str = "";
	
	//Clear the blanks on the page for reset
	$('.blanks').html('');
	// for each letter in the target word
	for(let i = 0; i < answer.length; i++){
		let found = false;
		// loop through the pastGuesses
		for(let j = 0; j < pastGuesses.length; j++){
			// and check each element of past guesses to see if it matches the
			if(answer[i] === pastGuesses[j]){
				found = true;
			}
		}
		if(found){
			str += answer[i];
			str += "\t";
		}
		else{
			str += "_\t";
		}
	}
	//Prints blanks to screen
	$('.blanks').append(str);

} //printGameState

//This function gets a random word from the words array.
function getRandomWord(){
	const index = Math.floor(Math.random()*words.length);
	return words[index];
}

//This function sets up a new game.
function setUpGame(){

	answer = getRandomWord().split('');		//Choose a new word.
	nWrong = 0;								//Reset the total of wrong guesses.
	pastGuesses = []; 						//Empty our array of previously guessed letters.
	guessesRemaining = 6;					//Reset number of guesses remaining.
	rightGuesses = 0;						//Right guesses.
	totalHealth1 = 100;						//Reset health bar 1.
	totalHealth2 = 100;						//Reset health bar 2.

	//Make startGame fields appear
	$('#continueprompts').css('display','none');
	$('#prompts').css('display','block')
	
	
	$('#continuebutton').css('display','none');
	$('#guess').css('display','block');
	
	$('#userinput').css('display','block');
	$('#continueinput').css('display','none');

	//Reset images
	$('.kenIdle').attr('src','./Images/Ken-idle.webp');
	$('.ryuIdle').attr('src','./Images/Ryu-idle.gif');
	$('#health1').attr('value',totalHealth1);
	$('#health2').attr('value',totalHealth2);

	//This line stops the click event handler from creating
	//a new one and returning empty guesses from the 
	//stack (from what I can tell).
	$('#guess').off('click');

} //setupGame

//This function prints the end results for the game.
function endGame() {

		//Hides prompt field, button, and input and reveals the end game ones.
		$('#continueprompts').html('Next Round? y/n');
		$('#continueprompts').css('display','block');
		$('#prompts').css('display','none')
		
		$('#continuebutton').css('display','block');
		$('#guess').css('display','none');
		
		$('#continueinput').css('display','block');
		$('#userinput').css('display','none');

		//Click event handler to handle a new round or exiting.
		$('#continuebutton').click(() => {
			if ($('#continueinput').val().toLowerCase() === 'y') {
				$('#continueinput').val('');	//Clear field
				
				startGame();
			}
			else if ($('#continueinput').val().toLowerCase() === 'n') {
				$('#continueinput').val('');	//Clear field

				//Hide the current screen display info.
				$('#newchallengesound')[0].play();
				$('#continueprompts').css('display','none');
				$('#continuebutton').css('display','none');
				$('#continueinput').css('display','none');
				$('.blanks').css('display','none');
				$('.kenIdle').css('display','none');
				$('.ryuIdle').css('display','none');
				$('#health1').css('display','none');
				$('#health2').css('display','none');
			

				//Print out the game stats for the user.
				$('.status').html('Scoreboard: <br />');
				$('.status').css('font-size','1.2em');

				for (let i=0; i < pastGames.length; i++) {
					$('.status').append('<br />Game: '+(i+1));
					$('.status').append('<br />Decision: '+pastGames[i].decision);
					$('.status').append('<br />List of Guesses: '+pastGames[i].guessList);
					$('.status').append('<br />Amount of Guesses: '+pastGames[i].guessAmount+'<br />');
				}	
			}
			else {
				$('#continueprompts').html('Please enter either y (yes) or n (no).');
			}
		});

} //endGame

$(document).ready(() => {
	//Starts the game for the first time. Afterwards, startGame is
	//called from endGame should the player continue.
	startGame();
});
