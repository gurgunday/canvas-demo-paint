/**
 * @author Gurgun Dayioglu, Mariem El Gargouri, Mohamad Satea Almallouhi, Salma Ouadi
 */

const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

toolbar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    ctx.strokeStyle = e.target.value;
  }

  if (e.target.id === "lineWidth") {
    lineWidth = e.target.value;
  }
});

const draw = (e) => {
  e.preventDefault(); // prevent default touch behavior (e.g., scrolling)
  if (!isPainting) {
    return;
  }

  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  // get the position relative to the canvas based on the event type
  const x =
    e.type === "mousedown" || e.type === "mousemove" || e.type === "mouseup"
      ? e.clientX - canvasOffsetX
      : e.touches[0].clientX - canvasOffsetX;
  const y =
    e.type === "mousedown" || e.type === "mousemove" || e.type === "mouseup"
      ? e.clientY - canvasOffsetY
      : e.touches[0].clientY - canvasOffsetY;

  ctx.lineTo(x, y);
  ctx.stroke();
};

canvas.addEventListener("touchstart", (e) => {
  isPainting = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", (e) => {
  isPainting = false;
  ctx.stroke();
  ctx.beginPath();
});

canvas.addEventListener("touchmove", draw);

canvas.addEventListener("mousedown", (e) => {
  isPainting = true;
  startX = e.clientX;
  startY = e.clientY;
});

canvas.addEventListener("mouseup", (e) => {
  isPainting = false;
  ctx.stroke();
  ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

const exportButton = document.getElementById("export");

exportButton.addEventListener("click", () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const points = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i + 3] !== 0) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor(i / 4 / canvas.width);

      points.push({ x, y });
    }
  }

  const data = JSON.stringify(points);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.download = "drawn-image.json";
  link.href = url;
  link.click();
});
