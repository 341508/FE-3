// Laat de typ-indicator van de gekozen persoon zien of verberg hem weer.
function show_talking(person, text) {
  let talkElement = document.getElementById(person + "-talks");

  // Als er tekst in het invoerveld staat, verschijnen de drie puntjes.
  if (text.length > 0) {
    talkElement.classList.add("visible");
  } else {
    talkElement.classList.remove("visible");
  }
}

// Maak een chatbericht aan en voeg het onderaan het gesprek toe.
function show_message(person, text) {
  // Selecteer de container waarin alle berichten staan.
  let conversation = document.getElementById("conversation");

  // Maak een nieuw HTML-element voor het bericht.
  let message = document.createElement("div");

  // Voeg algemene en persoonsgebonden classes toe voor de opmaak.
  message.classList.add("message");
  message.classList.add(person);

  // Zet de ingevoerde tekst in het nieuwe bericht.
  message.textContent = text;

  // Voeg het bericht toe aan het gesprek.
  conversation.appendChild(message);

  // Zodra het bericht is verzonden, hoeft de typ-indicator niet meer zichtbaar te zijn.
  let talkElement = document.getElementById(person + "-talks");
  talkElement.classList.remove("visible");
}

// Selecteer alle invoervelden van het formulier.
let textInputs = document.querySelectorAll("input");

// Koppel aan elk invoerveld de logica voor typen en versturen.
textInputs.forEach(function (input) {
  // Haal op bij welke persoon dit invoerveld hoort.
  let person = input.getAttribute("person");

  // Laat tijdens het typen direct zien dat deze persoon aan het typen is.
  input.addEventListener("input", function () {
    show_talking(person, input.value);
  });

  // Verstuur het bericht zodra de waarde van het invoerveld definitief verandert.
  input.addEventListener("change", function () {
    // Toon het bericht in het gesprek.
    show_message(person, input.value);

    // Maak het invoerveld leeg voor het volgende bericht.
    input.value = "";

    // Zet de typ-indicator weer uit.
    show_talking(person, "");
  });
});
