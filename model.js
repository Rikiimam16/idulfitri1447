import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ============================================
// INISIALISASI SCENE
// ============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1f2a);
scene.fog = new THREE.FogExp2(0x0a1f2a, 0.015);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(8, 4, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.7;
controls.enableZoom = true;
controls.maxPolarAngle = Math.PI / 2.2;
controls.minDistance = 4;
controls.maxDistance = 20;
controls.target.set(0, 0.5, 0);

// ============================================
// PENCAHAYAAN
// ============================================
const ambientLight = new THREE.AmbientLight(0x505080);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
dirLight.position.set(5, 10, 6);
dirLight.castShadow = true;
dirLight.receiveShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
const d = 10;
dirLight.shadow.camera.left = -d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = -d;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 20;
scene.add(dirLight);

const pointLight1 = new THREE.PointLight(0xffaa33, 1.2, 20);
pointLight1.position.set(3, 4, 3);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x44aaff, 0.8, 20);
pointLight2.position.set(-3, 3, -3);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xff8844, 1.0, 18);
pointLight3.position.set(2, 5, -3);
scene.add(pointLight3);

// ============================================
// LANTAI DENGAN POLA
// ============================================
const floorGeometry = new THREE.CircleGeometry(15, 64);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a4a3a, 
    emissive: 0x0a2a1a,
    transparent: true, 
    opacity: 0.15,
    side: THREE.DoubleSide
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.2;
floor.receiveShadow = true;
scene.add(floor);

// LINGKARAN DEKORATIF
const ringGeometry = new THREE.TorusGeometry(3.0, 0.12, 32, 100);
const ringMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffaa33, 
    emissive: 0x884400,
    emissiveIntensity: 0.5,
    transparent: true, 
    opacity: 0.5 
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
ring.position.y = -1.0;
scene.add(ring);

const ring2 = new THREE.TorusGeometry(2.0, 0.1, 32, 100);
const ring2Material = new THREE.MeshStandardMaterial({ 
    color: 0x44aaff, 
    emissive: 0x224488,
    emissiveIntensity: 0.5,
    transparent: true, 
    opacity: 0.4 
});
const ring2Obj = new THREE.Mesh(ring2, ring2Material);
ring2Obj.rotation.x = Math.PI / 2;
ring2Obj.position.y = -1.0;
scene.add(ring2Obj);

const ring3 = new THREE.TorusGeometry(1.0, 0.08, 32, 100);
const ring3Material = new THREE.MeshStandardMaterial({ 
    color: 0xffdd88, 
    emissive: 0x885522,
    emissiveIntensity: 0.5,
    transparent: true, 
    opacity: 0.3 
});
const ring3Obj = new THREE.Mesh(ring3, ring3Material);
ring3Obj.rotation.x = Math.PI / 2;
ring3Obj.position.y = -1.0;
scene.add(ring3Obj);

// Titik-titik cahaya
const dotCount = 12;
const dotGroup = new THREE.Group();
for (let i = 0; i < dotCount; i++) {
    const angle = (i / dotCount) * Math.PI * 2;
    const x = Math.cos(angle) * 3.0;
    const z = Math.sin(angle) * 3.0;
    
    const dotGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const dotMat = new THREE.MeshStandardMaterial({ color: 0xffaa33, emissive: 0xffaa33, emissiveIntensity: 0.8 });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.set(x, -0.9, z);
    dotGroup.add(dot);
}
scene.add(dotGroup);

// Simpan referensi lingkaran untuk bisa dihide/show
const decorativeRings = [ring, ring2Obj, ring3Obj, dotGroup];

// Fungsi untuk mengatur visibilitas lingkaran
function setRingsVisibility(visible) {
    decorativeRings.forEach(item => {
        item.visible = visible;
    });
}

// ============================================
// BINTANG LATAR
// ============================================
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 2000;
const starsPositions = new Float32Array(starsCount * 3);

for (let i = 0; i < starsCount * 3; i += 3) {
    const r = 60 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    starsPositions[i] = r * Math.sin(phi) * Math.cos(theta);
    starsPositions[i+1] = r * Math.sin(phi) * Math.sin(theta);
    starsPositions[i+2] = r * Math.cos(phi);
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));

const starsMaterial = new THREE.PointsMaterial({ 
    color: 0xffffff, 
    size: 0.15, 
    transparent: true, 
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// ============================================
// BINTANG JATUH
// ============================================
const shootingStars = [];

function createShootingStar() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(2 * 3);
    const startX = (Math.random() - 0.5) * 40;
    const startY = 20 + Math.random() * 10;
    const startZ = (Math.random() - 0.5) * 40;
    const endX = startX + (Math.random() - 0.5) * 20;
    const endY = startY - 15 - Math.random() * 10;
    const endZ = startZ + (Math.random() - 0.5) * 20;
    
    positions[0] = startX; positions[1] = startY; positions[2] = startZ;
    positions[3] = endX; positions[4] = endY; positions[5] = endZ;
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const warnaOptions = [
        new THREE.Color(0x44aaff),
        new THREE.Color(0x2288ff),
        new THREE.Color(0x44ff88),
        new THREE.Color(0x22cc44),
        new THREE.Color(0xffdd44),
        new THREE.Color(0xffaa00)
    ];
    
    const warna = warnaOptions[Math.floor(Math.random() * warnaOptions.length)];
    
    const material = new THREE.LineBasicMaterial({ 
        color: warna,
        transparent: true,
        opacity: 1
    });
    
    const star = new THREE.Line(geometry, material);
    star.userData = {
        life: 1.0,
        speed: 0.005 + Math.random() * 0.01
    };
    
    return star;
}

for (let i = 0; i < 4; i++) {
    const star = createShootingStar();
    shootingStars.push(star);
    scene.add(star);
}

// ============================================
// PARTIKEL GEMERLAP
// ============================================
const sparkleGeometry = new THREE.BufferGeometry();
const sparkleCount = 300;
const sparklePositions = new Float32Array(sparkleCount * 3);
const sparkleColors = new Float32Array(sparkleCount * 3);

for (let i = 0; i < sparkleCount; i++) {
    sparklePositions[i*3] = (Math.random() - 0.5) * 25;
    sparklePositions[i*3+1] = (Math.random() - 0.5) * 15;
    sparklePositions[i*3+2] = (Math.random() - 0.5) * 25;
    
    const colorRand = Math.random();
    if (colorRand < 0.6) {
        sparkleColors[i*3] = 1.0; sparkleColors[i*3+1] = 0.9; sparkleColors[i*3+2] = 0.5;
    } else if (colorRand < 0.8) {
        sparkleColors[i*3] = 0.8; sparkleColors[i*3+1] = 0.9; sparkleColors[i*3+2] = 1.0;
    } else {
        sparkleColors[i*3] = 1.0; sparkleColors[i*3+1] = 0.8; sparkleColors[i*3+2] = 0.9;
    }
}

sparkleGeometry.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
sparkleGeometry.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3));

function createSparkleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,0,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    
    return new THREE.CanvasTexture(canvas);
}

const sparkleMaterial = new THREE.PointsMaterial({
    size: 0.2,
    map: createSparkleTexture(),
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
});

const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
scene.add(sparkles);

// ============================================
// AWAN (LEBIH PUTIH DAN TEBAL)
// ============================================
function createCloud(x, y, z, scale) {
    const group = new THREE.Group();
    
    const cloudMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xcccccc,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        roughness: 0.2,
        metalness: 0.1
    });
    
    const spheres = [
        { pos: [0, 0, 0], scale: 1.2 },
        { pos: [1.2, 0.3, 0.4], scale: 1.0 },
        { pos: [-1.1, -0.2, 0.5], scale: 0.9 },
        { pos: [0.6, 0.6, -0.6], scale: 0.8 },
        { pos: [-0.4, -0.4, 0.9], scale: 0.7 },
        { pos: [0.9, -0.3, -0.8], scale: 0.7 }
    ];
    
    spheres.forEach(s => {
        const geo = new THREE.SphereGeometry(1.4 * s.scale, 8, 8);
        const mesh = new THREE.Mesh(geo, cloudMaterial);
        mesh.position.set(s.pos[0], s.pos[1], s.pos[2]);
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        group.add(mesh);
    });
    
    group.position.set(x, y, z);
    group.scale.set(scale, scale * 0.6, scale);
    
    return group;
}

const cloud1 = createCloud(-8, 8, -7, 2.2);
scene.add(cloud1);
const cloud2 = createCloud(8, 9, -4, 2.5);
scene.add(cloud2);
const cloud3 = createCloud(3, 11, 6, 2.2);
scene.add(cloud3);

// ============================================
// LOADER MODEL DENGAN SIMPLE SCALE-IN ANIMATION
// ============================================
const gltfLoader = new GLTFLoader();
let currentModel = null;
let activeRequestId = 0;
let isAnimating = false;
let pendingTransition = null;

// Fungsi untuk membersihkan model lama dengan aman
function disposeModel(model) {
    if (!model) return;
    
    model.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.forEach(m => m.dispose());
            } else {
                obj.material.dispose();
            }
        }
    });
}

// Fungsi untuk mendapatkan target scale dan position berdasarkan index
function getModelTargets(index) {
    let target = {
        scale: 1.5,
        posX: 0,
        posY: 0,
        posZ: 0
    };
    
    if (index === 0) { // Masjid
        target.scale = 0.3;
        target.posY = 0.5;
    } else if (index === 1) { // Kabah
        target.scale = 0.3;
        target.posY = -1.2;
    } else if (index === 2) { // Al-Quran
        target.scale = 5;
        target.posY = -0.5;
    } else if (index === 3) { // Ketupat
        target.scale = 3;
        target.posY = 2;
    } else if (index === 4) { // Bulan Sabit
        target.scale = 3;
        target.posY = 2;
        target.posZ = -0.5;
    } else if (index === 5) { // Lentera
        target.scale = 3;
        target.posY = 2;
    } else if (index === 6) { // Bedug
        target.scale = 1;
        target.posY = -0.78;
        target.posZ = 0.9;
    } else if (index === 7) { // Opor Ayam
        target.scale = 2;
        target.posY = 0;
    } else if (index === 8) { // Nastar
        target.scale = 2;
        target.posY = 0.2;
    } else if (index === 9) { // THR
        target.scale = 2.5;
        target.posY = 1.5;
    }
    
    return target;
}

// Fungsi untuk menyesuaikan skala model berdasarkan index
function adjustModelScale(model, index) {
    const targets = getModelTargets(index);
    model.scale.set(targets.scale, targets.scale, targets.scale);
    model.position.set(targets.posX, targets.posY, targets.posZ);
}

// Fungsi untuk animasi model lama keluar
function animateOutOldModel(callback) {
    if (!currentModel) {
        if (callback) callback();
        return;
    }
    
    const oldModel = currentModel;
    
    controls.autoRotate = false;
    
    gsap.to(oldModel.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.3,
        ease: "power2.in",
        onUpdate: () => {
            oldModel.scale.set(oldModel.scale.x, oldModel.scale.y, oldModel.scale.z);
        },
        onComplete: () => {
            if (oldModel && oldModel.parent) {
                scene.remove(oldModel);
                disposeModel(oldModel);
            }
            if (callback) callback();
        }
    });
}

// Fungsi untuk memuat dan menganimasi model baru
function loadAndAnimateNewModel(index, filePath, fileType, requestId) {
    // Atur visibilitas lingkaran
    if (index === 0 || index === 1) {
        setRingsVisibility(false);
        console.log('Lingkaran disembunyikan untuk Masjid/Kabah');
    } else {
        setRingsVisibility(true);
        console.log('Lingkaran ditampilkan');
    }
    
    // Update header di HTML (akan dipanggil melalui event)
    if (window.updateHeaderForModel) {
        // Panggil dengan delay agar sinkron
        setTimeout(() => {
            window.updateHeaderForModel(index);
        }, 50);
    }
    
    gltfLoader.load(
        filePath,
        (gltf) => {
            if (requestId !== activeRequestId) {
                console.log(`⚠️ [Req ${requestId}] Dibatalkan, request lebih baru ada`);
                return;
            }
            
            const model = gltf.scene;
            const targets = getModelTargets(index);
            
            model.position.set(targets.posX, targets.posY, targets.posZ);
            model.scale.set(0, 0, 0);
            
            if (index === 4) {
                model.traverse((node) => {
                    if (node.isMesh) {
                        if (node.material) {
                            if (Array.isArray(node.material)) {
                                node.material.forEach(mat => {
                                    mat.emissive = new THREE.Color(0xffaa33);
                                    mat.emissiveIntensity = 1.5;
                                });
                            } else {
                                node.material.emissive = new THREE.Color(0xffaa33);
                                node.material.emissiveIntensity = 1.5;
                            }
                        }
                    }
                });
            }
            
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            scene.add(model);
            currentModel = model;
            
            document.getElementById('progressBar').style.width = '100%';
            document.getElementById('loadingStatus').innerText = 'Model siap!';
            console.log(`✅ [Req ${requestId}] Model ${index} loaded`);
            
            gsap.to(model.scale, {
                x: targets.scale,
                y: targets.scale,
                z: targets.scale,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => {
                    isAnimating = false;
                    controls.autoRotate = true;
                    
                    window.dispatchEvent(new Event('modelsLoaded'));
                    
                    if (pendingTransition) {
                        const { idx, path, type, reqId } = pendingTransition;
                        pendingTransition = null;
                        startTransition(idx, path, type, reqId);
                    }
                }
            });
        },
        (xhr) => {
            const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
            document.getElementById('loadingStatus').innerText = `Memuat model... ${percent}%`;
            document.getElementById('progressBar').style.width = percent + '%';
        },
        (error) => {
            if (requestId !== activeRequestId) {
                console.log(`⚠️ [Req ${requestId}] Error dibatalkan, request lebih baru ada`);
                return;
            }
            
            console.error(`❌ [Req ${requestId}] Gagal load GLB:`, error);
            handleLoadError();
            
            isAnimating = false;
            controls.autoRotate = true;
        }
    );
}

// Fungsi utama untuk memulai transisi
function startTransition(index, filePath, fileType, requestId) {
    if (isAnimating) {
        pendingTransition = {
            idx: index,
            path: filePath,
            type: fileType,
            reqId: requestId
        };
        console.log('Animasi sedang berlangsung, transisi ditunda');
        return;
    }
    
    isAnimating = true;
    window.dispatchEvent(new Event('loadingStarted'));
    
    animateOutOldModel(() => {
        loadAndAnimateNewModel(index, filePath, fileType, requestId);
    });
}

// Fungsi untuk memuat model berdasarkan indeks
function loadModel(index, filePath, fileType) {
    index = Math.min(Math.max(index, 0), 9);
    const requestId = ++activeRequestId;
    console.log(`🔄 [Req ${requestId}] Request model ${index}: ${filePath}`);
    startTransition(index, filePath, fileType, requestId);
}

// Fungsi untuk menangani error loading
function handleLoadError() {
    document.getElementById('loadingStatus').innerText = 'Gagal memuat model';
    
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const material = new THREE.MeshStandardMaterial({ color: 0xffaa33 });
    const cube = new THREE.Mesh(geometry, material);
    
    cube.position.set(0, 0.3, 0);
    cube.scale.set(0, 0, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    currentModel = cube;
    
    gsap.to(cube.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
            window.dispatchEvent(new Event('modelsLoaded'));
        }
    });
}

// Inisialisasi model pertama
function initFirstModel() {
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const material = new THREE.MeshStandardMaterial({ color: 0xffaa33 });
    const cube = new THREE.Mesh(geometry, material);
    
    cube.position.set(0, 0.5, 0);
    cube.scale.set(0, 0, 0);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    currentModel = cube;
    
    setRingsVisibility(false);
    
    gsap.to(cube.scale, {
        x: 0.3,
        y: 0.3,
        z: 0.3,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
            window.dispatchEvent(new Event('modelsLoaded'));
        }
    });
    
    setTimeout(() => {
        loadModel(0, 'models/masjid/masjid.glb', 'glb');
    }, 200);
}

initFirstModel();

window.addEventListener('changeModel', (event) => {
    loadModel(event.detail.index, event.detail.file, event.detail.type);
});

setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
}, 3000);

// ============================================
// ANIMASI
// ============================================
let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const elapsedTime = performance.now() * 0.001;
    
    stars.rotation.y += 0.0001;
    
    shootingStars.forEach((star, index) => {
        star.userData.life -= star.userData.speed;
        star.material.opacity = star.userData.life;
        
        if (star.userData.life <= 0) {
            scene.remove(star);
            shootingStars.splice(index, 1);
            
            const newStar = createShootingStar();
            shootingStars.push(newStar);
            scene.add(newStar);
        }
    });
    
    if (shootingStars.length < 5 && Math.random() < 0.01) {
        const newStar = createShootingStar();
        shootingStars.push(newStar);
        scene.add(newStar);
    }
    
    cloud1.position.x += 0.001;
    cloud2.position.x -= 0.0015;
    cloud3.position.z += 0.001;
    
    if (cloud1.position.x > 12) cloud1.position.x = -12;
    if (cloud2.position.x < -12) cloud2.position.x = 12;
    if (cloud3.position.z > 12) cloud3.position.z = -12;
    
    sparkles.material.opacity = 0.5 + Math.sin(elapsedTime * 2) * 0.2;
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}