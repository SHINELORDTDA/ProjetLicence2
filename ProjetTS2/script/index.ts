var memoireElt = document.querySelector("#memoire");
var ecranElt = document.querySelector(".ecran");

if (!ecranElt) {
    console.error("L'élément écran est introuvable.");
    throw new Error("Élément écran non trouvé.");
}

if (!memoireElt) {
    console.warn("L'élément mémoire est introuvable. Certaines fonctionnalités ne fonctionneront pas.");
}

var precedent = 0;
var affichage = "";
var operation = null;
var memoire = localStorage.memoire ? parseFloat(localStorage.memoire) : 0;

// Cacher les fonctions scientifiques par défaut
var scientifiquesElt = document.querySelector(".scientifiques");
var toggleSciBtn = document.getElementById("toggleSci");

toggleSciBtn.addEventListener("click", function() {
    if (scientifiquesElt && scientifiquesElt.style.display === "none") {
        scientifiquesElt.style.display = "grid";
    } else if (scientifiquesElt) {
        scientifiquesElt.style.display = "none";
    }
});

window.onload = function () {
    var touches = document.querySelectorAll("button");
    touches.forEach(function (touche) {
        touche.addEventListener("click", gererTouches);
    });
    document.addEventListener("keydown", gererTouches);
    if (memoire !== 0 && memoireElt) memoireElt.style.display = "initial";
};

function gererTouches(event: Event) {
    let touche: string | undefined;
    const listeTouches = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", ".", "!", "Enter", "Escape", "=", "√", "sin", "cos", "tan", "ln", "log", "exp", "BIN", "DEC", "OCT", "HEX"];

    if (event instanceof KeyboardEvent && listeTouches.includes(event.key)) {
        event.preventDefault();
        touche = event.key;
    } else if (event instanceof MouseEvent && event.target instanceof HTMLElement) {
        touche = event.target.innerText;
    }

    if (!touche) return;

    if (!isNaN(parseFloat(touche)) || touche === ".") {
        affichage = affichage === "" ? touche : affichage + touche;
        if (ecranElt) ecranElt.innerText = affichage;
    } else {
        switch (touche) {
            case "C":
            case "Escape":
                precedent = 0;
                affichage = "";
                operation = null;
                if (ecranElt) ecranElt.innerText = "0";
                break;
            case "+":
            case "-":
            case "*":
            case "/":
            case "!":
            case "√":
            case "sin":
            case "cos":
            case "tan":
            case "ln":
            case "log":
            case "exp":
                precedent = precedent === 0 ? parseFloat(affichage) : calculer(precedent, parseFloat(affichage), operation);
                if (ecranElt) ecranElt.innerText = precedent.toString();
                operation = touche;
                affichage = "";
                break;
            case "=":
            case "Enter":
                precedent = precedent === 0 ? parseFloat(affichage) : calculer(precedent, parseFloat(affichage), operation);
                if (ecranElt) ecranElt.innerText = precedent.toString();
                affichage = precedent.toString();
                precedent = 0;
                break;
            case "BIN":
                if (ecranElt) ecranElt.innerText = parseInt(affichage, 10).toString(2);
                break;
            case "DEC":
                if (ecranElt) ecranElt.innerText = parseInt(affichage, 2).toString(10);
                break;
            case "OCT":
                if (ecranElt) ecranElt.innerText = parseInt(affichage, 10).toString(8);
                break;
            case "HEX":
                if (ecranElt) ecranElt.innerText = parseInt(affichage, 10).toString(16);
                break;
        }
    }
}

function calculer(nb1: number, nb2: number, operation: string) {
    nb1 = parseFloat(nb1.toString());
    nb2 = parseFloat(nb2.toString());

    switch (operation) {
        case "+":
            return nb1 + nb2;
        case "-":
            return nb1 - nb2;
        case "*":
            return nb1 * nb2;
        case "/":
            if (nb2 === 0) throw new Error("Division par zéro");
            return nb1 / nb2;
        case "!":
            return factorielle(nb2);
        case "√":
            return Math.sqrt(nb2);
        case "sin":
            return Math.sin(nb2 * Math.PI / 180); // radians
        case "cos":
            return Math.cos(nb2 * Math.PI / 180); // radians
        case "tan":
            return Math.tan(nb2 * Math.PI / 180); // radians
        case "ln":
            return Math.log(nb2); // ln = log base e
        case "log":
            return Math.log10(nb2); // log base 10
        case "exp":
            return Math.exp(nb2);
        default:
            throw new Error("Opération inconnue : " + operation);
    }
}

function toggleTime() {
    const timeElement = document.getElementById('ecran');
    const timeButton = document.getElementById('timeButton');

    // Vérifie si l'heure est déjà affichée
    if (timeElement && timeElement.style.display === 'none') {
        // Si l'heure est cachée, on l'affiche
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        // Ajouter un 0 devant les minutes et secondes si nécessaire
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        const ecranString = `${hours}:${minutes}:${seconds}`;
        if (timeElement) timeElement.textContent = 'Heure actuelle : ' + ecranString;
        timeElement.style.display = 'block'; // Afficher l'heure
        if (timeButton) timeButton.textContent = 'Masquer l\'heure'; // Changer le texte du bouton
    } else if (timeElement) {
        // Si l'heure est déjà affichée, on la masque
        timeElement.style.display = 'none';
        if (timeButton) timeButton.textContent = 'Afficher l\'heure'; // Changer le texte du bouton
    }
}

// Ajouter l'événement au bouton
const timeButton = document.getElementById('timeButton');
if (timeButton) {
    timeButton.addEventListener('click', toggleTime);
}