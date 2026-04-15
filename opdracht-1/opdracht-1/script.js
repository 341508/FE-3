// Dit script vult het profiel dynamisch aan.
// De profielfoto wordt ingesteld en de opleidingen worden vanuit een array in de HTML gezet.

// Selecteer de profielfoto en de lijst waarin de opleidingen komen te staan.
const photoEl = document.querySelector("img.profile-photo");
const educationListEl = document.querySelector(".education ul");

// Zet de profielfoto via JavaScript, zodat de pagina deze bron direct gebruikt.
photoEl.src = "img/profile-picture.png";

// Bewaar de opleidingen in een array met objecten, zodat de inhoud makkelijk uit te breiden is.
const educationArr = [
  {
    title: "ICT-opleiding",
    duration: "aug. 2023 - mei 2027",
    school: "Santa Monica College",
    description: "Gericht op programmeren, webdevelopment en het bouwen van praktische digitale projecten.",
  },
  {
    title: "Middelbare school",
    duration: "aug. 2019 - jun. 2023",
    school: "Lincoln High School",
    description: "Algemene middelbare opleiding met vakken zoals wiskunde, Engels en informatica.",
  },
];

// Maak voor elke opleiding een lijstitem aan en voeg dat toe aan de pagina.
educationArr.forEach((edu) => {
  const newItem = document.createElement("li");

  // Bouw de inhoud van het lijstitem op met de gegevens uit het object.
  newItem.innerHTML = `
    <h4>${edu.title}</h4>
    <span class="duration">${edu.duration}</span><br>
    <span class="school">${edu.school}</span>
    <p>${edu.description}</p>
  `;

  // Plaats het nieuwe lijstitem onderaan de opleidingenlijst.
  educationListEl.appendChild(newItem);
});
