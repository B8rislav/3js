import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(5, 5, 5);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lights
// 1. Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 2. Directional Light (with shadows)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// 3. Point Light
const pointLight = new THREE.PointLight(0xff6600, 2, 50);
pointLight.position.set(-3, 3, -3);
pointLight.castShadow = true;
scene.add(pointLight);

// Add a small sphere to visualize point light position
const pointLightHelper = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff6600 })
);
pointLightHelper.position.copy(pointLight.position);
scene.add(pointLightHelper);

// Create texture for one of the objects
const textureLoader = new THREE.TextureLoader();
const checkerTexture = createCheckerTexture();

// Object 1: Textured Plane (using BufferGeometry)
const planeGeometry = new THREE.BufferGeometry();
const planeVertices = new Float32Array([
    -5, 0, -5,
    5, 0, -5,
    5, 0, 5,
    -5, 0, 5
]);
const planeIndices = [0, 1, 2, 0, 2, 3];
const planeUVs = new Float32Array([
    0, 0,
    5, 0,
    5, 5,
    0, 5
]);
const planeNormals = new Float32Array([
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0
]);

planeGeometry.setAttribute('position', new THREE.BufferAttribute(planeVertices, 3));
planeGeometry.setAttribute('uv', new THREE.BufferAttribute(planeUVs, 2));
planeGeometry.setAttribute('normal', new THREE.BufferAttribute(planeNormals, 3));
planeGeometry.setIndex(planeIndices);

const planeMaterial = new THREE.MeshStandardMaterial({
    map: checkerTexture,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);

// Object 2: Pyramid (using BufferGeometry)
const pyramidGeometry = new THREE.BufferGeometry();
const pyramidVertices = new Float32Array([
    // Base vertices
    -1, 0, -1,  // 0
    1, 0, -1,   // 1
    1, 0, 1,    // 2
    -1, 0, 1,   // 3
    // Apex
    0, 2, 0     // 4
]);

const pyramidIndices = [
    // Base
    0, 2, 1,
    0, 3, 2,
    // Sides
    0, 1, 4,
    1, 2, 4,
    2, 3, 4,
    3, 0, 4
];

pyramidGeometry.setAttribute('position', new THREE.BufferAttribute(pyramidVertices, 3));
pyramidGeometry.setIndex(pyramidIndices);
pyramidGeometry.computeVertexNormals();

const pyramidMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4488,
    flatShading: true
});
const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
pyramid.position.set(-2, 0, 0);
pyramid.castShadow = true;
pyramid.receiveShadow = true;
scene.add(pyramid);

// Object 3: Cube (standard geometry)
const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x4488ff,
    roughness: 0.5,
    metalness: 0.3
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(2, 0.75, 0);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// Object 4: Sphere (standard geometry)
const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x44ff88,
    roughness: 0.3,
    metalness: 0.7
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0.8, 2.5);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// Helper function to create a checker texture
function createCheckerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    const tileSize = 64;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#ffffff' : '#cccccc';
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

// UI Controls
const ambientIntensitySlider = document.getElementById('ambientIntensity');
const ambientIntensityValue = document.getElementById('ambientIntensityValue');
const directionalIntensitySlider = document.getElementById('directionalIntensity');
const directionalIntensityValue = document.getElementById('directionalIntensityValue');
const pointIntensitySlider = document.getElementById('pointIntensity');
const pointIntensityValue = document.getElementById('pointIntensityValue');
const directionalColorPicker = document.getElementById('directionalColor');
const pointColorPicker = document.getElementById('pointColor');
const cubeColorPicker = document.getElementById('cubeColor');
const pyramidColorPicker = document.getElementById('pyramidColor');
const sphereColorPicker = document.getElementById('sphereColor');

// Event listeners for light intensity
ambientIntensitySlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    ambientLight.intensity = value;
    ambientIntensityValue.textContent = value.toFixed(1);
});

directionalIntensitySlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    directionalLight.intensity = value;
    directionalIntensityValue.textContent = value.toFixed(1);
});

pointIntensitySlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    pointLight.intensity = value;
    pointIntensityValue.textContent = value.toFixed(1);
});

// Event listeners for light colors
directionalColorPicker.addEventListener('input', (e) => {
    directionalLight.color.setStyle(e.target.value);
});

pointColorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    pointLight.color.setStyle(color);
    pointLightHelper.material.color.setStyle(color);
});

// Event listeners for object colors
cubeColorPicker.addEventListener('input', (e) => {
    cubeMaterial.color.setStyle(e.target.value);
});

pyramidColorPicker.addEventListener('input', (e) => {
    pyramidMaterial.color.setStyle(e.target.value);
});

sphereColorPicker.addEventListener('input', (e) => {
    sphereMaterial.color.setStyle(e.target.value);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate objects for visual interest
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    
    pyramid.rotation.y += 0.003;
    
    sphere.rotation.y += 0.002;
    
    // Animate point light
    const time = Date.now() * 0.001;
    pointLight.position.x = Math.sin(time) * 3;
    pointLight.position.z = Math.cos(time) * 3;
    pointLightHelper.position.copy(pointLight.position);
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();