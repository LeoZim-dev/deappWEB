document.addEventListener('DOMContentLoaded', () => {
    // --- Sons ---
    // Assure-toi que les chemins des fichiers audio sont corrects et qu'ils existent !
    const buttonClickSound = new Audio('sounds/button-click.mp3');
    const diceRollSound = new Audio('sounds/dice-roll.mp3');
    const revealSound = new Audio('sounds/reveal-sound.mp3');

    // Fonction utilitaire pour jouer un son (permet de s'assurer qu'il est rejouable)
    function playSound(audioElement) {
        audioElement.currentTime = 0; // Remet le son au début pour qu'il puisse être rejoué rapidement
        audioElement.play().catch(e => console.log("Erreur de lecture audio:", e)); // Gère les erreurs de lecture (ex: auto-play bloqué par le navigateur)
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

    // Boutons de retour au menu
    const backToMenuButtons = document.querySelectorAll('.back-to-menu');

    // Fonction pour montrer une section et cacher les autres
    function showSection(sectionToShow) {
        // Joue le son de clic quand on change de section
        playSound(buttonClickSound);
        
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
    showDiceModeButton.addEventListener('click', () => {
        showSection(diceMode);
        initializeDiceMode();
    });

    showHandModeButton.addEventListener('click', () => {
        showSection(handMode);
    });

    showShapesModeButton.addEventListener('click', () => {
        showSection(shapesMode);
        generateShapes();
    });

    showNumberModeButton.addEventListener('click', () => {
        showSection(numberMode);
        generateRandomNumber(); // Jouera le son de révélation si appelé ici
    });

    // Gestionnaires d'événements pour les boutons "Retour au menu"
    backToMenuButtons.forEach(button => {
        button.addEventListener('click', () => {
            playSound(buttonClickSound); // Joue le son de clic au retour
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
            }
        });
    });

    // --- Mode Dé ---
    const numDiceSelect = document.getElementById('num-dice');
    const rollDiceButton = document.getElementById('roll-dice-button');
    const diceContainerMultiple = document.getElementById('dice-container-multiple');

    const diceImages = [
        'images/de_1.png', 'images/de_2.png', 'images/de_3.png',
        'images/de_4.png', 'images/de_5.png', 'images/de_6.png'
    ];

    function initializeDiceMode() {
        diceContainerMultiple.innerHTML = '';
        const numDice = parseInt(numDiceSelect.value);

        for (let i = 0; i < numDice; i++) {
            const diceImage = document.createElement('img');
            diceImage.src = diceImages[0];
            diceImage.alt = `Dé ${i + 1}`;
            diceImage.classList.add('dice-instance');
            diceContainerMultiple.appendChild(diceImage);
        }
    }

    // Ajout d'un écouteur de clic pour le sélecteur de dés afin de jouer le son
    numDiceSelect.addEventListener('change', () => {
        playSound(buttonClickSound); // Son quand on change le nombre de dés
        initializeDiceMode();
    });

    rollDiceButton.addEventListener('click', () => {
        playSound(diceRollSound); // Joue le son de lancer de dés

        const diceElements = document.querySelectorAll('#dice-container-multiple .dice-instance');
        const results = [];
        let animationIntervals = [];

        diceElements.forEach((diceImage, index) => {
            diceImage.classList.add('rotating-dice');

            let interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * 6);
                diceImage.src = diceImages[randomIndex];
            }, 90);
            animationIntervals.push(interval);
        });

        setTimeout(() => {
            animationIntervals.forEach(interval => clearInterval(interval));

            diceElements.forEach(diceImage => {
                diceImage.classList.remove('rotating-dice');

                const randomNumber = Math.floor(Math.random() * 6) + 1;
                diceImage.src = `images/de_${randomNumber}.png`;
                results.push(randomNumber);
            });
            console.log("Résultats des dés :", results);
        }, 500);
    });


    // --- Mode Main ---
    const handImage = document.getElementById('hand-image');
    // const handResultSpan = document.getElementById('hand-result'); // Cet élément n'existe pas dans le HTML actuel, il faut le rajouter si tu veux un affichage textuel
    const triggerHandButton = document.getElementById('show-hand-button');
    const secondHandImage = document.getElementById('second-hand-image');

    const handImages = [
        'images/main_0.png', 'images/main_1.png', 'images/main_2.png',
        'images/main_3.png', 'images/main_4.png', 'images/main_5.png'
    ];
    const maxHandNumber = 5;

    triggerHandButton.addEventListener('click', () => {
        playSound(revealSound); // Joue un son de révélation pour les mains

        const randomNumber = Math.floor(Math.random() * (maxHandNumber + 1));
        handImage.src = handImages[randomNumber];
        // Si tu veux afficher le nombre, tu dois créer un span avec l'id 'hand-result' dans ton HTML
        // if (handResultSpan) {
        //     handResultSpan.textContent = randomNumber;
        // }

        const showSecondHand = Math.random() < 0.5;

        if (showSecondHand) {
            const secondRandomNumber = Math.floor(Math.random() * (maxHandNumber + 1));
            secondHandImage.src = handImages[secondRandomNumber];
            secondHandImage.classList.remove('hidden-hand-image');
        } else {
            secondHandImage.classList.add('hidden-hand-image');
        }
    });

    // --- Mode Formes ---
    const shapesContainer = document.getElementById('shapes-container');
    const generateShapesButton = document.getElementById('generate-shapes-button');

    const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#9370DB', '#00CED1'];
    const minSize = 30;
    const maxSize = 80;

    const shapeTypes = ['square', 'circle', 'triangle']; // 'heart' a été retiré

    function generateShapes() {
        playSound(revealSound); // Joue un son de révélation pour les formes

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

    generateShapesButton.addEventListener('click', generateShapes);

    // --- Mode Nombre Aléatoire ---
    const randomNumberDisplay = document.getElementById('random-number-display');
    const generateRandomNumberButton = document.getElementById('generate-random-number-button');

    function generateRandomNumber() {
        playSound(revealSound); // Joue un son de révélation pour le nombre
        const randomNumber = Math.floor(Math.random() * 11);
        randomNumberDisplay.textContent = randomNumber;
    }

    generateRandomNumberButton.addEventListener('click', generateRandomNumber);

    // S'assurer que le menu principal est visible au chargement de la page et les autres sont cachés
    showSection(mainMenu);
});