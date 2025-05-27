// Array of text messages
const messages = [
    "Our Anniversary",
    "I love u so much",
    "Thank u for coming",
    "14/05/2024",
    "i would find you",
    "in any lifetime",
    "Forever and always",
    "You are my everything",
    "Happy Anniversary",
    "Love you to the moon",
    "Best day ever",
    "My heart is yours",
    "Together forever",
    "You complete me",
    "Soulmates",
    "Endless love",
    "Always & Forever",
    "My one true love",
    "Perfect together",
    "Dream come true",
];

// Configuration
const speeds = ["speed-1", "speed-2", "speed-3", "speed-4", "speed-5"];
const layers = ["layer1", "layer2", "layer3", "layer4", "layer5"];

// Mouse tracking for 3D rotation
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;

// Create text elements for each layer
function createTextForLayer(layerId, layerIndex) {
    const layer = document.getElementById(layerId);

    // Create initial texts for this layer immediately
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            createSingleTextForLayer(layer, layerIndex);
        }, i * 400); // Even faster initial creation
    }

    // Continue creating texts for this layer - optimized for mobile
    setInterval(() => {
        createSingleTextForLayer(layer, layerIndex);
    }, 1400 + Math.random() * 600); // Frequent creation for mobile
}

function createSingleTextForLayer(layer, layerIndex) {
    const textElement = document.createElement("div");
    textElement.className = "text-item";

    // Random message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    textElement.textContent = randomMessage;

    // Random speed only
    const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
    textElement.classList.add(randomSpeed);

    // Random horizontal position
    textElement.style.left = Math.random() * 80 + 10 + "%";
    textElement.style.top = "-300px"; // Start well above screen

    // Random delay - ensure text starts from outside screen
    textElement.style.animationDelay = Math.random() * 1 + "s";

    layer.appendChild(textElement);

    // Remove element after animation completes
    setTimeout(() => {
        if (textElement.parentNode) {
            textElement.parentNode.removeChild(textElement);
        }
    }, 15000);
}

// Create hearts with higher frequency
function createHearts() {
    const heartsLayer = document.getElementById("heartsLayer");

    // Create multiple hearts more frequently
    setInterval(() => {
        // Create 2-3 hearts at once
        const heartCount = Math.floor(Math.random() * 2) + 2; // 2-3 hearts

        for (let i = 0; i < heartCount; i++) {
            setTimeout(() => {
                const heart = document.createElement("div");
                heart.className = "heart";

                // Random heart types
                const heartTypes = ["❤️", "💖", "💕", "💗", "💝"];
                heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];

                // Random horizontal position
                heart.style.left = Math.random() * 100 + "%";
                heart.style.top = "-120px"; // Start well above screen
                heart.style.animationDelay = Math.random() * 1 + "s";

                heartsLayer.appendChild(heart);

                // Remove heart after animation
                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.parentNode.removeChild(heart);
                    }
                }, 15000);
            }, i * 300); // Stagger creation
        }
    }, 2000); // Every 2 seconds instead of 4
}

// Mouse movement for 3D rotation
function handleMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    targetRotationY = mouseX * 12; // Gentler rotation for mobile
    targetRotationX = -mouseY * 8; // Gentler rotation for mobile
}

// Touch support for mobile
function handleTouchMove(event) {
    event.preventDefault();
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseY = (touch.clientY / window.innerHeight) * 2 - 1;

        targetRotationY = mouseX * 12;
        targetRotationX = -mouseY * 8;
    }
}

function handleTouchStart(event) {
    event.preventDefault();
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseY = (touch.clientY / window.innerHeight) * 2 - 1;

        targetRotationY = mouseX * 12;
        targetRotationX = -mouseY * 8;
    }
}

// Smooth rotation animation
function updateRotation() {
    currentRotationX += (targetRotationX - currentRotationX) * 0.05;
    currentRotationY += (targetRotationY - currentRotationY) * 0.05;

    const scene = document.getElementById("scene");
    scene.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;

    requestAnimationFrame(updateRotation);
}

// Initialize everything
function init() {
    console.log("Starting 3D text animation...");

    // Create text for each layer immediately
    layers.forEach((layerId, index) => {
        console.log(`Creating text for layer: ${layerId}`);
        const layer = document.getElementById(layerId);
        if (layer) {
            console.log(`Layer ${layerId} found, creating text...`);
            createTextForLayer(layerId, index);
        } else {
            console.error(`Layer ${layerId} not found!`);
        }
    });

    // Create hearts
    createHearts();

    // Add mouse event listener
    document.addEventListener("mousemove", handleMouseMove);

    // Add touch support for mobile
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchstart", handleTouchStart);

    // Start rotation animation
    updateRotation();

    // Add click effect
    document.addEventListener("click", createClickEffect);
    document.addEventListener("touchend", createClickEffect);

    console.log("Animation initialized!");
}

// Click effect optimized for mobile
function createClickEffect(event) {
    const heartCount = 10; // Optimized for mobile

    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.style.position = "fixed";

            // Get click position
            const x =
                event.clientX ||
                (event.touches && event.touches[0]
                    ? event.touches[0].clientX
                    : window.innerWidth / 2);
            const y =
                event.clientY ||
                (event.touches && event.touches[0]
                    ? event.touches[0].clientY
                    : window.innerHeight / 2);

            heart.style.left = x + "px";
            heart.style.top = y + "px";
            heart.style.color = "#ff6b9d";
            heart.style.fontSize = "22px";
            heart.style.pointerEvents = "none";
            heart.style.zIndex = "10000";

            // Random heart types
            const heartTypes = ["💖", "💕", "💗", "💝", "❤️"];
            heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
            heart.style.animation = "clickBurst 2s ease-out forwards";

            document.body.appendChild(heart);

            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 2000);
        }, i * 70); // Optimized timing for mobile
    }
}

// Add click burst animation
const style = document.createElement("style");
style.textContent = `
    @keyframes clickBurst {
        0% {
            transform: scale(0) translateY(0px);
            opacity: 1;
        }
        50% {
            transform: scale(1.5) translateY(-50px);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Start when page loads
document.addEventListener("DOMContentLoaded", init);
