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

// Color animation variables
let colorTime = 0;

// Audio variables
let backgroundMusic = null;
let isAudioInitialized = false;
let isMusicPlaying = false;

// Playlist variables
let playlist = [
    "./music/lonhuanhyeuem.mp3",
    "./music/Christina Perri - A Thousand Years [Official Music Video].mp3",
];
let currentTrackIndex = 0;
let isPlaylistMode = true;

// Function to get animated colors
function getAnimatedColors(time) {
    // Create a smooth cycle: white -> light pink -> light red -> back to white
    const cycle = (Math.sin(time * 0.001) + 1) / 2; // 0 to 1 smooth cycle

    let color1, color2, color3;

    if (cycle < 0.33) {
        // White to light pink
        const t = cycle / 0.33;
        color1 = interpolateColor("#ffffff", "#ffb3d9", t);
        color2 = interpolateColor("#ffffff", "#ff99cc", t);
        color3 = interpolateColor("#ffffff", "#ff80b3", t);
    } else if (cycle < 0.66) {
        // Light pink to light red
        const t = (cycle - 0.33) / 0.33;
        color1 = interpolateColor("#ffb3d9", "#ff9999", t);
        color2 = interpolateColor("#ff99cc", "#ff6666", t);
        color3 = interpolateColor("#ff80b3", "#ff4d4d", t);
    } else {
        // Light red back to white
        const t = (cycle - 0.66) / 0.34;
        color1 = interpolateColor("#ff9999", "#ffffff", t);
        color2 = interpolateColor("#ff6666", "#ffffff", t);
        color3 = interpolateColor("#ff4d4d", "#ffffff", t);
    }

    return { color1, color2, color3 };
}

// Helper function to interpolate between two hex colors
function interpolateColor(color1, color2, factor) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return `rgb(${r}, ${g}, ${b})`;
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

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

// Touch tracking variables for continuous rotation
let touchStartX = 0,
    touchStartY = 0,
    touchLastX = 0,
    touchLastY = 0,
    isTouching = false;
let accumulatedRotationX = 0,
    accumulatedRotationY = 0;

// Audio initialization and control functions
function initializeAudio() {
    if (isAudioInitialized) return;

    try {
        console.log("🎵 Initializing audio system...");

        // Create audio element for background music
        backgroundMusic = new Audio();

        // Enable aggressive loading
        backgroundMusic.crossOrigin = "anonymous";
        backgroundMusic.preload = "auto";

        // Shuffle playlist for random order
        shufflePlaylist();

        // Audio settings for immediate playback
        backgroundMusic.volume = 0.25; // 25% volume for background
        backgroundMusic.preload = "auto";
        backgroundMusic.autoplay = true; // Try native autoplay

        // Load first track from playlist
        loadCurrentTrack();

        // Add event listeners
        backgroundMusic.addEventListener("loadeddata", () => {
            console.log("Track data loaded:", getCurrentTrackName());
            // Try to play immediately when data is loaded
            if (!isMusicPlaying) {
                console.log("Attempting immediate play on loadeddata");
                playBackgroundMusic();
            }
        });

        backgroundMusic.addEventListener("canplay", () => {
            console.log("Track can play:", getCurrentTrackName());
            // Try to play when track can start playing
            if (!isMusicPlaying) {
                console.log("Attempting immediate play on canplay");
                playBackgroundMusic();
            }
        });

        backgroundMusic.addEventListener("canplaythrough", () => {
            console.log("Track loaded successfully:", getCurrentTrackName());
            updateMusicButton(false);
            // Try to play when track is ready
            if (!isMusicPlaying) {
                console.log("Attempting immediate play on canplaythrough");
                playBackgroundMusic();
            }
        });

        backgroundMusic.addEventListener("play", () => {
            updateMusicButton(true);
            console.log("Music started playing:", getCurrentTrackName());
        });

        backgroundMusic.addEventListener("pause", () => {
            updateMusicButton(false);
        });

        backgroundMusic.addEventListener("ended", () => {
            // Auto-play next track when current track ends
            playNextTrack();
        });

        backgroundMusic.addEventListener("error", (e) => {
            console.log("Error loading track:", getCurrentTrackName(), e);
            // Try next track if current one fails
            playNextTrack();
        });

        isAudioInitialized = true;

        // Try to auto-play music immediately - no delay
        console.log("Attempting immediate autoplay");
        playBackgroundMusic();
    } catch (error) {
        console.log("Error initializing audio:", error);
    }
}

function playBackgroundMusic() {
    if (!backgroundMusic || isMusicPlaying) return;

    console.log("Attempting to play music now...");

    // Set volume and ensure it's ready
    backgroundMusic.volume = 0.25;

    backgroundMusic
        .play()
        .then(() => {
            isMusicPlaying = true;
            console.log("✅ Background music started playing automatically");
        })
        .catch((error) => {
            console.log("❌ Autoplay blocked:", error.message);
            console.log("🔄 Setting up interaction listeners...");
            // Add listeners to start music on ANY user interaction
            addInteractionListeners();
        });
}

function addInteractionListeners() {
    // Remove existing listeners first to avoid duplicates
    document.removeEventListener("click", startMusicOnInteraction);
    document.removeEventListener("touchstart", startMusicOnInteraction);
    document.removeEventListener("touchmove", startMusicOnInteraction);
    document.removeEventListener("mousemove", startMusicOnInteraction);
    document.removeEventListener("keydown", startMusicOnInteraction);

    // Add fresh listeners
    document.addEventListener("click", startMusicOnInteraction, { once: true });
    document.addEventListener("touchstart", startMusicOnInteraction, { once: true });
    document.addEventListener("touchmove", startMusicOnInteraction, { once: true });
    document.addEventListener("mousemove", startMusicOnInteraction, { once: true });
    document.addEventListener("keydown", startMusicOnInteraction, { once: true });
}

function startMusicOnInteraction(event) {
    console.log("🎯 User interaction detected:", event.type);
    if (backgroundMusic && !isMusicPlaying) {
        // Immediate play attempt
        backgroundMusic.volume = 0.25;

        backgroundMusic
            .play()
            .then(() => {
                isMusicPlaying = true;
                console.log("✅ Music started after user interaction!");
            })
            .catch((error) => {
                console.log("❌ First attempt failed:", error.message);
                // Immediate retry without delay
                backgroundMusic.load();
                backgroundMusic
                    .play()
                    .then(() => {
                        isMusicPlaying = true;
                        console.log("✅ Music started on immediate retry!");
                    })
                    .catch(() => {
                        console.log("❌ All attempts failed");
                    });
            });
    }
}

function toggleBackgroundMusic() {
    if (!backgroundMusic) return;

    if (isMusicPlaying) {
        backgroundMusic.pause();
        isMusicPlaying = false;
        console.log("Background music paused");
    } else {
        backgroundMusic
            .play()
            .then(() => {
                isMusicPlaying = true;
                console.log("Background music resumed");
            })
            .catch((error) => {
                console.log("Could not resume background music:", error);
            });
    }
}

// Function to update music button appearance
function updateMusicButton(isPlaying) {
    const musicBtn = document.getElementById("musicToggle");
    const musicIcon = document.getElementById("musicIcon");
    const musicText = document.getElementById("musicText");

    if (!musicBtn || !musicIcon || !musicText) return;

    if (isPlaying) {
        musicBtn.classList.add("playing");
        musicIcon.textContent = "🎵";
        musicText.textContent = "Đang phát";
    } else {
        musicBtn.classList.remove("playing");
        musicIcon.textContent = "🎵";
        musicText.textContent = "Nhạc nền";
    }
}

// Playlist management functions
function loadCurrentTrack() {
    if (playlist.length === 0) return;

    const currentTrack = playlist[currentTrackIndex];
    backgroundMusic.src = currentTrack;
    console.log("Loading track:", getCurrentTrackName());
}

function getCurrentTrackName() {
    if (playlist.length === 0) return "Unknown";

    const currentTrack = playlist[currentTrackIndex];
    // Extract filename from path
    const filename = currentTrack.split("/").pop();
    // Remove .mp3 extension and decode URI
    return decodeURIComponent(filename.replace(".mp3", ""));
}

function playNextTrack() {
    if (playlist.length === 0) return;

    // Move to next track
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;

    // Load and play next track
    loadCurrentTrack();

    // Reset playing state
    isMusicPlaying = false;

    // Play the new track
    setTimeout(() => {
        playBackgroundMusic();
    }, 100); // Small delay to ensure track is loaded

    console.log("Playing next track:", getCurrentTrackName());
}

function shufflePlaylist() {
    // Fisher-Yates shuffle algorithm
    for (let i = playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
    }
    console.log("Playlist shuffled");
}

// Initialize Three.js scene
function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera with wider field of view for immersive 360-degree experience
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 0); // Position at center to look around

    // Create renderer with high quality settings
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // High DPI support
    renderer.setClearColor(0x0a0a0a, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.getElementById("three-container").appendChild(renderer.domElement);

    // Add lighting for better 3D effect
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 100);
    scene.add(directionalLight);

    // Initialize background music
    initializeAudio();

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
        // Create 6-10 texts at once for very heavy rain
        for (let i = 0; i < 6 + Math.floor(Math.random() * 5); i++) {
            createTextMesh();
        }
        // Create 2-4 hearts
        for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
            createHeartMesh();
        }
    }, 200); // Even more frequent

    // Create LOTS of initial elements for immediate heavy rain effect
    for (let i = 0; i < 80; i++) {
        setTimeout(() => {
            createTextMesh();
            if (i % 2 === 0) {
                // More hearts
                createHeartMesh();
            }
        }, i * 30); // Even faster initial creation
    }

    // Add multiple layers of creation for better distribution
    for (let layer = 0; layer < 3; layer++) {
        setTimeout(() => {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createTextMesh();
                    if (i % 3 === 0) {
                        createHeartMesh();
                    }
                }, i * 100);
            }
        }, layer * 1000);
    }
}

function createTextMesh() {
    // Create text geometry using high-resolution canvas texture
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    // Much higher resolution for crisp text
    canvas.width = 1600;
    canvas.height = 400;

    // Style the text
    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Create gradient text with animated colors
    const colors = getAnimatedColors(Date.now());
    const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, colors.color1);
    gradient.addColorStop(0.5, colors.color2);
    gradient.addColorStop(1, colors.color3);

    // Enable high-quality text rendering
    context.textRenderingOptimization = "optimizeQuality";
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    context.fillStyle = gradient;
    context.font = "bold 140px Inter, Arial, sans-serif"; // Much bigger font for high-res canvas
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Add stronger glow effect
    context.shadowColor = "#ff80b3";
    context.shadowBlur = 40;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    context.fillText(message, canvas.width / 2, canvas.height / 2);

    // Create texture from canvas with high quality settings
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    // Create material with better settings
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
        alphaTest: 0.1,
        side: THREE.DoubleSide,
    });

    // Create geometry - Even bigger text
    const geometry = new THREE.PlaneGeometry(60, 15);

    // Create mesh
    const textMesh = new THREE.Mesh(geometry, material);

    // Better distribution around the viewer for even coverage
    const angle = Math.random() * Math.PI * 2; // Random angle around circle
    const radius = 80 + Math.random() * 120; // Further from viewer

    // Add some randomness to create more natural distribution
    const offsetX = (Math.random() - 0.5) * 40; // Random X offset
    const offsetZ = (Math.random() - 0.5) * 40; // Random Z offset

    textMesh.position.x = Math.cos(angle) * radius + offsetX;
    textMesh.position.y = 200 + Math.random() * 50; // Start high above screen
    textMesh.position.z = Math.sin(angle) * radius + offsetZ;

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
    // Create heart using high-resolution canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;

    // Enable high-quality rendering
    context.textRenderingOptimization = "optimizeQuality";
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    context.fillStyle = "rgba(0, 0, 0, 0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#ff6b9d";
    context.font = "bold 240px Arial"; // Much bigger hearts for high-res
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.shadowColor = "#ff6b9d";
    context.shadowBlur = 30;
    context.fillText("💖", canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        alphaTest: 0.1,
        side: THREE.DoubleSide,
    });

    const geometry = new THREE.PlaneGeometry(20, 20); // Even bigger heart geometry
    const heartMesh = new THREE.Mesh(geometry, material);

    // Better distribution around the viewer for even coverage
    const angle = Math.random() * Math.PI * 2;
    const radius = 60 + Math.random() * 100; // Further from viewer

    // Add some randomness to create more natural distribution
    const offsetX = (Math.random() - 0.5) * 30; // Random X offset
    const offsetZ = (Math.random() - 0.5) * 30; // Random Z offset

    heartMesh.position.x = Math.cos(angle) * radius + offsetX;
    heartMesh.position.y = 190 + Math.random() * 40; // Start high above screen
    heartMesh.position.z = Math.sin(angle) * radius + offsetZ;

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

    // Add additional music start triggers
    document.addEventListener("click", tryStartMusic);
    document.addEventListener("touchstart", tryStartMusic);
    document.addEventListener("keydown", tryStartMusic);
    window.addEventListener("focus", tryStartMusic);
}

// Function to try starting music on any interaction
function tryStartMusic() {
    if (backgroundMusic && !isMusicPlaying && isAudioInitialized) {
        console.log("🎯 Attempting to start music from interaction");

        // Ensure volume is set
        backgroundMusic.volume = 0.25;

        backgroundMusic
            .play()
            .then(() => {
                isMusicPlaying = true;
                console.log("✅ Music started successfully from interaction");
            })
            .catch((error) => {
                console.log("❌ Music start failed from interaction:", error.message);
                // Set up interaction listeners if not already playing
                addInteractionListeners();
            });
    }
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
    touchLastX = touch.clientX;
    touchLastY = touch.clientY;
}

function handleTouchMove(event) {
    event.preventDefault();
    if (!isTouching) return;

    const touch = event.touches[0];

    // Calculate movement delta from last position (not start position)
    const deltaX = touch.clientX - touchLastX;
    const deltaY = touch.clientY - touchLastY;

    // Update last position
    touchLastX = touch.clientX;
    touchLastY = touch.clientY;

    // Accumulate rotation for continuous 360-degree movement
    accumulatedRotationY += deltaX * 0.5; // Horizontal swipe = Y rotation (look left/right)
    accumulatedRotationX += deltaY * 0.3; // Vertical swipe = X rotation (look up/down)

    // Clamp vertical rotation to prevent over-rotation
    accumulatedRotationX = Math.max(-90, Math.min(90, accumulatedRotationX));

    // Set target rotations for smooth interpolation
    targetRotationY = accumulatedRotationY;
    targetRotationX = -accumulatedRotationX;
}

function handleTouchEnd(event) {
    event.preventDefault();
    isTouching = false;
    // Keep current rotation when touch ends - no return to center
    // This allows for continuous 360-degree viewing
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update color animation time
    colorTime += 16; // Approximately 60fps

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
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 DOM loaded, initializing...");
    init();

    // Immediate attempts without delay
    if (!isMusicPlaying && isAudioInitialized) {
        console.log("🎵 Immediate music start attempt");
        playBackgroundMusic();
    }
});

// Also try when window loads
window.addEventListener("load", () => {
    console.log("🌐 Window loaded");
    if (!isMusicPlaying && isAudioInitialized) {
        console.log("🎵 Window load music attempt");
        tryStartMusic();
    }
});

// Try on page visibility change (when user returns to tab)
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !isMusicPlaying && isAudioInitialized) {
        console.log("👁️ Page visible, attempting music start");
        tryStartMusic();
    }
});
