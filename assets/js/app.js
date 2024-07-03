document.addEventListener('DOMContentLoaded', function() {
    const guessContainer = document.getElementById('guess-container');
    const resultSection = document.getElementById('result-section');
    const buttonsGrid = document.getElementById('buttons-grid');
    const clearBtn = document.getElementById('clear-btn');
    const timerContainer = document.createElement('div'); // Ajouter un conteneur pour le minuteur
    timerContainer.id = 'timer-container';
    timerContainer.style.fontSize = '20px';
    timerContainer.style.marginBottom = '10px';
    document.querySelector('.container').insertBefore(timerContainer, resultSection);

    let secretCode = generateSecretCode(3); // Start with 3-digit code
    let currentGuess = [];
    let attemptCount = 0;
    const maxAttempts = 6;
    let level = 1;
    let timer;
    let timeLeft;
    let timerStarted = false;

    // Generate a random code with specified number of digits (numbers 1-9)
    function generateSecretCode(digits) {
        let code = [];
        for (let i = 0; i < digits; i++) {
            code.push(Math.floor(Math.random() * 9) + 1);
        }
        return code;
    }

    // Create number buttons
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    numbers.forEach(num => {
        let button = document.createElement('button');
        button.textContent = num === 0 ? '0' : num;
        button.addEventListener('click', function() {
            if (currentGuess.length < secretCode.length) {
                currentGuess.push(num);
                updateGameSection();
            }
        });
        buttonsGrid.appendChild(button);
    });

    // Add event listener to clear button
    clearBtn.addEventListener('click', function() {
        if (currentGuess.length > 0) {
            currentGuess.pop();
            updateGameSection();
        }
    });

    // Function to start the timer
    function startTimer() {
        timeLeft = 30; // 30 seconds for level 2
        timerContainer.textContent = `Temps restants: ${timeLeft} secondes`;
        timer = setInterval(function() {
            timeLeft--;
            timerContainer.textContent = `Temps restants: ${timeLeft} secondes`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                revealSecret();
                resetGame();
            }
        }, 1000);
    }

    // Function to update game section with current guess
    function updateGameSection() {
        guessContainer.innerHTML = '';
        currentGuess.forEach(num => {
            let numberDiv = document.createElement('div');
            numberDiv.classList.add('number');
            numberDiv.textContent = num;
            guessContainer.appendChild(numberDiv);
        });

        // Start the timer if it's level 2 and the timer hasn't started yet
        if (level === 2 && !timerStarted) {
            startTimer();
            timerStarted = true;
        }
        
        if (currentGuess.length === secretCode.length) {
            let result = checkGuess(currentGuess);
            showResult(result);

            // Check if the guess is correct
            if (result.every(color => color === 'green')) {
                alert(`Félicitations! Vous avez trouvé le code secret : ${secretCode.join('')}`);
                if (level === 1) {
                    level++;
                    alert('Passons au niveau 2!');
                    resetGame(false, 3); // 3-digit code for level 2
                } else if (level === 2) {
                    level++;
                    alert('Passons au niveau 3! Vous devez maintenant trouver 4 chiffres.');
                    resetGame(false, 4); // 4-digit code for level 3
                } else if (level === 3) {
                    alert('Vous avez réussi le niveau 3!');
                    resetGame(true); // Reset the game completely after level 3
                } else {
                    alert('Vous avez réussi tous les niveaux!');
                    resetGame(true);
                }
            } else {
                attemptCount++;
                if (attemptCount >= maxAttempts) {
                    revealSecret();
                    resetGame(true);
                }
            }

            currentGuess = []; // Reset current guess for next round
            guessContainer.innerHTML = ''; // Clear the guess container
        }
    }

    // Function to check the guess and provide feedback
    function checkGuess(guess) {
        let result = [];
        let unmatchedSecret = [...secretCode]; // Copy of secretCode array

        // Check for exact matches (green)
        for (let i = 0; i < secretCode.length; i++) {
            if (guess[i] === secretCode[i]) {
                result[i] = 'green';
                unmatchedSecret[i] = null; // Mark matched positions in secretCode
            }
        }

        // Check for presence in secretCode (orange)
        for (let i = 0; i < secretCode.length; i++) {
            if (result[i] !== 'green' && unmatchedSecret.includes(guess[i])) {
                result[i] = 'orange';
                unmatchedSecret[unmatchedSecret.indexOf(guess[i])] = null; // Mark matched values
            }
        }

        // Fill remaining with red if no matches found
        for (let i = 0; i < secretCode.length; i++) {
            if (!result[i]) {
                result[i] = 'red';
            }
        }

        return result;
    }

    // Function to display result
    function showResult(result) {
        const attemptDiv = document.createElement('div');
        attemptDiv.classList.add('attempt');

        currentGuess.forEach((num, index) => {
            let numberDiv = document.createElement('div');
            numberDiv.classList.add('number');
            numberDiv.style.backgroundColor = getColor(result[index]); // Définir la couleur en fonction de la valeur de résultat
            numberDiv.textContent = num;
            attemptDiv.appendChild(numberDiv);
        });

        resultSection.insertBefore(attemptDiv, resultSection.firstChild); // Ajouter la nouvelle tentative en haut
    }

    // Function to determine color based on result value
    function getColor(result) {
        if (result === 'green') {
            return 'green';
        } else if (result === 'orange') {
            return 'orange';
        } else {
            return 'red';
        }
    }

    // Function to reveal the secret code
    function revealSecret() {
        alert('Le code secret était : ' + secretCode.join(''));
    }

    // Function to reset the game
    function resetGame(fullReset = true, digits = 3) {
        clearInterval(timer); // Clear the timer if reset
        secretCode = generateSecretCode(digits);
        currentGuess = [];
        attemptCount = 0;
        resultSection.innerHTML = ''; // Clear previous attempts
        guessContainer.innerHTML = ''; // Clear current guess
        timerStarted = false; // Reset timerStarted
        if (fullReset) {
            level = 1;
            timerContainer.textContent = ''; // Clear timer display
        } else {
            timerContainer.textContent = ''; // Clear timer display for non-full reset
        }
    }

    // Modal functionality
    const modal = document.getElementById('rules-modal');
    const helpIcon = document.getElementById('help-icon');
    const closeBtn = document.getElementById('close-btn');

    // When the user clicks on the help icon, open the modal
    helpIcon.onclick = function() {
        modal.style.display = 'block';
    }

    // When the user clicks on the close button, close the modal
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});
