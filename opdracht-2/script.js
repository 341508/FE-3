// Dit script regelt de teller van opdracht 2.
// De knoppen passen de waarde aan, de resetknop zet alles terug en de status verandert mee.

// Selecteer alle knoppen en de onderdelen van de teller die bijgewerkt moeten worden.
const buttons = document.querySelectorAll("#buttons button");
const counterEl = document.querySelector("#counter");
const counterStateEl = document.querySelector("#counter-state");
const resetButton = document.querySelector("#reset-button");

// Lees de beginwaarde van de teller uit de HTML en zet die om naar een getal.
let counterVal = Number(counterEl.textContent);

// Werk de zichtbare teller en de statusregel bij op basis van de huidige waarde.
function updateCounter() {
  counterEl.textContent = counterVal;

  // Positieve waarde: groene status en bijbehorende tekst tonen.
  if (counterVal > 0) {
    counterEl.className = "positive";
    counterStateEl.className = "counter-state positive";
    counterStateEl.textContent = "Status: positief";
    return;
  }

  // Negatieve waarde: rode status en bijbehorende tekst tonen.
  if (counterVal < 0) {
    counterEl.className = "negative";
    counterStateEl.className = "counter-state negative";
    counterStateEl.textContent = "Status: negatief";
    return;
  }

  // Bij nul krijgt de teller een neutrale opmaak.
  counterEl.className = "neutral";
  counterStateEl.className = "counter-state neutral";
  counterStateEl.textContent = "Status: neutraal";
}

// Luister per knop naar een klik en tel de juiste waarde op of af.
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const value = Number(button.value);

    // Knoppen met de klasse 'subtract' halen een waarde weg, de rest telt erbij op.
    if (button.classList.contains("subtract")) {
      counterVal -= value;
    } else {
      counterVal += value;
    }

    updateCounter();
  });
});

// Zet de teller met de resetknop altijd terug naar nul.
resetButton.addEventListener("click", function () {
  counterVal = 0;
  updateCounter();
});

// Zorg dat de juiste beginstatus zichtbaar is zodra de pagina geladen is.
updateCounter();
