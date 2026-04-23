// SELECT CHART ELEMENT
const chartEl = document.querySelector(".chart");

// CREATE CANVAS ELEMENT
const canvas = document.createElement("canvas");
canvas.width = 50;
canvas.height = 50;

chartEl.appendChild(canvas);

// TO DRAW ON CANVAS, WE NEED TO GET CONTEXT OF CANVAS
const ctx = canvas.getContext("2d");

// CHANGE LINE WIDTH
ctx.lineWidth = 8;

// CIRCLE RADIUS
const R = 20;

function drawCircle(color, ratio, anticlockwise) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    R,
    0,
    ratio * 2 * Math.PI,
    anticlockwise
  );
  ctx.stroke();
}

function updateChart(income, outcome) {
  try {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!Number.isFinite(income) || !Number.isFinite(outcome) || income < 0 || outcome < 0) {
      console.error("[BudgetApp:Chart] Invalid input — income:", income, "outcome:", outcome);
      drawFallbackChart();
      return;
    }

    const total = income + outcome;

    if (total === 0) {
      drawFallbackChart();
      return;
    }

    const ratio = income / total;
    drawCircle("#FFF", -ratio, true);
    drawCircle("#F0624D", 1 - ratio, false);
  } catch (err) {
    console.error("[BudgetApp:Chart] Rendering failed:", err);
    drawFallbackChart();
  }
}

function drawFallbackChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle("#555", 1, false);
}
