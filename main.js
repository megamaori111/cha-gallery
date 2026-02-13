const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg") });
renderer.setSize(window.innerWidth, window.innerHeight);

// Light
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Walls
function createWall(x, z, rotation) {
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 5),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  wall.position.set(x, 2.5, z);
  wall.rotation.y = rotation;
  scene.add(wall);
}

createWall(0, -10, 0);
createWall(0, 10, Math.PI);
createWall(-10, 0, Math.PI / 2);
createWall(10, 0, -Math.PI / 2);

// Art
const loader = new THREE.TextureLoader();

function addArt(url, x, z, rotation) {
  const art = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 2),
    new THREE.MeshBasicMaterial({ map: loader.load(url) })
  );
  art.position.set(x, 2.5, z);
  art.rotation.y = rotation;
  scene.add(art);
}

addArt("https://picsum.photos/400/300", 0, -9.9, 0);
addArt("https://picsum.photos/401/300", -9.9, 0, Math.PI / 2);
addArt("https://picsum.photos/402/300", 9.9, 0, -Math.PI / 2);


// ==========================
// 📱 TOUCH CONTROLS
// ==========================

let previousTouchDistance = null;

// Get distance between two fingers
function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// ZOOM (pinch)
document.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    const distance = getTouchDistance(e.touches);

    if (previousTouchDistance !== null) {
      const delta = distance - previousTouchDistance;

      // Move camera forward/backward
      camera.translateZ(-delta * 0.01);
    }

    previousTouchDistance = distance;
  }
});

// Reset when fingers lifted
document.addEventListener("touchend", () => {
  previousTouchDistance = null;
});


// ==========================
// 👆 LOOK AROUND (1 finger)
// ==========================

let lastX = null;
let lastY = null;

document.addEventListener("touchmove", (e) => {
  if (e.touches.length === 1) {
    const touch = e.touches[0];

    if (lastX !== null && lastY !== null) {
      const deltaX = touch.clientX - lastX;
      const deltaY = touch.clientY - lastY;

      camera.rotation.y -= deltaX * 0.005;
      camera.rotation.x -= deltaY * 0.005;

      // Clamp vertical rotation
      camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
    }

    lastX = touch.clientX;
    lastY = touch.clientY;
  }
});

document.addEventListener("touchend", () => {
  lastX = null;
  lastY = null;
});


// Animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Resize fix
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
