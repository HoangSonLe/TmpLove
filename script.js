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

// Enhanced 3D tracking for multi-directional movement
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let targetRotationZ = 0;
let currentRotationX = 0;
let currentRotationY = 0;
let currentRotationZ = 0;
let targetTranslateX = 0;
let targetTranslateY = 0;
let targetTranslateZ = 0;
let currentTranslateX = 0;
let currentTranslateY = 0;
let currentTranslateZ = 0;

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

    // Random delay for both fall and color animations
    const fallDelay = Math.random() * 1;
    const colorDelay = Math.random() * 4; // Random color animation delay

    textElement.style.animationDelay = `${fallDelay}s, ${colorDelay}s`;

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

// Enhanced mouse movement for multi-directional 3D
function handleMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    // Unlimited rotation range for true 3D freedom
    targetRotationY = mouseX * 60; // Much wider left-right rotation
    targetRotationX = -mouseY * 45; // Much wider up-down rotation
    targetRotationZ = mouseX * mouseY * 15; // Enhanced diagonal tilt

    // Extended translation for immersive depth
    targetTranslateX = mouseX * 80;
    targetTranslateY = mouseY * 60;
    targetTranslateZ = (Math.abs(mouseX) + Math.abs(mouseY)) * 40; // Deep Z-movement
}

// Touch tracking variables for camera-like movement
let touchStartX = 0;
let touchStartY = 0;
let touchCurrentX = 0;
let touchCurrentY = 0;
let isTouching = false;

// Enhanced touch support - camera-like movement similar to mouse
function handleTouchStart(event) {
    event.preventDefault();
    if (event.touches.length > 0) {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchCurrentX = touch.clientX;
        touchCurrentY = touch.clientY;
        isTouching = true;
    }
}

function handleTouchMove(event) {
    event.preventDefault();
    if (event.touches.length > 0 && isTouching) {
        const touch = event.touches[0];
        touchCurrentX = touch.clientX;
        touchCurrentY = touch.clientY;

        // Calculate relative movement from touch start position
        const deltaX = (touchCurrentX - touchStartX) / window.innerWidth;
        const deltaY = (touchCurrentY - touchStartY) / window.innerHeight;

        // Convert to normalized coordinates like mouse movement
        mouseX = deltaX * 2; // Amplify movement
        mouseY = deltaY * 2;

        // Clamp values to prevent extreme rotation
        mouseX = Math.max(-1, Math.min(1, mouseX));
        mouseY = Math.max(-1, Math.min(1, mouseY));

        // Apply unlimited camera-like rotation for mobile freedom
        targetRotationY = mouseX * 70; // Wide horizontal rotation for mobile
        targetRotationX = -mouseY * 50; // Wide vertical rotation for mobile
        targetRotationZ = mouseX * mouseY * 18; // Enhanced diagonal tilt

        // Deep translation for immersive mobile experience
        targetTranslateX = mouseX * 90;
        targetTranslateY = mouseY * 70;
        targetTranslateZ = (Math.abs(mouseX) + Math.abs(mouseY)) * 45;
    }
}

function handleTouchEnd(event) {
    event.preventDefault();
    isTouching = false;

    // Gradually return to center position
    const returnSpeed = 0.05;
    const returnToCenter = () => {
        if (!isTouching) {
            mouseX *= 1 - returnSpeed;
            mouseY *= 1 - returnSpeed;

            targetRotationY = mouseX * 70;
            targetRotationX = -mouseY * 50;
            targetRotationZ = mouseX * mouseY * 18;

            targetTranslateX = mouseX * 90;
            targetTranslateY = mouseY * 70;
            targetTranslateZ = (Math.abs(mouseX) + Math.abs(mouseY)) * 45;

            if (Math.abs(mouseX) > 0.01 || Math.abs(mouseY) > 0.01) {
                requestAnimationFrame(returnToCenter);
            } else {
                mouseX = 0;
                mouseY = 0;
                targetRotationX = 0;
                targetRotationY = 0;
                targetRotationZ = 0;
                targetTranslateX = 0;
                targetTranslateY = 0;
                targetTranslateZ = 0;
            }
        }
    };
    requestAnimationFrame(returnToCenter);
}

// Enhanced smooth 3D animation with multi-dimensional movement
function updateRotation() {
    // Smooth interpolation for all transformations
    currentRotationX += (targetRotationX - currentRotationX) * 0.1;
    currentRotationY += (targetRotationY - currentRotationY) * 0.1;
    currentRotationZ += (targetRotationZ - currentRotationZ) * 0.08;
    currentTranslateX += (targetTranslateX - currentTranslateX) * 0.12;
    currentTranslateY += (targetTranslateY - currentTranslateY) * 0.12;
    currentTranslateZ += (targetTranslateZ - currentTranslateZ) * 0.1;

    // Apply all transformations to content only, not background
    const content3d = document.getElementById("content3d");
    content3d.style.transform = `
        scale(1.1)
        translateX(${currentTranslateX}px)
        translateY(${currentTranslateY}px)
        translateZ(${currentTranslateZ}px)
        rotateX(${currentRotationX}deg)
        rotateY(${currentRotationY}deg)
        rotateZ(${currentRotationZ}deg)
    `;

    requestAnimationFrame(updateRotation);
}

// Initialize everything
function init() {
    console.log("Starting enhanced 3D text animation...");

    // Create text for each layer
    layers.forEach((layerId, index) => {
        createTextForLayer(layerId, index);
    });

    // Start hearts
    createHearts();

    // Start 3D rotation updates
    updateRotation();

    console.log("Enhanced 3D animation initialized!");
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
            transform: scale(0.5) translateY(0px);
            opacity: 1;
        }
        50% {
            transform: scale(1.2) translateY(-20px);
            opacity: 0.8;
        }
        100% {
            transform: scale(0.3) translateY(-60px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Event listeners
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);
document.addEventListener("touchend", handleTouchEnd);
document.addEventListener("click", createClickEffect);
document.addEventListener("touchend", createClickEffect);

// Start when page loads
document.addEventListener("DOMContentLoaded", init);
