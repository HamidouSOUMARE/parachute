document.addEventListener('DOMContentLoaded', function() {
  const guessContainer = document.getElementById('guess-container');
  const resultSection = document.getElementById('result-section');
  const buttonsGrid = document.getElementById('buttons-grid');
  const clearBtn = document.getElementById('clear-btn');

  let secretCode = generateSecretCode();
  let currentGuess = [];
  let attemptCount = 0;
  const maxAttempts = 6;

  // Generate a random 3-digit code (numbers 1-9)
  function generateSecretCode() {
      let code = [];
      for (let i = 0; i < 3; i++) {
          code.push(Math.floor(Math.random() * 9) + 1);
      }
      console.log(code);
      return code;
  }

  // Create number buttons
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  numbers.forEach(num => {
      let button = document.createElement('button');
      button.textContent = num === 0 ? '0' : num;
      button.addEventListener('click', function() {
          if (currentGuess.length < 3) {
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

  // Function to update game section with current guess
  function updateGameSection() {
      guessContainer.innerHTML = '';
      currentGuess.forEach(num => {
          let numberDiv = document.createElement('div');
          numberDiv.classList.add('number');
          numberDiv.textContent = num;
          guessContainer.appendChild(numberDiv);
      });
      
      if (currentGuess.length === 3) {
          let result = checkGuess(currentGuess);
          showResult(result);

          // Check if the guess is correct
          if (result.every(color => color === 'green')) {
              alert('Félicitations! Vous avez trouvé le code secret : ' + secretCode.join(''));
              window.location.href = 'https://youtu.be/loZeThClpmo'; // Redirection vers YouTube
              return; // Stop further execution
          } else {
              attemptCount++;
              if (attemptCount >= maxAttempts) {
                  revealSecret();
                  resetGame();
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
      for (let i = 0; i < 3; i++) {
          if (guess[i] === secretCode[i]) {
              result[i] = 'green';
              unmatchedSecret[i] = null; // Mark matched positions in secretCode
          }
      }

      // Check for presence in secretCode (orange)
      for (let i = 0; i < 3; i++) {
          if (result[i] !== 'green' && unmatchedSecret.includes(guess[i])) {
              result[i] = 'orange';
              unmatchedSecret[unmatchedSecret.indexOf(guess[i])] = null; // Mark matched values
          }
      }

      // Fill remaining with red if no matches found
      for (let i = 0; i < 3; i++) {
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
  function resetGame() {
      secretCode = generateSecretCode();
      currentGuess = [];
      attemptCount = 0;
      resultSection.innerHTML = ''; // Clear previous attempts
      guessContainer.innerHTML = ''; // Clear current guess
  }
});
