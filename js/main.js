'use strict';

document.addEventListener("DOMContentLoaded", function (event) {
	console.log("DOM fully loaded and parsed");


	let fieldContainer = document.getElementById('field');
	let squareSize = this.getElementById('squareSize');
	let start = this.getElementById('start');
	let reset = this.getElementById('reset');
	let veil = document.getElementById('congratulation');
	let counter = document.getElementById('counter');
	let counterNumberOfAttempts = 0;
	let maxCheckedCard, cards;


	start.addEventListener('click', startGame);
	reset.addEventListener('click', resetGame);
	squareSize.addEventListener('keypress', function (e) {
		if (e.key === 'Enter') {
			startGame();
		}
	});

	function startGame() {
		if (!(squareSize.value % 2)) {
			createdField();
			initGame();
			counterNumberOfAttempts = 0;
		} else {
			alert(`Введите число кратное двум. 2 / 4 / 6 / 8`);
		};
	};

	function createdField() {
		let valueSquareSize = squareSize.value;
		let amountCard = (valueSquareSize ** 2);
		let cardArr = [];
		let type = document.querySelector('input[name="type_game"]:checked').getAttribute('data-typeGame');

		fieldContainer.style = `grid-template: repeat(${valueSquareSize}, 1fr) / repeat(${valueSquareSize}, 1fr)`;
		fieldContainer.setAttribute('data-size', `${valueSquareSize}`);

		while (fieldContainer.firstChild) {
			fieldContainer.removeChild(fieldContainer.firstChild);
		};

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
			cardArr.push(card);

			if (i % 2) {
				flag;
			} else {
				flag++;
			};

		};

		cardArr.sort(() => Math.random() - 0.5)
			.forEach(card => fieldContainer.append(card));

		fieldContainer.classList.remove('hide');

	};

	function initGame() {
		counter.innerText = '0';
		maxCheckedCard = fieldContainer.getElementsByClassName('card checked');
		cards = fieldContainer.getElementsByClassName('card');

		fieldContainer.addEventListener('click', clickOnCard);
		return maxCheckedCard, cards;
	};

	function clickOnCard(event) {
		// let card = event.target.classList.contains('card');
		let card = event.target.closest('.card').classList.contains('card');
		if (card) {
			event.target.closest('.card').classList.add('checked');
			maxCheckedCardFn();
		}
	};

	function maxCheckedCardFn() {
		if (maxCheckedCard.length == 2) {
			comparisonCardValue();
			fieldContainer.removeEventListener('click', clickOnCard);
			counterNumberOfAttempts++;
			counter.innerText = `${counterNumberOfAttempts}`;
		};
	};

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
				allCardHidden();
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

	function allCardHidden() {
		let finish = Array.from(cards).every(elem => elem.hasAttribute('hidden'));

		if (finish) {
			veil.classList.add('show');
			let veilTimeout = setTimeout(function () {
				veil.classList.remove('show');
				clearTimeout(veilTimeout);
			}, 5000);
		}
	};

	function resetGame() {
		Array.from(cards).forEach(elem => elem.removeAttribute('hidden'));
	}
});
