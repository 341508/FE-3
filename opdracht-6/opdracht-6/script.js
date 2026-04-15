"use strict";

// Start de app pas als de hele pagina klaar is met laden.
window.onload = function() {
    startApp();
};

// Bewaar de grafiek in een variabele, zodat een oude grafiek eerst verwijderd kan worden.
let mijnGrafiek = null;

function startApp() {
    // Koppel de zoekknop aan het ophalen van weergegevens voor de ingevulde stad.
    const knop = document.getElementById("searchBtn");
    knop.addEventListener("click", function() {
        const stad = document.getElementById("cityInput").value.trim();
        if (stad !== "") {
            zoekWeer(stad);
        }
    });

    // Laad meteen Utrecht, zodat de pagina niet leeg begint.
    zoekWeer("Utrecht");
}

// Zoek eerst de coördinaten van een stad op en haal daarna de bijbehorende weergegevens op.
async function zoekWeer(stad) {
    try {
        // Stap 1: zoek de breedte- en lengtegraad van de stad op.
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${stad}&count=1&language=nl&format=json`;
        const geoResp = await fetch(geoUrl);
        const geoData = await geoResp.json();

        if (!geoData.results) {
            alert("Stad niet gevonden...");
            return;
        }

        const lat = geoData.results[0].latitude;
        const lon = geoData.results[0].longitude;

        // Stap 2: gebruik die coördinaten om het actuele weer en de voorspelling op te halen.
        const weerUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,is_day,precipitation,weather_code&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`;
        const weerResp = await fetch(weerUrl);
        const weerData = await weerResp.json();

        // Stap 3: zet alle ontvangen gegevens op het scherm.
        toonWeerData(weerData);
        console.log("Weer voor " + stad + " geladen");

    } catch (fout) {
        console.error("Er ging iets mis met het ophalen:", fout);
    }
}

// Koppel de weercodes van de API aan een Nederlandse omschrijving en een icooncode.
const weersOmschrijvingen = {
    0:  { dag: "Zonnig", nacht: "Heldere nacht", icoon: "01" },
    1:  { dag: "Onbewolkt", nacht: "Heldere nacht", icoon: "01" },
    2:  { dag: "Licht bewolkt", nacht: "Licht bewolkt", icoon: "02" },
    3:  { dag: "Bewolkt", nacht: "Bewolkt", icoon: "03" },
    45: { dag: "Mistig", nacht: "Mistig", icoon: "50" },
    48: { dag: "Rijp", nacht: "Rijp", icoon: "50" },
    51: { dag: "Lichte motregen", nacht: "Lichte motregen", icoon: "09" },
    53: { dag: "Motregen", nacht: "Motregen", icoon: "09" },
    55: { dag: "Zware motregen", nacht: "Zware motregen", icoon: "09" },
    61: { dag: "Lichte regen", nacht: "Lichte regen", icoon: "10" },
    63: { dag: "Regen", nacht: "Regen", icoon: "10" },
    65: { dag: "Zware regen", nacht: "Zware regen", icoon: "10" },
    71: { dag: "Lichte sneeuw", nacht: "Lichte sneeuw", icoon: "13" },
    73: { dag: "Sneeuw", nacht: "Sneeuw", icoon: "13" },
    75: { dag: "Zware sneeuw", nacht: "Zware sneeuw", icoon: "13" },
    80: { dag: "Lichte buien", nacht: "Lichte buien", icoon: "09" },
    81: { dag: "Regenbuien", nacht: "Regenbuien", icoon: "09" },
    82: { dag: "Zware buien", nacht: "Zware buien", icoon: "09" },
    95: { dag: "Onweer", nacht: "Onweer", icoon: "11" },
    96: { dag: "Onweer met hagel", nacht: "Onweer met hagel", icoon: "11" },
    99: { dag: "Zwaar onweer", nacht: "Zwaar onweer", icoon: "11" }
};

// Geef bij een weercode de juiste tekst en het juiste icoon voor dag of nacht terug.
function haalWeerInfo(code, isDag) {
    const info = weersOmschrijvingen[code] || { dag: "Onbekend", nacht: "Onbekend", icoon: "03" };
    const suffix = isDag ? "d" : "n";
    return {
        tekst: isDag ? info.dag : info.nacht,
        icoon: `https://openweathermap.org/img/wn/${info.icoon}${suffix}@2x.png`
    };
}

// Verwerk alle weergegevens en vul daarmee de verschillende onderdelen van de pagina.
function toonWeerData(data) {
    const huidig = data.current;
    const isDag = huidig.is_day === 1;
    const info = haalWeerInfo(huidig.weather_code, isDag);

    // Vul het blok met het huidige weer.
    document.getElementById("current-icon").src = info.icoon;
    document.getElementById("current-desc").innerText = info.tekst;
    document.getElementById("current-temp").innerText = "Temperatuur: " + huidig.temperature_2m + "°C";
    document.getElementById("current-feels").innerText = "Voelt als: " + huidig.apparent_temperature + "°C";
    document.getElementById("current-precip").innerText = "Neerslag: " + huidig.precipitation + "mm";

    // Maak eerst het overzicht van de komende zes uur leeg.
    const urenContainer = document.getElementById("hourly-weather");
    urenContainer.innerHTML = "";

    const nu = new Date();
    // Zoek het eerste tijdstip dat gelijk is aan of later valt dan nu.
    let startIndex = data.hourly.time.findIndex(t => new Date(t) >= nu);
    
    // Voeg zes uurvoorspellingen achter elkaar toe aan het urenoverzicht.
    for (let i = startIndex; i < startIndex + 6; i++) {
        const tijdstip = new Date(data.hourly.time[i]);
        const uurIsDag = tijdstip.getHours() >= 6 && tijdstip.getHours() < 21;
        const uurInfo = haalWeerInfo(data.hourly.weather_code[i], uurIsDag);

        const html = `
            <div class="hourly-row">
                <span>${tijdstip.getHours()}:00</span>
                <span>${data.hourly.temperature_2m[i]}°C</span>
                <span>${data.hourly.precipitation[i]} mm</span>
                <img src="${uurInfo.icoon}" width="40" alt="weer">
            </div>
        `;
        urenContainer.innerHTML += html;
    }

    // Maak daarna het overzicht van de komende dagen leeg.
    const dagenContainer = document.getElementById("daily-weather");
    dagenContainer.innerHTML = "";
    
    const weekdagen = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

    // Maak voor elke dag een kaart met temperatuur en weericoon.
    data.daily.time.forEach((dagStr, index) => {
        const dagInfo = haalWeerInfo(data.daily.weather_code[index], true);
        const datum = new Date(dagStr);
        const isVandaag = new Date().toDateString() === datum.toDateString();

        const kaart = document.createElement("div");
        kaart.className = "day-card" + (isVandaag ? " today" : "");
        kaart.innerHTML = `
            <span class="day-name">${isVandaag ? "Vandaag" : weekdagen[datum.getDay()]}</span>
            <img src="${dagInfo.icoon}" alt="weer" width="50">
            <span class="day-max">${data.daily.temperature_2m_max[index]}°C</span>
            <span class="day-min">${data.daily.temperature_2m_min[index]}°C</span>
        `;
        dagenContainer.appendChild(kaart);
    });

    // Werk als laatste de temperatuurgrafiek bij.
    tekenGrafiek(data);
}

// Zet de dagelijkse temperaturen om naar een eenvoudige lijngrafiek.
function tekenGrafiek(data) {
    const weekdagen = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
    const labels = data.daily.time.map(d => {
        const datum = new Date(d);
        return weekdagen[datum.getDay()] + " " + datum.getDate() + "-" + (datum.getMonth() + 1);
    });

    // Verwijder eerst de vorige grafiek, zodat er niet meerdere over elkaar heen komen.
    if (mijnGrafiek) {
        mijnGrafiek.destroy();
    }

    // Teken een nieuwe grafiek met de minimum- en maximumtemperaturen.
    const canvas = document.getElementById("weekChart").getContext("2d");
    mijnGrafiek = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Maximale temp',
                    data: data.daily.temperature_2m_max,
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 71, 87, 0.2)',
                    tension: 0.4
                },
                {
                    label: 'Minimale temp',
                    data: data.daily.temperature_2m_min,
                    borderColor: '#2f3542',
                    backgroundColor: 'rgba(47, 53, 66, 0.2)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: { display: true, text: 'Graden Celsius' }
                }
            }
        }
    });
}
