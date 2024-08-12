

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const car = document.getElementById('car');

// Resize canvas to fill the viewport
function resizeCanvas() {
    canvas.width = window.innerWidth-100;
    canvas.height = window.innerHeight-100;
    generateRandomPoints(); // Regenerate points on resize
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Generate random positions for the services
var points = [];
function generateRandomPoints() {
    points = [];
    const numPoints = 7;
    // Set the first point at the bottom left corner
    test = [
        "Services 1","Services 2","Services 3","Services 4","Services 5","Services 6","Services 7",
    ]
    points.push({ x: 50, y: canvas.height - 50, label: test[0] });

    for (let i = 1; i < numPoints; i++) {
        const x = Math.random() * (canvas.width - 100) + 50; // Ensure points are within bounds
        const y = Math.random() * (canvas.height - 100) + 50; // Ensure points are within bounds
        points.push({ x: x, y: y, label: test[`${i}`] });
    }
}

// Initial generation of random points
generateRandomPoints();

// Draw a point
function drawPoint(x, y, color = 'green') {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI); // 5 px radius for a 10 px diameter
    ctx.fillStyle = color;
    ctx.fill();
}

// Draw a line between two points with a gradient
function drawLine(from, to, progress, color1 = 'gray', color2 = 'black') {
    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(from.x + (to.x - from.x) * progress, from.y + (to.y - from.y) * progress);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 0.1;
    ctx.stroke();
}

// Draw a label with a box
function drawLabel(x, y, text) {
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    const textWidth = ctx.measureText(text).width;
    const padding = 10;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = 30;
    ctx.fillStyle = 'white';
    ctx.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);
    ctx.fillStyle = 'black';
    ctx.fillText(text, x - textWidth / 2, y + 5);
}

// Draw all points and labels
function drawAllPointsAndLabels() {
    points.forEach(point => {
        drawPoint(point.x, point.y, 'green');
        drawLabel(point.x, point.y - 20, point.label);
    });
}

// Function to animate the connection of points and car movement
function animateLines() {
    let index = 0;
    let progress = 0;
    const speed = 0.02; // Speed of the animation
    const delay = 1000; // Delay between drawing each line

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the current line being animated and move the car
        if (index < points.length - 1) {
            const from = points[index];
            const to = points[index + 1];
            const currentX = from.x + (to.x - from.x) * progress;
            const currentY = from.y + (to.y - from.y) * progress;

            // Move the car
            car.style.left = `${currentX - car.offsetWidth / 2}px`;
            car.style.top = `${currentY - car.offsetHeight / 2}px`;

            // Draw the line segment being animated
            drawLine(from, to, progress);

            // Draw points and labels for all reached points
            for (let i = 0; i <= index; i++) {
                drawPoint(points[i].x, points[i].y, 'green');
                drawLabel(points[i].x, points[i].y - 20, points[i].label);
            }

            // Draw the destination point if reached
            if (progress >= 1) {
                drawPoint(to.x, to.y, 'green');
                drawLabel(to.x, to.y - 20, to.label);
                progress = 0;
                index++;
                setTimeout(animate, delay); // Delay before drawing the next line
            } else {
                progress += speed;
                requestAnimationFrame(animate);
            }
        } else {
            // Once the animation is complete, draw all points and labels
            drawAllPointsAndLabels();
        }
    }

    animate();
}

// Start animation
animateLines();

