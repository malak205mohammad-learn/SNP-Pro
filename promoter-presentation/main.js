import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let dnaHelix, promoterRegion, rnaPolymerase, transcriptionFactors;
let currentSlide = 0;
const totalSlides = 6;

const slides = [
    {
        title: "Promoter Regions in Genes",
        text: "An Interactive 3D Presentation",
        details: "Welcome! This presentation will explore the critical role of promoter regions in gene expression.",
        cameraPosition: { x: 0, y: 5, z: 15 },
        showDNA: true,
        showPromoter: false,
        showPolymerase: false,
        showTF: false
    },
    {
        title: "What is a Promoter Region?",
        text: "The Control Center of Gene Expression",
        details: `<strong>Promoter regions</strong> are DNA sequences located upstream of genes that serve as binding sites for RNA polymerase and transcription factors.
        <ul>
            <li>Located near the transcription start site (TSS)</li>
            <li>Typically 100-1000 base pairs in length</li>
            <li>Contains specific recognition sequences</li>
            <li>Acts as a molecular "on/off" switch</li>
        </ul>`,
        cameraPosition: { x: -8, y: 3, z: 12 },
        showDNA: true,
        showPromoter: true,
        showPolymerase: false,
        showTF: false
    },
    {
        title: "Key Components",
        text: "TATA Box and Core Elements",
        details: `<strong>Essential promoter elements:</strong>
        <ul>
            <li><strong>TATA Box:</strong> Located ~25-30 bp upstream of TSS</li>
            <li><strong>CAAT Box:</strong> Enhances transcription efficiency</li>
            <li><strong>GC Box:</strong> Found in housekeeping genes</li>
            <li><strong>Initiator (Inr):</strong> Surrounds the TSS</li>
        </ul>
        <br>
        The <span style="color: #ff6b6b;">red highlighted region</span> represents the core promoter area.`,
        cameraPosition: { x: 5, y: 2, z: 10 },
        showDNA: true,
        showPromoter: true,
        showPolymerase: false,
        showTF: false
    },
    {
        title: "Transcription Factors",
        text: "Regulatory Proteins",
        details: `<strong>Transcription factors (TFs)</strong> are proteins that bind to promoter regions to regulate gene expression.
        <ul>
            <li><span style="color: #ffd93d;">Yellow spheres</span> represent transcription factors</li>
            <li>They recognize specific DNA sequences</li>
            <li>Can activate or repress transcription</li>
            <li>Work cooperatively to fine-tune expression</li>
        </ul>`,
        cameraPosition: { x: -6, y: 4, z: 11 },
        showDNA: true,
        showPromoter: true,
        showPolymerase: false,
        showTF: true
    },
    {
        title: "RNA Polymerase Binding",
        text: "Initiating Transcription",
        details: `<strong>RNA Polymerase II</strong> (shown in <span style="color: #6bcf7f;">green</span>) binds to the promoter region to begin transcription.
        <ul>
            <li>Recruited by transcription factors</li>
            <li>Forms the pre-initiation complex</li>
            <li>Unwinds DNA to access template strand</li>
            <li>Synthesizes messenger RNA (mRNA)</li>
        </ul>`,
        cameraPosition: { x: 0, y: 6, z: 13 },
        showDNA: true,
        showPromoter: true,
        showPolymerase: true,
        showTF: true
    },
    {
        title: "Why Promoters Matter",
        text: "Critical for Life and Medicine",
        details: `<strong>Importance of promoter regions:</strong>
        <ul>
            <li><strong>Gene Regulation:</strong> Control when and where genes are expressed</li>
            <li><strong>Development:</strong> Essential for cell differentiation and organism development</li>
            <li><strong>Disease:</strong> Mutations can cause genetic disorders and cancer</li>
            <li><strong>Biotechnology:</strong> Used to control expression in genetic engineering</li>
            <li><strong>Evolution:</strong> Changes in promoters drive evolutionary adaptation</li>
        </ul>`,
        cameraPosition: { x: 0, y: 5, z: 15 },
        showDNA: true,
        showPromoter: true,
        showPolymerase: true,
        showTF: true
    }
];

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 10, 50);

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    addLights();
    createDNAHelix();
    createPromoterRegion();
    createRNAPolymerase();
    createTranscriptionFactors();
    addParticles();

    window.addEventListener('resize', onWindowResize);
    document.getElementById('prev-btn').addEventListener('click', () => changeSlide(-1));
    document.getElementById('next-btn').addEventListener('click', () => changeSlide(1));
    document.addEventListener('keydown', onKeyDown);

    updateSlide();
    animate();
}

function addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 10, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x64c8ff, 0.3);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0x9d64ff, 0.4);
    backLight.position.set(0, -5, -10);
    scene.add(backLight);

    const pointLight1 = new THREE.PointLight(0x64c8ff, 1, 20);
    pointLight1.position.set(-5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6b6b, 0.8, 20);
    pointLight2.position.set(5, 5, -5);
    scene.add(pointLight2);
}

function createDNAHelix() {
    dnaHelix = new THREE.Group();

    const helixLength = 20;
    const helixRadius = 2;
    const turns = 3;
    const segments = 200;

    for (let i = 0; i < segments; i++) {
        const t = (i / segments) * turns * Math.PI * 2;
        const z = (i / segments) * helixLength - helixLength / 2;

        const x1 = Math.cos(t) * helixRadius;
        const y1 = Math.sin(t) * helixRadius;
        const x2 = Math.cos(t + Math.PI) * helixRadius;
        const y2 = Math.sin(t + Math.PI) * helixRadius;

        const geometry1 = new THREE.SphereGeometry(0.15, 16, 16);
        const material1 = new THREE.MeshStandardMaterial({
            color: 0x64c8ff,
            emissive: 0x64c8ff,
            emissiveIntensity: 0.2,
            metalness: 0.3,
            roughness: 0.4
        });
        const sphere1 = new THREE.Mesh(geometry1, material1);
        sphere1.position.set(x1, y1, z);
        sphere1.castShadow = true;
        dnaHelix.add(sphere1);

        const geometry2 = new THREE.SphereGeometry(0.15, 16, 16);
        const material2 = new THREE.MeshStandardMaterial({
            color: 0x9d64ff,
            emissive: 0x9d64ff,
            emissiveIntensity: 0.2,
            metalness: 0.3,
            roughness: 0.4
        });
        const sphere2 = new THREE.Mesh(geometry2, material2);
        sphere2.position.set(x2, y2, z);
        sphere2.castShadow = true;
        dnaHelix.add(sphere2);

        if (i % 5 === 0) {
            const points = [
                new THREE.Vector3(x1, y1, z),
                new THREE.Vector3(x2, y2, z)
            ];
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                opacity: 0.3,
                transparent: true
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            dnaHelix.add(line);
        }
    }

    scene.add(dnaHelix);
}

function createPromoterRegion() {
    promoterRegion = new THREE.Group();

    const geometry = new THREE.CylinderGeometry(2.5, 2.5, 4, 32, 1, true);
    const material = new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        metalness: 0.2,
        roughness: 0.8
    });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotation.x = Math.PI / 2;
    cylinder.position.z = -3;
    promoterRegion.add(cylinder);

    const ringGeometry = new THREE.TorusGeometry(2.5, 0.1, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b6b,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.6
    });
    const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
    ring1.rotation.y = Math.PI / 2;
    ring1.position.z = -5;
    promoterRegion.add(ring1);

    const ring2 = ring1.clone();
    ring2.position.z = -1;
    promoterRegion.add(ring2);

    promoterRegion.visible = false;
    scene.add(promoterRegion);
}

function createRNAPolymerase() {
    rnaPolymerase = new THREE.Group();

    const bodyGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x6bcf7f,
        emissive: 0x6bcf7f,
        emissiveIntensity: 0.3,
        metalness: 0.4,
        roughness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    rnaPolymerase.add(body);

    const subunitGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    const subunit1 = new THREE.Mesh(subunitGeometry, bodyMaterial);
    subunit1.position.set(1, 0.5, 0);
    rnaPolymerase.add(subunit1);

    const subunit2 = new THREE.Mesh(subunitGeometry, bodyMaterial);
    subunit2.position.set(-1, 0.5, 0);
    rnaPolymerase.add(subunit2);

    const subunit3 = new THREE.Mesh(subunitGeometry, bodyMaterial);
    subunit3.position.set(0, -0.8, 0.8);
    rnaPolymerase.add(subunit3);

    rnaPolymerase.position.set(0, 3, -3);
    rnaPolymerase.visible = false;
    scene.add(rnaPolymerase);
}

function createTranscriptionFactors() {
    transcriptionFactors = new THREE.Group();

    const tfPositions = [
        { x: -2, y: 2.5, z: -4 },
        { x: 2, y: 2.5, z: -2 },
        { x: -1.5, y: -2.5, z: -3.5 },
        { x: 1.5, y: -2.5, z: -2.5 }
    ];

    tfPositions.forEach(pos => {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffd93d,
            emissive: 0xffd93d,
            emissiveIntensity: 0.4,
            metalness: 0.5,
            roughness: 0.2
        });
        const tf = new THREE.Mesh(geometry, material);
        tf.position.set(pos.x, pos.y, pos.z);
        tf.castShadow = true;
        transcriptionFactors.add(tf);
    });

    transcriptionFactors.visible = false;
    scene.add(transcriptionFactors);
}

function addParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x64c8ff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
}

function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    if (newSlide >= 0 && newSlide < totalSlides) {
        currentSlide = newSlide;
        updateSlide();
    }
}

function updateSlide() {
    const slide = slides[currentSlide];

    document.getElementById('slide-title').textContent = slide.title;
    document.getElementById('slide-text').textContent = slide.text;
    document.getElementById('slide-details').innerHTML = slide.details;
    document.getElementById('slide-counter').textContent = `${currentSlide + 1} / ${totalSlides}`;

    document.getElementById('prev-btn').disabled = currentSlide === 0;
    document.getElementById('next-btn').disabled = currentSlide === totalSlides - 1;

    animateCameraToPosition(slide.cameraPosition);

    promoterRegion.visible = slide.showPromoter;
    rnaPolymerase.visible = slide.showPolymerase;
    transcriptionFactors.visible = slide.showTF;

    const slideContent = document.getElementById('slide-content');
    slideContent.style.animation = 'none';
    setTimeout(() => {
        slideContent.style.animation = 'slideIn 0.6s ease-out';
    }, 10);
}

function animateCameraToPosition(targetPos) {
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);
    const duration = 1500;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        camera.position.lerpVectors(startPos, endPos, eased);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function onKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        changeSlide(1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        changeSlide(-1);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    dnaHelix.rotation.z += 0.002;

    if (promoterRegion.visible) {
        promoterRegion.children.forEach((child, index) => {
            if (child.geometry.type === 'TorusGeometry') {
                child.rotation.y += 0.01;
            }
        });
    }

    if (rnaPolymerase.visible) {
        rnaPolymerase.position.y = 3 + Math.sin(Date.now() * 0.001) * 0.2;
        rnaPolymerase.rotation.y += 0.005;
    }

    if (transcriptionFactors.visible) {
        transcriptionFactors.children.forEach((tf, index) => {
            tf.position.y += Math.sin(Date.now() * 0.002 + index) * 0.002;
        });
    }

    controls.update();
    renderer.render(scene, camera);
}

init();
