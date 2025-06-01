document.addEventListener('DOMContentLoaded', () => {
    // --- Sons ---
    // Les sons sont désactivés pour cette version spécifique.
    // Les lignes de déclaration des objets Audio sont commentées pour ne pas les charger.
    // const buttonClickSound = new Audio('sounds/button-click.mp3');
    // const diceRollSound = new Audio('sounds/dice-roll.mp3');

    // Fonction utilitaire pour jouer un son (modifiée pour ne rien faire)
    function playSound(audioElement) {
        // Dans cette version "sans son", cette fonction ne fait rien.
        // Aucun son ne sera joué, quel que soit l'élément audio passé.
        // Tu peux décommenter la ligne ci-dessous si tu veux voir un message dans la console quand un son *aurait dû* être joué.
        // console.log("Tentative de jouer un son (désactivé dans cette version)");
    }

    // --- Éléments de navigation ---
    const mainMenu = document.getElementById('main-menu');
    const diceMode = document.getElementById('mode-de');
    const handMode = document.getElementById('mode-main');
    const shapesMode = document.getElementById('mode-formes');
    const numberMode = document.getElementById('mode-number');

    // Boutons pour afficher les modes depuis le menu
    const showDiceModeButton = document.getElementById('show-dice-mode-button');
    const showHandModeButton = document.getElementById('show-hand-mode-button');
    const showShapesModeButton = document.getElementById('show-shapes-mode-button');
    const showNumberModeButton = document.getElementById('show-number-mode-button');

    // Boutons de retour au menu (utiliser la classe back-to-menu que tu as dans ton HTML)
    const backToMenuButtons = document.querySelectorAll('.back-to-menu');

    // Fonction pour montrer une section et cacher les autres
    function showSection(sectionToShow) {
        playSound(); // Appel à playSound, mais il ne fera rien dans cette version

        const allSections = document.querySelectorAll('.game-mode');
        allSections.forEach(section => {
            if (section === sectionToShow) {
                section.classList.remove('hidden-mode');
                section.classList.add('current-mode');
            } else {
                section.classList.add('hidden-mode');
                section.classList.remove('current-mode');
            }
        });
    }

    // Gestionnaires d'événements pour les boutons du menu
    if (showDiceModeButton) {
        showDiceModeButton.addEventListener('click', () => {
            showSection(diceMode);
            initializeDiceMode();
        });
    }

    if (showHandModeButton) {
        showHandModeButton.addEventListener('click', () => {
            showSection(handMode);
        });
    }

    if (showShapesModeButton) {
        showShapesModeButton.addEventListener('click', () => {
            showSection(shapesMode);
            generateShapes();
        });
    }

    if (showNumberModeButton) {
        showNumberModeButton.addEventListener('click', () => {
            showSection(numberMode);
            generateRandomNumber();
        });
    }


    // Gestionnaires d'événements pour les boutons "Retour au menu"
    backToMenuButtons.forEach(button => {
        button.addEventListener('click', () => {
            playSound(); // Appel à playSound, mais il ne fera rien
            showSection(mainMenu);
            const secondHandImage = document.getElementById('second-hand-image');
            if (secondHandImage) {
                secondHandImage.classList.add('hidden-hand-image');
            }
            const shapesContainer = document.getElementById('shapes-container');
            if (shapesContainer) {
                shapesContainer.innerHTML = '';
            }
            const diceContainerMultiple = document.getElementById('dice-container-multiple');
            if (diceContainerMultiple) {
                diceContainerMultiple.innerHTML = '';
                diceContainerMultiple.classList.remove('dice-size-1', 'dice-size-2', 'dice-size-3', 'dice-size-4', 'dice-size-5');
            }
            const randomNumberDisplay = document.getElementById('random-number-display');
            if (randomNumberDisplay) {
                randomNumberDisplay.textContent = '?';
            }
        });
    });

    // --- Mode Dé ---
    const numDiceSelect = document.getElementById('num-dice');
    const rollDiceButton = document.getElementById('roll-dice-button');
    const diceContainerMultiple = document.getElementById('dice-container-multiple');
    const diceTotalResult = document.getElementById('dice-total-result');

    const diceImagesPaths = [
        'images/de_1.png', 'images/de_2.png', 'images/de_3.png',
        'images/de_4.png', 'images/de_5.png', 'images/de_6.png'
    ];

    function initializeDiceMode() {
        if (!diceContainerMultiple || !numDiceSelect) {
            console.error("Éléments DOM pour le mode Dé non trouvés.");
            return;
        }

        diceContainerMultiple.innerHTML = '';
        const numDice = parseInt(numDiceSelect.value);

        diceContainerMultiple.classList.remove('dice-size-1', 'dice-size-2', 'dice-size-3', 'dice-size-4', 'dice-size-5');
        diceContainerMultiple.classList.add(`dice-size-${numDice}`);

        for (let i = 0; i < numDice; i++) {
            const diceImage = document.createElement('img');
            diceImage.src = diceImagesPaths[0];
            diceImage.alt = `Dé ${i + 1}`;
            diceImage.classList.add('dice-instance');
            diceContainerMultiple.appendChild(diceImage);
        }
        if (diceTotalResult) {
            diceTotalResult.textContent = '?';
        }
    }

    if (numDiceSelect) {
        numDiceSelect.addEventListener('change', () => {
            playSound(); // Appel à playSound, mais il ne fera rien
            initializeDiceMode();
        });
    }


    if (rollDiceButton) {
        rollDiceButton.addEventListener('click', () => {
            playSound(); // Appel à playSound, mais il ne fera rien (précédemment diceRollSound)

            const diceElements = document.querySelectorAll('#dice-container-multiple .dice-instance');
            let currentTotal = 0;
            let animationIntervals = [];

            if (diceElements.length === 0) {
                console.warn("Aucun dé à lancer.");
                if (diceTotalResult) diceTotalResult.textContent = '0';
                return;
            }

            diceElements.forEach((diceImage) => {
                diceImage.classList.add('rotating-dice');

                let interval = setInterval(() => {
                    const randomIndex = Math.floor(Math.random() * 6);
                    diceImage.src = diceImagesPaths[randomIndex];
                }, 90);
                animationIntervals.push(interval);
            });

            setTimeout(() => {
                animationIntervals.forEach(interval => clearInterval(interval));

                diceElements.forEach(diceImage => {
                    diceImage.classList.remove('rotating-dice');

                    const randomNumber = Math.floor(Math.random() * 6) + 1;
                    diceImage.src = `images/de_${randomNumber}.png`;
                    currentTotal += randomNumber;
                });
                console.log("Résultats des dés :", currentTotal);

                if (diceTotalResult) {
                    diceTotalResult.textContent = currentTotal;
                }
            }, 800);
        });
    }


    // --- Mode Main ---
    const handImage = document.getElementById('hand-image');
    const triggerHandButton = document.getElementById('show-hand-button');
    const secondHandImage = document.getElementById('second-hand-image');

    const handImages = [
        'images/main_0.png', 'images/main_1.png', 'images/main_2.png',
        'images/main_3.png', 'images/main_4.png', 'images/main_5.png'
    ];
    const maxHandNumber = 5;

    if (triggerHandButton) {
        triggerHandButton.addEventListener('click', () => {
            playSound(); // Appel à playSound, mais il ne fera rien
            const randomNumber = Math.floor(Math.random() * (maxHandNumber + 1));
            if (handImage) handImage.src = handImages[randomNumber];

            const showSecondHand = Math.random() < 0.5;

            if (showSecondHand && secondHandImage) {
                const secondRandomNumber = Math.floor(Math.random() * (maxHandNumber + 1));
                secondHandImage.src = handImages[secondRandomNumber];
                secondHandImage.classList.remove('hidden-hand-image');
            } else if (secondHandImage) {
                secondHandImage.classList.add('hidden-hand-image');
            }
        });
    }

    // --- Mode Formes ---
    const shapesContainer = document.getElementById('shapes-container');
    const generateShapesButton = document.getElementById('generate-shapes-button');

    const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#9370DB', '#00CED1'];
    const minSize = 46; // 40 * 1.15 = 46
    const maxSize = 115; // 100 * 1.15 = 115

    const shapeTypes = ['square', 'circle', 'triangle'];

    function generateShapes() {
        if (!shapesContainer) {
            console.error("Conteneur des formes non trouvé.");
            return;
        }
        playSound(); // Appel à playSound, mais il ne fera rien

        shapesContainer.innerHTML = '';

        const numberOfShapes = Math.floor(Math.random() * 6) + 3;

        const chosenShapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const chosenColor = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < numberOfShapes; i++) {
            const shape = document.createElement('div');
            shape.classList.add('shape');
            shape.classList.add(chosenShapeType);

            const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

            if (chosenShapeType === 'triangle') {
                const triangleHeight = Math.floor(size * (Math.sqrt(3) / 2));
                shape.style.borderLeft = `${size / 2}px solid transparent`;
                shape.style.borderRight = `${size / 2}px solid transparent`;
                shape.style.borderBottom = `${triangleHeight}px solid ${chosenColor}`;
                shape.style.backgroundColor = 'transparent';
            } else {
                shape.style.width = `${size}px`;
                shape.style.height = `${size}px`;
                shape.style.backgroundColor = chosenColor;
            }

            shapesContainer.appendChild(shape);
        }
    }

    if (generateShapesButton) {
        generateShapesButton.addEventListener('click', generateShapes);
    }

    // --- Mode Nombre Aléatoire ---
    const randomNumberDisplay = document.getElementById('random-number-display');
    const generateRandomNumberButton = document.getElementById('generate-random-number-button');

    function generateRandomNumber() {
        if (!randomNumberDisplay) {
            console.error("Élément d'affichage du nombre non trouvé.");
            return;
        }
        playSound(); // Appel à playSound, mais il ne fera rien
        const randomNumber = Math.floor(Math.random() * 11);
        randomNumberDisplay.textContent = randomNumber;
    }

    if (generateRandomNumberButton) {
        generateRandomNumberButton.addEventListener('click', generateRandomNumber);
    }

    if (mainMenu) {
        showSection(mainMenu);
    } else {
        console.error("L'élément 'main-menu' n'a pas été trouvé. La navigation pourrait ne pas fonctionner.");
    }
});