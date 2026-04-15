// Selecteer de profielfoto en de lijst waarin de opleidingen komen te staan.
const photoEl = document.querySelector("img.profile-photo");
const educationListEl = document.querySelector(".education ul");

// Zet de profielfoto via JavaScript, zodat de pagina deze bron direct gebruikt.
photoEl.src = "img/pf.jpg";

// Bewaar de opleidingen in een array met objecten, zodat de inhoud makkelijk uit te breiden is.
const educationArr = [
  {
    title: "ICT MBO Niv 4",
    duration: "sept. 2023 - jun. 2027",
    school: "MBO Utrecht",
    description: "In expedita minus ex ullam, suscipit animi ratione...",
  },
  {
    title: "Middelbaar onderwijs",
    duration: "sept. 2019 - jul. 2023",
    school: "Gelobe College",
    description: "In expedita minus ex ullam, suscipit animi ratione...",
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
