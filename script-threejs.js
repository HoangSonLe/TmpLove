// Three.js variables
let scene,
    camera,
    renderer,
    textMeshes = [],
    heartMeshes = [];
let mouseX = 0,
    mouseY = 0;
let targetRotationX = 0,
    targetRotationY = 0;
let currentRotationX = 0,
    currentRotationY = 0;

// Love messages in Vietnamese
const loveMessages = [
    "Anh yêu em",
    "Em là tất cả",
    "Mãi mãi bên nhau",
    "Trái tim anh",
    "Yêu em nhiều lắm",
    "Em là thiên thần",
    "Anh thuộc về em",
    "Tình yêu vĩnh cửu",
    "Em là ánh sáng",
    "Anh chỉ có em",
    "Yêu em từng ngày",
    "Em là cuộc đời anh",
    "Mãi yêu em thôi",
    "Em là duy nhất",
    "Anh sống vì em",
    "Tình yêu chân thành",
    "Em là hạnh phúc",
    "Anh cần em",
    "Yêu em vô điều kiện",
    "Em là tương lai",
    "Anh muốn cưới em",
    "Em là nửa kia",
    "Yêu em mỗi giây",
    "Em hoàn hảo",
    "I love you",
    "You are my everything",
    "Always & Forever",
    "Thank u for",
    "I love u so much",
    "You are my angel",
    "My heart is yours",
    "You complete me",
    "My one true love",
    "Perfect together",
    "Happy Anniversary",
    "Endless love",
];

// Touch tracking variables
let touchStartX = 0,
    touchStartY = 0,
    isTouching = false;

// Initialize Three.js scene
function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera with wider field of view for immersive 360-degree experience
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 0); // Position at center to look around

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a, 1);
    document.getElementById("three-container").appendChild(renderer.domElement);

    // Add lighting for better 3D effect
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 100);
    scene.add(directionalLight);

    // Setup event listeners
    setupEventListeners();

    // Start creating text elements
    createTextElements();

    // Start animation loop
    animate();
}

// Create 3D text elements
function createTextElements() {
    // Create text VERY frequently for heavy rain effect
    setInterval(() => {
        // Create 4-6 texts at once for heavy rain
        for (let i = 0; i < 4 + Math.floor(Math.random() * 3); i++) {
            createTextMesh();
        }
        // Create 1-2 hearts
        for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
            createHeartMesh();
        }
    }, 300); // Much more frequent

    // Create LOTS of initial elements for immediate heavy rain effect
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createTextMesh();
            if (i % 2 === 0) {
                // More hearts
                createHeartMesh();
            }
        }, i * 50); // Very fast initial creation
    }
}

function createTextMesh() {
    // Create text geometry using canvas texture
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 200;

    // Style the text
    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Create gradient text
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#ffb3d9");
    gradient.addColorStop(0.5, "#ff80b3");
    gradient.addColorStop(1, "#ff4d80");

    context.fillStyle = gradient;
    context.font = "bold 72px Inter, Arial, sans-serif"; // Much bigger font
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Add stronger glow effect
    context.shadowColor = "#ff80b3";
    context.shadowBlur = 30;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    context.fillText(message, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create material
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
    });

    // Create geometry - Much bigger text
    const geometry = new THREE.PlaneGeometry(40, 10);

    // Create mesh
    const textMesh = new THREE.Mesh(geometry, material);

    // Position text closer and more densely around the viewer
    const angle = Math.random() * Math.PI * 2; // Random angle around circle
    const radius = 30 + Math.random() * 80; // Much closer to viewer

    textMesh.position.x = Math.cos(angle) * radius;
    textMesh.position.y = 100 + Math.random() * 80; // Higher starting point
    textMesh.position.z = Math.sin(angle) * radius;

    // Make text always face the camera (no random rotation)
    textMesh.lookAt(camera.position);

    // Animation properties - only falling, no rotation
    textMesh.userData = {
        fallSpeed: 0.8 + Math.random() * 0.6, // Slower, more gentle falling
        angle: angle, // Store original angle for reference
        radius: radius,
        startTime: Date.now(),
    };

    scene.add(textMesh);
    textMeshes.push(textMesh);
}

function createHeartMesh() {
    // Create heart using canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 200;

    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#ff6b9d";
    context.font = "bold 120px Arial"; // Bigger hearts
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = "#ff6b9d";
    context.shadowBlur = 25;
    context.fillText("💖", canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
    });

    const geometry = new THREE.PlaneGeometry(15, 15); // Bigger heart geometry
    const heartMesh = new THREE.Mesh(geometry, material);

    // Position hearts closer and more densely around the viewer
    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 70; // Much closer

    heartMesh.position.x = Math.cos(angle) * radius;
    heartMesh.position.y = 100 + Math.random() * 30; // Start from top
    heartMesh.position.z = Math.sin(angle) * radius;

    // Make hearts face the camera
    heartMesh.lookAt(camera.position);

    heartMesh.userData = {
        fallSpeed: 0.6 + Math.random() * 0.5, // Slower, gentle falling
        angle: angle,
        radius: radius,
        startTime: Date.now(),
    };

    scene.add(heartMesh);
    heartMeshes.push(heartMesh);
}

// Setup event listeners
function setupEventListeners() {
    // Mouse events
    document.addEventListener("mousemove", handleMouseMove);

    // Touch events
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    // Window resize
    window.addEventListener("resize", onWindowResize);
}

function handleMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;

    // Gentler rotation range for smooth movement
    targetRotationY = mouseX * 60; // Slower rotation
    targetRotationX = -mouseY * 40; // Slower rotation
}

function handleTouchStart(event) {
    event.preventDefault();
    isTouching = true;
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(event) {
    event.preventDefault();
    if (!isTouching) return;

    const touch = event.touches[0];
    const deltaX = (touch.clientX - touchStartX) / window.innerWidth;
    const deltaY = (touch.clientY - touchStartY) / window.innerHeight;

    mouseX = deltaX * 1.5; // Gentler for mobile
    mouseY = deltaY * 1.5;

    // Clamp values
    mouseX = Math.max(-1, Math.min(1, mouseX));
    mouseY = Math.max(-1, Math.min(1, mouseY));

    // Gentler rotation for mobile
    targetRotationY = mouseX * 60;
    targetRotationX = -mouseY * 40;
}

function handleTouchEnd(event) {
    event.preventDefault();
    isTouching = false;

    // Smooth return to center
    const returnToCenter = () => {
        if (!isTouching) {
            mouseX *= 0.95;
            mouseY *= 0.95;

            targetRotationY = mouseX * 60;
            targetRotationX = -mouseY * 40;

            if (Math.abs(mouseX) > 0.01 || Math.abs(mouseY) > 0.01) {
                requestAnimationFrame(returnToCenter);
            } else {
                mouseX = 0;
                mouseY = 0;
                targetRotationX = 0;
                targetRotationY = 0;
            }
        }
    };
    requestAnimationFrame(returnToCenter);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Slower, smoother camera rotation
    currentRotationX += (targetRotationX - currentRotationX) * 0.03;
    currentRotationY += (targetRotationY - currentRotationY) * 0.03;

    // Apply rotation to camera for true 3D viewing
    camera.rotation.x = THREE.MathUtils.degToRad(currentRotationX);
    camera.rotation.y = THREE.MathUtils.degToRad(currentRotationY);

    // Update text meshes - only falling straight down
    textMeshes.forEach((mesh, index) => {
        mesh.position.y -= mesh.userData.fallSpeed;

        // Keep text facing camera as it falls
        mesh.lookAt(camera.position);

        // Remove if too far down
        if (mesh.position.y < -150) {
            scene.remove(mesh);
            textMeshes.splice(index, 1);
        }
    });

    // Update heart meshes - only falling straight down
    heartMeshes.forEach((mesh, index) => {
        mesh.position.y -= mesh.userData.fallSpeed;

        // Keep hearts facing camera as they fall
        mesh.lookAt(camera.position);

        // Remove if too far down
        if (mesh.position.y < -120) {
            scene.remove(mesh);
            heartMeshes.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}

// Start when page loads
document.addEventListener("DOMContentLoaded", init);
