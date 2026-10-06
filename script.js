import * as THREE from "three";

/* =========================================================
   NEXA 3D EXPERIENCE
   7 Interactive Scenes
========================================================= */

const canvas = document.getElementById("scene");

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

/* =========================================================
   SCENE / CAMERA
========================================================= */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x02040a);

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    200
);

camera.position.set(0, 0, 10);

/* =========================================================
   LIGHT
========================================================= */

const ambientLight = new THREE.AmbientLight(
    0x8abfff,
    0.8
);

scene.add(ambientLight);

const mainLight = new THREE.PointLight(
    0xbfe5ff,
    20,
    60
);

mainLight.position.set(
    4,
    5,
    8
);

scene.add(mainLight);

const secondaryLight = new THREE.PointLight(
    0x5c8cff,
    15,
    50
);

secondaryLight.position.set(
    -5,
    -3,
    5
);

scene.add(secondaryLight);

/* =========================================================
   ROOT
========================================================= */

const root = new THREE.Group();

scene.add(root);

/* =========================================================
   MOUSE / TOUCH
========================================================= */

const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    down: false
};

window.addEventListener("pointermove", (event) => {

    pointer.targetX =
        (event.clientX / window.innerWidth) * 2 - 1;

    pointer.targetY =
        -(event.clientY / window.innerHeight) * 2 + 1;

});

window.addEventListener("pointerdown", () => {
    pointer.down = true;
});

window.addEventListener("pointerup", () => {
    pointer.down = false;
});

/* =========================================================
   SCENE SYSTEM
========================================================= */

let currentScene = 0;

let sceneTime = 0;

let sceneChanging = false;

let experienceStarted = false;

const SCENE_DURATION = 8;

/* =========================================================
   UI
========================================================= */

const intro = document.getElementById("intro");
const ui = document.getElementById("ui");
const startButton = document.getElementById("startButton");

const sceneNumber =
    document.getElementById("sceneNumber");

const title =
    document.getElementById("title");

const description =
    document.getElementById("description");

const eyebrow =
    document.getElementById("eyebrow");

const hint =
    document.getElementById("hint");

const progressFill =
    document.getElementById("progressFill");

const flash =
    document.getElementById("flash");

/* =========================================================
   SCENE INFORMATION
========================================================= */

const sceneInfo = [

    {
        number: "01",
        eyebrow: "DIGITAL INTELLIGENCE",
        title: "NEXA CORE",
        description: "An intelligence taking shape.",
        hint: "MOVE YOUR CURSOR"
    },

    {
        number: "02",
        eyebrow: "CONNECTED INTELLIGENCE",
        title: "NEXA GALAXY",
        description: "Ideas becoming a system.",
        hint: "EXPLORE THE FIELD"
    },

    {
        number: "03",
        eyebrow: "ADAPTIVE SYSTEM",
        title: "NEXA DNA",
        description: "Intelligence continuously evolving.",
        hint: "DISTORT THE STRUCTURE"
    },

    {
        number: "04",
        eyebrow: "COMPUTATIONAL ENERGY",
        title: "NEXA ENERGY",
        description: "Power moving through a living system.",
        hint: "CONTROL THE ENERGY"
    },

    {
        number: "05",
        eyebrow: "ARTIFICIAL ENTITY",
        title: "NEXA ENTITY",
        description: "Intelligence that observes.",
        hint: "MOVE AROUND IT"
    },

    {
        number: "06",
        eyebrow: "INTELLIGENCE ECOSYSTEM",
        title: "NEXA WORLD",
        description: "Many systems. One intelligence.",
        hint: "EXPLORE THE WORLD"
    },

    {
        number: "07",
        eyebrow: "THE FUTURE",
        title: "NEXA",
        description: "Intelligence, built different.",
        hint: "WELCOME TO NEXA"
    }

];

/* =========================================================
   UTILITIES
========================================================= */

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function smoothstep(edge0, edge1, x) {

    const t = THREE.MathUtils.clamp(
        (x - edge0) / (edge1 - edge0),
        0,
        1
    );

    return t * t * (3 - 2 * t);
}

function clearRoot() {

    while (root.children.length > 0) {

        const object = root.children[0];

        object.traverse((child) => {

            if (child.geometry) {
                child.geometry.dispose();
            }

            if (child.material) {

                if (Array.isArray(child.material)) {

                    child.material.forEach(
                        material => material.dispose()
                    );

                } else {

                    child.material.dispose();

                }
            }

        });

        root.remove(object);
    }
}

/* =========================================================
   PARTICLE MATERIAL
========================================================= */

function particleMaterial(
    color = 0xaedcff,
    size = 0.035
) {

    return new THREE.PointsMaterial({

        color,

        size,

        transparent: true,

        opacity: 0.85,

        blending: THREE.AdditiveBlending,

        depthWrite: false

    });
}

/* =========================================================
   GLOBAL STAR FIELD
========================================================= */

const starGeometry =
    new THREE.BufferGeometry();

const starCount = 1800;

const starPositions =
    new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {

    const i3 = i * 3;

    const radius =
        35 + Math.random() * 50;

    const theta =
        Math.random() * Math.PI * 2;

    const phi =
        Math.acos(
            THREE.MathUtils.randFloatSpread(2)
        );

    starPositions[i3] =
        radius * Math.sin(phi) * Math.cos(theta);

    starPositions[i3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta);

    starPositions[i3 + 2] =
        radius * Math.cos(phi);

}

starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        starPositions,
        3
    )
);

const stars = new THREE.Points(
    starGeometry,
    particleMaterial(0x9bcfff, 0.025)
);

scene.add(stars);

/* =========================================================
   SCENE 1 — NEXA CORE
========================================================= */

function createCore() {

    const group = new THREE.Group();

    /* Main sphere */

    const geometry =
        new THREE.IcosahedronGeometry(
            1.7,
            4
        );

    const material =
        new THREE.MeshPhysicalMaterial({

            color: 0x8ed7ff,

            emissive: 0x145b91,

            emissiveIntensity: 1.8,

            metalness: 0.75,

            roughness: 0.2,

            transparent: true,

            opacity: 0.88

        });

    const core =
        new THREE.Mesh(
            geometry,
            material
        );

    group.add(core);

    /* Wire shell */

    const wireGeometry =
        new THREE.IcosahedronGeometry(
            2.05,
            3
        );

    const wireMaterial =
        new THREE.MeshBasicMaterial({

            color: 0xbcecff,

            wireframe: true,

            transparent: true,

            opacity: 0.16

        });

    const wire =
        new THREE.Mesh(
            wireGeometry,
            wireMaterial
        );

    group.add(wire);

    /* Orbit rings */

    for (let i = 0; i < 3; i++) {

        const ringGeometry =
            new THREE.TorusGeometry(
                2.35 + i * 0.18,
                0.008,
                8,
                160
            );

        const ringMaterial =
            new THREE.MeshBasicMaterial({

                color: 0x8edbff,

                transparent: true,

                opacity: 0.45

            });

        const ring =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            );

        ring.rotation.x =
            Math.random() * Math.PI;

        ring.rotation.y =
            Math.random() * Math.PI;

        ring.userData.speed =
            0.3 + Math.random() * 0.5;

        group.add(ring);
    }

    /* Core particles */

    const count = 500;

    const positions =
        new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {

        const r =
            2.5 + Math.random() * 0.8;

        const theta =
            Math.random() * Math.PI * 2;

        const phi =
            Math.acos(
                THREE.MathUtils.randFloatSpread(2)
            );

        positions[i * 3] =
            r * Math.sin(phi) * Math.cos(theta);

        positions[i * 3 + 1] =
            r * Math.sin(phi) * Math.sin(theta);

        positions[i * 3 + 2] =
            r * Math.cos(phi);

    }

    const pGeometry =
        new THREE.BufferGeometry();

    pGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const particleField =
        new THREE.Points(
            pGeometry,
            particleMaterial(
                0x9de2ff,
                0.035
            )
        );

    group.add(particleField);

    return group;
}

/* =========================================================
   SCENE 2 — GALAXY
========================================================= */

function createGalaxy() {

    const group = new THREE.Group();

    const count = 2500;

    const positions =
        new Float32Array(count * 3);

    const colors =
        new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {

        const radius =
            Math.pow(
                Math.random(),
                0.65
            ) * 6.5;

        const angle =
            radius * 1.4 +
            Math.random() * 0.7;

        const spread =
            (Math.random() - 0.5) *
            (0.5 + radius * 0.15);

        const x =
            Math.cos(angle) * radius;

        const z =
            Math.sin(angle) * radius;

        const y =
            spread;

        positions[i * 3] =
            x;

        positions[i * 3 + 1] =
            y;

        positions[i * 3 + 2] =
            z;

        colors[i * 3] =
            0.4 + Math.random() * 0.6;

        colors[i * 3 + 1] =
            0.65 + Math.random() * 0.35;

        colors[i * 3 + 2] =
            1;

    }

    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(
            colors,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({

            size: 0.045,

            vertexColors: true,

            transparent: true,

            opacity: 0.9,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false

        });

    const galaxy =
        new THREE.Points(
            geometry,
            material
        );

    group.add(galaxy);

    /* central core */

    const core =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.55,
                32,
                32
            ),

            new THREE.MeshBasicMaterial({
                color: 0xdaf5ff
            })

        );

    group.add(core);

    return group;
}

/* =========================================================
   SCENE 3 — DNA
========================================================= */

function createDNA() {

    const group = new THREE.Group();

    const particleCount = 650;

    const positions =
        new Float32Array(
            particleCount * 3
        );

    for (let i = 0; i < particleCount; i++) {

        const t =
            (i / particleCount) *
            Math.PI *
            8;

        const y =
            (i / particleCount - 0.5) *
            7;

        const radius = 1.35;

        const side =
            i % 2 === 0 ? 0 : Math.PI;

        positions[i * 3] =
            Math.cos(t + side) * radius;

        positions[i * 3 + 1] =
            y;

        positions[i * 3 + 2] =
            Math.sin(t + side) * radius;

    }

    const geometry =
        new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const dna =
        new THREE.Points(
            geometry,
            particleMaterial(
                0xaadfff,
                0.045
            )
        );

    group.add(dna);

    /* connecting bars */

    for (let i = 0; i < 25; i++) {

        const y =
            -3.2 + i * 0.27;

        const t =
            i * 0.85;

        const x =
            Math.cos(t) * 1.35;

        const z =
            Math.sin(t) * 1.35;

        const barGeometry =
            new THREE.CylinderGeometry(
                0.025,
                0.025,
                2.7,
                8
            );

        const bar =
            new THREE.Mesh(

                barGeometry,

                new THREE.MeshBasicMaterial({
                    color: 0x8bcfff
                })

            );

        bar.position.set(
            0,
            y,
            0
        );

        bar.rotation.z =
            Math.PI / 2;

        bar.rotation.y =
            -t;

        group.add(bar);
    }

    return group;
}

/* =========================================================
   SCENE 4 — ENERGY
========================================================= */

function createEnergy() {

    const group = new THREE.Group();

    const core =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                1.25,
                64,
                64
            ),

            new THREE.MeshPhysicalMaterial({

                color: 0xc6efff,

                emissive: 0x4aaeff,

                emissiveIntensity: 4,

                metalness: 0.1,

                roughness: 0.08

            })

        );

    group.add(core);

    for (let i = 0; i < 14; i++) {

        const radius =
            1.8 + i * 0.22;

        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    radius,
                    0.015,
                    8,
                    180
                ),

                new THREE.MeshBasicMaterial({

                    color: 0x8edfff,

                    transparent: true,

                    opacity:
                        0.15 +
                        Math.random() * 0.3

                })

            );

        ring.rotation.x =
            Math.random() * Math.PI;

        ring.rotation.y =
            Math.random() * Math.PI;

        ring.userData.speed =
            0.3 +
            Math.random();

        group.add(ring);
    }

    return group;
}

/* =========================================================
   SCENE 5 — AI ENTITY
========================================================= */

function createEntity() {

    const group = new THREE.Group();

    /* Head */

    const head =
        new THREE.Mesh(

            new THREE.IcosahedronGeometry(
                1.35,
                3
            ),

            new THREE.MeshPhysicalMaterial({

                color: 0x91d9ff,

                emissive: 0x174d76,

                emissiveIntensity: 2,

                metalness: 0.7,

                roughness: 0.2

            })

        );

    group.add(head);

    /* Eyes */

    const eyeMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

    const eyeGeometry =
        new THREE.SphereGeometry(
            0.13,
            24,
            24
        );

    const leftEye =
        new THREE.Mesh(
            eyeGeometry,
            eyeMaterial
        );

    const rightEye =
        new THREE.Mesh(
            eyeGeometry,
            eyeMaterial
        );

    leftEye.position.set(
        -0.38,
        0.15,
        1.15
    );

    rightEye.position.set(
        0.38,
        0.15,
        1.15
    );

    group.add(
        leftEye,
        rightEye
    );

    /* Halo */

    const halo =
        new THREE.Mesh(

            new THREE.TorusGeometry(
                2,
                0.025,
                8,
                160
            ),

            new THREE.MeshBasicMaterial({

                color: 0x9bdcff,

                transparent: true,

                opacity: 0.6

            })

        );

    halo.rotation.x =
        Math.PI / 2;

    group.add(halo);

    /* floating particles */

    for (let i = 0; i < 120; i++) {

        const particle =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.018,
                    8,
                    8
                ),

                new THREE.MeshBasicMaterial({
                    color: 0x9edfff
                })

            );

        const angle =
            Math.random() *
            Math.PI *
            2;

        const radius =
            2 +
            Math.random() * 1.8;

        particle.position.set(

            Math.cos(angle) *
            radius,

            (Math.random() - 0.5) *
            3,

            Math.sin(angle) *
            radius

        );

        particle.userData.angle =
            angle;

        particle.userData.radius =
            radius;

        particle.userData.speed =
            0.3 +
            Math.random() *
            0.8;

        group.add(particle);
    }

    return group;
}

/* =========================================================
   SCENE 6 — WORLD
========================================================= */

function createWorld() {

    const group = new THREE.Group();

    const planet =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                1.8,
                48,
                48
            ),

            new THREE.MeshPhysicalMaterial({

                color: 0x487da8,

                emissive: 0x071d30,

                emissiveIntensity: 1,

                metalness: 0.4,

                roughness: 0.55

            })

        );

    group.add(planet);

    /* rings */

    for (let i = 0; i < 4; i++) {

        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    2.6 + i * 0.25,
                    0.018,
                    8,
                    150
                ),

                new THREE.MeshBasicMaterial({

                    color: 0x83d6ff,

                    transparent: true,

                    opacity: 0.3

                })

            );

        ring.rotation.x =
            Math.PI / 2 +
            i * 0.1;

        group.add(ring);
    }

    /* orbiting nodes */

    for (let i = 0; i < 16; i++) {

        const node =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.09 +
              
