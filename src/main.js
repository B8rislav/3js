import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

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

// TransformControls
const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.addEventListener('dragging-changed', (event) => {
    controls.enabled = !event.value;
});
scene.add(transformControls);

// Object management
const sceneObjects = [];
let selectedObject = null;
let objectCounter = 0;

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

// Object 1: Textured Ground Plane (using BufferGeometry)
const planeGeometry = new THREE.BufferGeometry();
const planeVertices = new Float32Array([
    -5, -0.1, -5,
    5, -0.1, -5,
    5, -0.1, 5,
    -5, -0.1, 5
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
plane.userData.name = 'Плоскость';
plane.userData.id = 'plane';
scene.add(plane);
sceneObjects.push(plane);

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
pyramid.position.set(-2, 0.01, 0); // Slightly above ground to prevent z-fighting
pyramid.castShadow = true;
pyramid.receiveShadow = true;
pyramid.userData.name = 'Пирамида';
pyramid.userData.id = 'pyramid';
scene.add(pyramid);
sceneObjects.push(pyramid);

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
cube.userData.name = 'Куб';
cube.userData.id = 'cube';
scene.add(cube);
sceneObjects.push(cube);

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
sphere.userData.name = 'Сфера';
sphere.userData.id = 'sphere';
scene.add(sphere);
sceneObjects.push(sphere);

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

// Model loading functionality
const gltfLoader = new GLTFLoader();
const objLoader = new OBJLoader();
const stlLoader = new STLLoader();

function loadModel(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Validate file extension
    const supportedFormats = ['gltf', 'glb', 'obj', 'stl'];
    if (!supportedFormats.includes(extension)) {
        alert('Неподдерживаемый формат файла. Поддерживаются: ' + supportedFormats.join(', '));
        return;
    }
    
    // Create object URL for the file
    const url = URL.createObjectURL(file);
    
    try {
        switch (extension) {
            case 'gltf':
            case 'glb':
                loadGLTF(url, file.name);
                break;
            case 'obj':
                loadOBJ(url, file.name);
                break;
            case 'stl':
                loadSTL(url, file.name);
                break;
        }
    } catch (error) {
        console.error('Ошибка загрузки модели:', error);
        alert('Ошибка загрузки модели: ' + error.message);
        URL.revokeObjectURL(url);
    }
}

function loadGLTF(url, filename) {
    gltfLoader.load(
        url,
        (gltf) => {
            const model = gltf.scene;
            
            // Check if model has any meshes
            let hasMeshes = false;
            model.traverse((child) => {
                if (child.isMesh) {
                    hasMeshes = true;
                }
            });
            
            if (!hasMeshes) {
                console.warn('GLTF файл не содержит мешей');
                alert('GLTF файл загружен, но не содержит видимых объектов');
            }
            
            setupLoadedModel(model, filename);
            URL.revokeObjectURL(url);
        },
        (progress) => {
            if (progress.total > 0) {
                console.log('Загрузка:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
            }
        },
        (error) => {
            console.error('Ошибка загрузки GLTF:', error);
            let errorMsg = 'Ошибка загрузки GLTF файла.\n';
            if (error.message) {
                errorMsg += 'Детали: ' + error.message;
            } else {
                errorMsg += 'Возможно, файл поврежден или имеет внешние зависимости (текстуры, .bin файлы).\n';
                errorMsg += 'Попробуйте использовать GLB формат (все в одном файле).';
            }
            alert(errorMsg);
            URL.revokeObjectURL(url);
        }
    );
}

function loadOBJ(url, filename) {
    objLoader.load(
        url,
        (model) => {
            setupLoadedModel(model, filename);
            URL.revokeObjectURL(url);
        },
        (progress) => {
            console.log('Загрузка:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
        },
        (error) => {
            console.error('Ошибка загрузки OBJ:', error);
            alert('Ошибка загрузки OBJ файла');
            URL.revokeObjectURL(url);
        }
    );
}

function loadSTL(url, filename) {
    stlLoader.load(
        url,
        (geometry) => {
            const material = new THREE.MeshStandardMaterial({
                color: 0x888888,
                roughness: 0.5,
                metalness: 0.3
            });
            const model = new THREE.Mesh(geometry, material);
            setupLoadedModel(model, filename);
            URL.revokeObjectURL(url);
        },
        (progress) => {
            console.log('Загрузка:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
        },
        (error) => {
            console.error('Ошибка загрузки STL:', error);
            alert('Ошибка загрузки STL файла');
            URL.revokeObjectURL(url);
        }
    );
}

function setupLoadedModel(model, filename) {
    // Center and scale the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    
    model.position.sub(center);
    model.scale.multiplyScalar(scale);
    model.position.y = 1;
    
    // Enable shadows
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    
    // Add to scene
    objectCounter++;
    model.userData.name = filename.replace(/\.[^/.]+$/, '');
    model.userData.id = 'loaded_' + objectCounter;
    scene.add(model);
    sceneObjects.push(model);
    
    // Update object selector
    updateObjectSelector();
    
    console.log('Модель загружена:', filename);
}

// File input handler
const modelInput = document.getElementById('modelInput');
modelInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        loadModel(file);
        e.target.value = ''; // Reset input
    }
});

// Drag and drop handlers
const dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        loadModel(file);
    }
});

dropZone.addEventListener('click', () => {
    modelInput.click();
});

// Object selection and transformation
const objectSelect = document.getElementById('objectSelect');
const posXInput = document.getElementById('posX');
const posYInput = document.getElementById('posY');
const posZInput = document.getElementById('posZ');
const rotXInput = document.getElementById('rotX');
const rotYInput = document.getElementById('rotY');
const rotZInput = document.getElementById('rotZ');
const scaleXInput = document.getElementById('scaleX');
const scaleYInput = document.getElementById('scaleY');
const scaleZInput = document.getElementById('scaleZ');
const applyTransformBtn = document.getElementById('applyTransform');

function updateObjectSelector() {
    objectSelect.innerHTML = '<option value="">-- Выберите объект --</option>';
    sceneObjects.forEach((obj) => {
        const option = document.createElement('option');
        option.value = obj.userData.id;
        option.textContent = obj.userData.name;
        objectSelect.appendChild(option);
    });
}

function updateTransformInputs() {
    if (selectedObject) {
        posXInput.value = selectedObject.position.x.toFixed(2);
        posYInput.value = selectedObject.position.y.toFixed(2);
        posZInput.value = selectedObject.position.z.toFixed(2);
        
        rotXInput.value = THREE.MathUtils.radToDeg(selectedObject.rotation.x).toFixed(0);
        rotYInput.value = THREE.MathUtils.radToDeg(selectedObject.rotation.y).toFixed(0);
        rotZInput.value = THREE.MathUtils.radToDeg(selectedObject.rotation.z).toFixed(0);
        
        scaleXInput.value = selectedObject.scale.x.toFixed(2);
        scaleYInput.value = selectedObject.scale.y.toFixed(2);
        scaleZInput.value = selectedObject.scale.z.toFixed(2);
    } else {
        posXInput.value = '';
        posYInput.value = '';
        posZInput.value = '';
        rotXInput.value = '';
        rotYInput.value = '';
        rotZInput.value = '';
        scaleXInput.value = '';
        scaleYInput.value = '';
        scaleZInput.value = '';
    }
}

objectSelect.addEventListener('change', (e) => {
    const objectId = e.target.value;
    
    if (objectId) {
        selectedObject = sceneObjects.find(obj => obj.userData.id === objectId);
        if (selectedObject) {
            transformControls.attach(selectedObject);
            updateTransformInputs();
        }
    } else {
        selectedObject = null;
        transformControls.detach();
        updateTransformInputs();
    }
});

applyTransformBtn.addEventListener('click', () => {
    if (selectedObject) {
        const posX = parseFloat(posXInput.value);
        const posY = parseFloat(posYInput.value);
        const posZ = parseFloat(posZInput.value);
        const rotX = parseFloat(rotXInput.value);
        const rotY = parseFloat(rotYInput.value);
        const rotZ = parseFloat(rotZInput.value);
        const scaleX = parseFloat(scaleXInput.value);
        const scaleY = parseFloat(scaleYInput.value);
        const scaleZ = parseFloat(scaleZInput.value);
        
        if (!isNaN(posX)) selectedObject.position.x = posX;
        if (!isNaN(posY)) selectedObject.position.y = posY;
        if (!isNaN(posZ)) selectedObject.position.z = posZ;
        
        if (!isNaN(rotX)) selectedObject.rotation.x = THREE.MathUtils.degToRad(rotX);
        if (!isNaN(rotY)) selectedObject.rotation.y = THREE.MathUtils.degToRad(rotY);
        if (!isNaN(rotZ)) selectedObject.rotation.z = THREE.MathUtils.degToRad(rotZ);
        
        if (!isNaN(scaleX)) selectedObject.scale.x = scaleX;
        if (!isNaN(scaleY)) selectedObject.scale.y = scaleY;
        if (!isNaN(scaleZ)) selectedObject.scale.z = scaleZ;
    }
});

// Click to select object
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event) => {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(sceneObjects, true);
    
    if (intersects.length > 0) {
        let clickedObject = intersects[0].object;
        
        // Find the root object in sceneObjects
        while (clickedObject.parent && !sceneObjects.includes(clickedObject)) {
            clickedObject = clickedObject.parent;
        }
        
        if (sceneObjects.includes(clickedObject)) {
            selectedObject = clickedObject;
            objectSelect.value = clickedObject.userData.id;
            transformControls.attach(selectedObject);
            updateTransformInputs();
        }
    }
});

// Update transform inputs when object is moved via TransformControls
transformControls.addEventListener('objectChange', () => {
    updateTransformInputs();
});

// Keyboard shortcuts for transform modes
window.addEventListener('keydown', (event) => {
    if (selectedObject) {
        switch (event.key) {
            case 'g':
            case 'G':
                transformControls.setMode('translate');
                break;
            case 'r':
            case 'R':
                transformControls.setMode('rotate');
                break;
            case 's':
            case 'S':
                transformControls.setMode('scale');
                break;
        }
    }
});

// Initialize object selector
updateObjectSelector();

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