const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const direction = Math.PI / 4;
const speed = 0.5;

function createStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 2,
            color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`,
            brightness: Math.random() * 0.5 + 0.5,
            speed: Math.random() * 0.02 + 0.01
        });
    }
    return stars;
}

const stars = createStars(100);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.brightness += star.speed;
        if (star.brightness > 1 || star.brightness < 0.5) {
            star.speed *= -1;
        }

        star.x += Math.cos(direction) * speed;
        star.y += Math.sin(direction) * speed;

        if (star.x > canvas.width) star.x = 0;
        if (star.x < 0) star.x = canvas.width;
        if (star.y > canvas.height) star.y = 0;
        if (star.y < 0) star.y = canvas.height;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

animate();
