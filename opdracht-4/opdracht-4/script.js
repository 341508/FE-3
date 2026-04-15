// Selecteer het modalscherm en de knop die het modalscherm opent.
const modalElement = document.querySelector("div#modal");
const openButton = document.querySelector("button#open-modal");

// Toon het modalscherm eerst als flex-container en voeg daarna de zichtbare klasse toe.
openButton.addEventListener("click", () => {
  modalElement.style.display = "flex";
  setTimeout(() => {
    modalElement.classList.add("visible");
  }, 5);
});

// Selecteer het sluit-icoon van het modalscherm.
const closeButton = document.querySelector("div#close-modal");

// Haal eerst de zichtbare klasse weg en verberg het modalscherm pas na de animatie.
closeButton.addEventListener("click", () => {
  modalElement.classList.remove("visible");
  setTimeout(() => {
    modalElement.style.display = "none";
  }, 1200);
});
