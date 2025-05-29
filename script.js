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

    // Boutons de retour au menu (utiliser la classe back-to-menu que tu as dans ton HTML)
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
        initializeDiceMode(); // S'assure que le mode dé est initialisé avec des dés
    });

    showHandModeButton.addEventListener('click', () => {
        showSection(handMode);
        // Pas d'initialisation spécifique pour le mode main ici
    });

    showShapesModeButton.addEventListener('click', () => {
        showSection(shapesMode);
        generateShapes(); // Génère les formes dès l'entrée dans le mode
    });

    showNumberModeButton.addEventListener('click', () => {
        showSection(numberMode);
        generateRandomNumber(); // Génère un nombre dès l'entrée dans le mode
    });

    // Gestionnaires d'événements pour les boutons "Retour au menu"
    backToMenuButtons.forEach(button => {
        button.addEventListener('click', () => {
            playSound(buttonClickSound); // Joue le son de clic au retour
            showSection(mainMenu);
            // Réinitialisation des modes en quittant
            const secondHandImage = document.getElementById('second-hand-image');
            if (secondHandImage) {
                secondHandImage.classList.add('hidden-hand-image');
            }
            const shapesContainer = document.getElementById('shapes-container');
            if (shapesContainer) {
                shapesContainer.innerHTML = ''; // Vide les formes
            }
            const diceContainerMultiple = document.getElementById('dice-container-multiple');
            if (diceContainerMultiple) {
                diceContainerMultiple.innerHTML = ''; // Vide les dés
                // Retire aussi les classes de taille quand on quitte le mode dé
                diceContainerMultiple.classList.remove('dice-size-1', 'dice-size-2', 'dice-size-3', 'dice-size-4', 'dice-size-5');
            }
            const randomNumberDisplay = document.getElementById('random-number-display');
            if (randomNumberDisplay) {
                randomNumberDisplay.textContent = '?'; // Réinitialise le nombre
            }
        });
    });

    // --- Mode Dé ---
    const numDiceSelect = document.getElementById('num-dice');
    const rollDiceButton = document.getElementById('roll-dice-button');
    const diceContainerMultiple = document.getElementById('dice-container-multiple');
    const diceTotalResult = document.getElementById('dice-total-result'); // Assure-toi que tu as bien ce span dans ton HTML

    const diceImagesPaths = [ // Renommé pour éviter la confusion avec les images de mains
        'images/de_1.png', 'images/de_2.png', 'images/de_3.png',
        'images/de_4.png', 'images/de_5.png', 'images/de_6.png'
    ];

    function initializeDiceMode() {
        diceContainerMultiple.innerHTML = ''; // Vide le conteneur
        const numDice = parseInt(numDiceSelect.value);

        // Supprime toutes les anciennes classes de taille du conteneur avant d'ajouter la nouvelle
        diceContainerMultiple.classList.remove('dice-size-1', 'dice-size-2', 'dice-size-3', 'dice-size-4', 'dice-size-5');
        // Ajoute la classe de taille appropriée en fonction du nombre de dés
        diceContainerMultiple.classList.add(`dice-size-${numDice}`);

        for (let i = 0; i < numDice; i++) {
            const diceImage = document.createElement('img');
            diceImage.src = diceImagesPaths[0]; // Affiche une image initiale (par ex. dé 1)
            diceImage.alt = `Dé ${i + 1}`;
            diceImage.classList.add('dice-instance'); // Garde ta classe existante
            diceContainerMultiple.appendChild(diceImage);
        }
        // Réinitialise le total au chargement du mode
        if (diceTotalResult) {
            diceTotalResult.textContent = '?';
        }
    }

    // Ajout d'un écouteur de clic pour le sélecteur de dés afin de jouer le son
    numDiceSelect.addEventListener('change', () => {
        playSound(buttonClickSound); // Son quand on change le nombre de dés
        initializeDiceMode(); // Met à jour l'affichage des dés avec la nouvelle taille
        // Tu peux choisir d'appeler rollDiceButton.click() ici si tu veux qu'ils se lancent automatiquement
    });

    rollDiceButton.addEventListener('click', () => {
        playSound(diceRollSound); // Joue le son de lancer de dés

        const diceElements = document.querySelectorAll('#dice-container-multiple .dice-instance');
        let currentTotal = 0; // Pour calculer le total des dés
        let animationIntervals = [];

        diceElements.forEach((diceImage) => { // Retire l'index car il n'est pas utilisé ici
            diceImage.classList.add('rotating-dice');

            let interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * 6);
                diceImage.src = diceImagesPaths[randomIndex];
            }, 90); // Vitesse de rotation
            animationIntervals.push(interval);
        });

        // Arrête l'animation et affiche le résultat final après un court délai
        setTimeout(() => {
            animationIntervals.forEach(interval => clearInterval(interval)); // Arrête toutes les animations

            diceElements.forEach(diceImage => {
                diceImage.classList.remove('rotating-dice'); // Supprime la classe de rotation

                const randomNumber = Math.floor(Math.random() * 6) + 1; // Le résultat final du dé (1 à 6)
                diceImage.src = `images/de_${randomNumber}.png`; // Affiche l'image du résultat final
                currentTotal += randomNumber; // Ajoute au total
            });
            console.log("Résultats des dés :", currentTotal); // Affiche dans la console

            if (diceTotalResult) {
                diceTotalResult.textContent = currentTotal; // Met à jour le span du total
            }
        }, 800); // Durée de l'animation des dés (ajuste si nécessaire)
    });


    // --- Mode Main ---
    const handImage = document.getElementById('hand-image');
    // const handResultSpan = document.getElementById('hand-result'); // Commenté car il n'est pas dans ton HTML. Si tu l'ajoutes, décommente.
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
    // const shapeCountResult = document.getElementById('shape-count-result'); // Si tu as ce span pour le total des formes

    const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#9370DB', '#00CED1'];
    const minSize = 30;
    const maxSize = 80;

    const shapeTypes = ['square', 'circle', 'triangle']; // 'heart' a été retiré

    function generateShapes() {
        playSound(revealSound); // Joue un son de révélation pour les formes

        shapesContainer.innerHTML = '';

        const numberOfShapes = Math.floor(Math.random() * 6) + 3; // Entre 3 et 8 formes

        // Choisit un type et une couleur pour toutes les formes de la génération
        const chosenShapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        const chosenColor = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < numberOfShapes; i++) {
            const shape = document.createElement('div');
            shape.classList.add('shape');
            shape.classList.add(chosenShapeType);

            const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;

            if (chosenShapeType === 'triangle') {
                // Les triangles en CSS sont un peu plus complexes pour la taille et la couleur
                const triangleHeight = Math.floor(size * (Math.sqrt(3) / 2));
                shape.style.borderLeft = `${size / 2}px solid transparent`;
                shape.style.borderRight = `${size / 2}px solid transparent`;
                shape.style.borderBottom = `${triangleHeight}px solid ${chosenColor}`;
                shape.style.backgroundColor = 'transparent'; // Le fond n'est pas utilisé pour le triangle CSS
            } else {
                shape.style.width = `${size}px`;
                shape.style.height = `${size}px`;
                shape.style.backgroundColor = chosenColor;
            }

            shapesContainer.appendChild(shape);
        }
        // Si tu veux afficher le nombre de formes, tu dois créer un span avec l'id 'shape-count-result'
        // if (shapeCountResult) {
        //     shapeCountResult.textContent = numberOfShapes;
        // }
    }

    generateShapesButton.addEventListener('click', generateShapes);

    // --- Mode Nombre Aléatoire ---
    const randomNumberDisplay = document.getElementById('random-number-display');
    const generateRandomNumberButton = document.getElementById('generate-random-number-button');
    // const numberResultDisplay = document.getElementById('number-result-display'); // Si tu as ce span pour le total du nombre

    function generateRandomNumber() {
        playSound(revealSound); // Joue un son de révélation pour le nombre
        const randomNumber = Math.floor(Math.random() * 11); // Nombre entre 0 et 10
        randomNumberDisplay.textContent = randomNumber;
        // Si tu veux afficher le nombre, tu dois créer un span avec l'id 'number-result-display'
        // if (numberResultDisplay) {
        //     numberResultDisplay.textContent = randomNumber;
        // }
    }

    generateRandomNumberButton.addEventListener('click', generateRandomNumber);

    // S'assurer que le menu principal est visible au chargement de la page et les autres sont cachés
    showSection(mainMenu); // C'est crucial pour que la navigation fonctionne
});