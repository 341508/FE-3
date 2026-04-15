"use strict";

// Dit script bouwt de cijfergrafiek van opdracht 5 op.
// De gegevens worden gebruikt voor de samenvattingskaarten, de lijngrafiek en de voldoende/ onvoldoende zone.

// Selecteer het canvas van de grafiek en het element waarin de samenvatting komt.
const chartElement = document.getElementById("grade-graph");
const summaryElement = document.getElementById("analytics-summary");

// Vanaf 5,5 is een cijfer voldoende.
const passingGrade = 5.5;

// Bewaar de vakken, cijfers en kleuren centraal, zodat de grafiek en samenvatting dezelfde bron gebruiken.
const subjects = [
    {
        label: "Frontend",
        values: [6.5, 7.2, 8.5, 9.0],
        color: "#76a9fa"
    },
    {
        label: "Backend",
        values: [5.0, 6.0, 7.5, 8.0],
        color: "#f4a049"
    },
    {
        label: "UX/UI Design",
        values: [8.0, 7.5, 9.0, 8.5],
        color: "#b07ce8"
    },
    {
        label: "Databases",
        values: [4.5, 5.5, 6.5, 7.0],
        color: "#71d47d"
    }
];

const labels = ["p1", "p2", "p3", "p4"];

// Teken een subtiele rode zone onder de grens van een voldoende.
const passingZone = {
    id: "passingZone",
    beforeDraw(chart, args, options) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const yScale = chart.scales.y;

        if (!chartArea || !yScale) {
            return;
        }

        const yPixel = yScale.getPixelForValue(options.threshold);

        ctx.save();
        ctx.strokeStyle = options.lineColor;
        ctx.lineWidth = options.lineWidth;
        ctx.setLineDash(options.lineDash);

        ctx.fillStyle = options.fillColor;
        ctx.fillRect(chartArea.left, yPixel, chartArea.right - chartArea.left, chartArea.bottom - yPixel);

        ctx.beginPath();
        ctx.moveTo(chartArea.left, yPixel);
        ctx.lineTo(chartArea.right, yPixel);
        ctx.stroke();

        ctx.restore();
    }
};

// Zet cijfers om naar het Nederlandse formaat met een komma als decimaalteken.
function formatGrade(value) {
    return value.toFixed(1).replace(".", ",");
}

// Laat een verschil zien met plus of min, bijvoorbeeld +1,5 of -0,5.
function formatTrend(value) {
    const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
    return prefix + formatGrade(Math.abs(value));
}

// Bouw de kaarten boven de grafiek op met het laatste cijfer, gemiddelde en de trend per vak.
function renderSummaryCards() {
    summaryElement.innerHTML = subjects.map((subject) => {
        const first = subject.values[0];
        const latest = subject.values[subject.values.length - 1];
        const average = subject.values.reduce((sum, value) => sum + value, 0) / subject.values.length;

        return `
            <article class="summary-card" style="--accent: ${subject.color}">
                <span class="summary-label">${subject.label}</span>
                <strong class="summary-value">${formatGrade(latest)}</strong>
                <span class="summary-meta">Gemiddelde ${formatGrade(average)} | Trend ${formatTrend(latest - first)}</span>
            </article>
        `;
    }).join("");
}

// Maak van de vakgegevens datasets die Chart.js direct kan gebruiken.
const data = {
    labels: labels,
    datasets: subjects.map((subject) => ({
        label: subject.label,
        data: subject.values,
        borderColor: subject.color,
        backgroundColor: subject.color,
        pointBackgroundColor: subject.color,
        pointHoverBackgroundColor: subject.color,
        pointHoverBorderColor: "#ffffff"
    }))
};

// Stel de grafiek in: type, interactie, assen, legenda, tooltip en de plugin voor de onvoldoende zone.
const config = {
    type: "line",
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false
        },
        onHover(event, activeElements, chart) {
            chart.canvas.style.cursor = activeElements.length ? "pointer" : "default";
        },
        elements: {
            line: {
                borderWidth: 3,
                tension: 0.25
            },
            point: {
                radius: 4,
                hoverRadius: 8,
                hoverBorderWidth: 2,
                hitRadius: 20
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Periodes",
                    color: "#ffffff",
                    padding: {
                        top: 16
                    }
                },
                ticks: {
                    color: "#aab2c0"
                },
                grid: {
                    display: false
                },
                border: {
                    display: false
                }
            },
            y: {
                min: 0,
                max: 10,
                title: {
                    display: true,
                    text: "Cijfers",
                    color: "#ffffff"
                },
                ticks: {
                    color: "#aab2c0",
                    stepSize: 1
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.08)"
                },
                border: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#ffffff",
                    usePointStyle: true,
                    boxWidth: 10,
                    boxHeight: 10,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: "#10141b",
                titleColor: "#ffffff",
                bodyColor: "#dce5f2",
                padding: 12,
                displayColors: true,
                callbacks: {
                    label(context) {
                        return `${context.dataset.label}: ${formatGrade(context.parsed.y)}`;
                    }
                }
            },
            passingZone: {
                threshold: passingGrade,
                fillColor: "rgba(255, 109, 90, 0.14)",
                lineColor: "#ff6d5a",
                lineWidth: 2,
                lineDash: [8, 8]
            }
        }
    },
    plugins: [passingZone]
};

// Teken eerst de samenvatting en daarna de grafiek op de pagina.
renderSummaryCards();
new Chart(chartElement, config);
