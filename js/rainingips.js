import * as THREE from 'three';

export let animationId;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 0;
camera.position.z = 0;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

document.body.appendChild(renderer.domElement);

const maxY =  10;
const minZ = -10; // Mindestwert für die Z-Position
const maxZ =  -5; // Maximalwert für die Z-Position

function getRandomDomain() {
    const domains = [
        "dremaxx.de",
        "dreon.de",
        "yannickdreher.de",
        "example123.com",
        "randompage.net",
        "testdomain.org",
        "mycoolwebsite.io",
        "demo-site.dev",
        "alpha-beta.biz",
        "gamma-delta.xyz",
        "lorem-ipsum.co",
        "tech-hub.online",
        "blue-ocean.info",
        "green-forest.us",
        "fast-track.pro",
        "hyperloop.site",
        "cloudscape.cloud",
        "bigdata.ai",
        "future-tech.dev",
        "nextgen-solutions.com",
        "quantum-coders.net",
        "skyrocket.biz",
        "pixel-perfect.org",
        "light-speed.io",
        "gravity-wave.us",
        "mars-mission.xyz",
        "cosmic-ray.space",
        "neutron-star.tech",
        "hypernova.dev",
        "supernova.online",
        "nebula-zone.com",
        "dark-matter.org",
        "void-stream.io",
        "planet-x.info",
        "zeta-corp.us",
        "omega-sector.pro",
        "alpha-project.site",
        "digital-dreams.biz",
        "virtual-sky.net",
        "meta-verse.xyz",
        "crypto-galaxy.co",
        "blockchain-io.org",
        "quantum-leap.com",
        "astro-webspace.dev",
        "data-realm.cloud",
        "webtastic.tech",
        "dreamscape.online",
        "infinity-loop.info",
        "cyber-grid.us",
        "future-realm.pro",
        "pixel-vision.xyz",
        "robo-cloud.ai",
        "synthetic-minds.biz",
        "neural-net.org",
        "nano-tech.dev",
        "micro-world.com",
        "eco-grid.site",
        "solar-winds.co",
        "lunar-tech.io",
        "zenith-pro.net",
        "polaris-project.info",
        "stellar-zone.us",
        "galactic-wave.space",
        "orbit-track.tech",
        "astro-byte.online"
    ];
    return domains[Math.floor(Math.random() * domains.length)];
}

function getRandomIp() {
    function computeOctet(){
        return Math.floor(Math.random() * 256);
    }
    return `${computeOctet()}.${computeOctet()}.${computeOctet()}.${computeOctet()}`;
}

function scaleMinMax(value, minInput, maxInput, minOutput, maxOutput) {
    return minOutput + ((value - minInput) / (maxInput - minInput)) * (maxOutput - minOutput);
}

function calculateAlpha(zPosition) {
    const minAlpha = 0.2;
    const maxAlpha = 0.6;
    const alpha = scaleMinMax(zPosition, minZ, maxZ, minAlpha, maxAlpha);
    return alpha;
}

function createTexture(text, zPosition) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    
    const context = canvas.getContext('2d', { alpha: true });  
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = `rgba(0, 0, 0, ${calculateAlpha(zPosition)})`;
    context.font = `bold 48px -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
}

const meshes = [];
for (let i = 0; i < 512; i++) {
    let x = (Math.random() - 0.5) * 20;
    let y = (Math.random() - 0.5) * 20;
    let z =  Math.random() * (maxZ - minZ) + minZ;
    
    if (z < minZ){ z = minZ };
    if (z > maxZ){ z = maxZ };
    
    const texture = createTexture(getRandomIp(), z);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });
    const sprite = new THREE.Sprite(material);
    
    const minScale = 1.0;
    const maxScale = 3.0;
    const normalizedZ = (z - minZ) / (maxZ - minZ)
    const s = scaleMinMax(z, minZ, maxZ, minScale, maxScale);

    sprite.position.set(x, y, z);
    sprite.scale.set(s, s / 4, 1);

    scene.add(sprite);
    meshes.push({ sprite, transitionInProgress: false });
}

function transition(mesh, zPosition) {
    if (mesh.transitionInProgress) return;

    mesh.transitionInProgress = true;
    let progress = 0;
    const duration = 500;

    const interval = setInterval(() => {
        progress += 10;
        
        let fadeOut = Math.max(0, 1 - progress / (duration / 2));
        let fadeIn  = Math.min(1, (progress - duration / 2) / (duration / 2));
        
        if (progress < duration / 2)
        {
            mesh.sprite.material.opacity = fadeOut;
        }
        else if (progress === duration / 2)
        {
            mesh.sprite.material.map = createTexture(getRandomDomain(), zPosition);
        }
        else if (progress > duration / 2)
        {
            mesh.sprite.material.opacity = fadeIn;
        }
        if (progress === duration) {
            clearInterval(interval);
            mesh.transitionInProgress = false;
        }
    }, 10);
}

function animate() {
    animationId = requestAnimationFrame(animate);

    meshes.forEach(mesh => {
        mesh.sprite.position.y -= 0.025;
        
        if (Math.abs(mesh.sprite.position.y - 0) < 0.025) {
            transition(mesh, mesh.sprite.position.z);
        }
        
        if (mesh.sprite.position.y <= -10) {
            mesh.sprite.position.y = maxY;
            mesh.sprite.position.x = (Math.random() - 0.5) * 20;
            
            let z = Math.random() * (maxZ - minZ) + minZ;
            if (z < minZ){ z = minZ };
            if (z > maxZ){ z = maxZ };
            
            mesh.sprite.material.map = createTexture(getRandomIp(), z);
            mesh.sprite.position.z = z;
        }
    });

    renderer.render(scene, camera);
}

export function startAnimation() {
    animate();
}

export function stopAnimation() {
    cancelAnimationFrame(animationId);
    animationId = undefined;
}

startAnimation();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});