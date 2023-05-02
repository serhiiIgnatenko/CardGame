'use strict';

document.addEventListener("DOMContentLoaded", function (event) {
	// variables.
	const fieldContainer = document.getElementById('field');
	const squareSize = document.getElementById('squareSize');
	const start = document.getElementById('start');
	const reset = document.getElementById('reset');
	const veil = document.getElementById('congratulation');
	const counter = document.getElementById('counter');
	let maxCheckedCard = fieldContainer.getElementsByClassName('card checked');
	let cards = fieldContainer.getElementsByClassName('card');
	let counterNumberOfAttempts = 0;

	//Run a function "startGame" when the start button is clicked.
	start.addEventListener('click', startGame);
	//Run a function "resetGame" when the start button is clicked.
	reset.addEventListener('click', resetGame);
	//Run a function "startGame" when the Enter button is clicked.
	squareSize.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			startGame();
		}
	});

	//Check if the entered number is even.
	//Launching the field creation and game initialization functions.
	function startGame() {
		console.log(0 < Number(squareSize.value) <= 8);
		if (!(squareSize.value % 2) && 0 < Number(squareSize.value) && Number(squareSize.value) <= 8) {
			createdField();
			initGame();
			counterNumberOfAttempts = 0;
		} else {
			alert(`Введите число кратное двум. 2 / 4 / 6 / 8`);
		};
	};

	//creating a field and filling with elements.
	function createdField() {
		let valueSquareSize = squareSize.value;
		let cardArr = [];

		fieldContainer.style = `grid-template: repeat(${valueSquareSize}, 1fr) / repeat(${valueSquareSize}, 1fr)`;
		fieldContainer.setAttribute('data-size', `${valueSquareSize}`);

		clearingField();
		creatingElements(cardArr);
		fieldFilling(cardArr);

		fieldContainer.classList.remove('hide');

	};

	//clearing the field from child elements.
	function clearingField() {
		while (fieldContainer.firstChild) {
			fieldContainer.removeChild(fieldContainer.firstChild);
		}
	};

	//Create a card.
	function creatingElements(arr) {
		let type = document.querySelector('input[name="type_game"]:checked').getAttribute('data-typeGame');
		let amountCard = (squareSize.value ** 2);
		let flag = 1;

		for (let i = 1; i < amountCard + 1; i++) {
			let card = document.createElement("div");
			let cardValue = document.createElement('span');
			card.classList.add('card');
			card.setAttribute('data-value', `${flag}`);

			if (type == "image") {
				cardValue.innerHTML = `<img src="img/img_item/svg${flag}.svg" alt="number ${flag}">`;
			} else {
				cardValue.innerText = `${flag}`;
			}

			card.appendChild(cardValue);
			arr.push(card);

			if (i % 2) {
				flag;
			} else {
				flag++;
			};

		};

		return arr;
	};

	//sorting the cards randomly and adding the cards to the parent element.
	function fieldFilling(arr) {
		arr.sort(() => Math.random() - 0.5)
			.forEach(card => fieldContainer.append(card));

		return arr;
	};

	function initGame() {
		counter.innerText = '0';
		fieldContainer.addEventListener('click', clickOnCard);
	};

	//Checking that the click was on a cell and showing that cell.
	function clickOnCard(event) {
		let card = event.target.closest('.card');
		if (card) {
			event.target.closest('.card').classList.add('checked');
			maxCheckedCardFn();
		}
	};

	//Check that no more than two cards are selected. Blocking the selection of new cards.
	function maxCheckedCardFn() {
		if (maxCheckedCard.length == 2) {
			comparisonCardValue();
			fieldContainer.removeEventListener('click', clickOnCard);
			counterNumberOfAttempts++;
			counter.innerText = `${counterNumberOfAttempts}`;
		};
	};

	//Comparison of two cards. Hiding if equal, return to original state if not equal.
	function comparisonCardValue() {
		let firstCard = maxCheckedCard[0];
		let secondCard = maxCheckedCard[1];
		let sameDataAttribute = firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value');

		if (sameDataAttribute) {
			let hiddenTimeoutEqual = setTimeout(function () {
				firstCard.setAttribute('hidden', '');
				secondCard.setAttribute('hidden', '');
				firstCard.classList.remove('checked');
				secondCard.classList.remove('checked');
				ifAllCardHidden();
				fieldContainer.addEventListener('click', clickOnCard);
				clearTimeout(hiddenTimeoutEqual);
			}, 1000);

		} else {
			let hiddenTimeoutUnequal = setTimeout(function () {
				firstCard.classList.remove('checked');
				secondCard.classList.remove('checked');
				fieldContainer.addEventListener('click', clickOnCard);
				clearTimeout(hiddenTimeoutUnequal);
			}, 1000);
		}
	};

	//Displaying a notification about the end of the game if there are no cards on the field.
	function ifAllCardHidden() {
		let finish = Array.from(cards).every(elem => elem.hasAttribute('hidden'));

		if (finish) {
			veil.classList.add('show');
			let veilTimeout = setTimeout(function () {
				veil.classList.remove('show');
				clearTimeout(veilTimeout);
				startGame();
			}, 5000);
		}
	};

	//Return all cells in the field. Restarting the game but the elements remain in the same place.
	function resetGame() {
		Array.from(cards).forEach(elem => elem.removeAttribute('hidden'));
	}
});
