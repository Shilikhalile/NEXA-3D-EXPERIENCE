/* =========================================================
   NEXA 3D INTERACTIVE EXPERIENCE
   ========================================================= */

const canvas = document.getElementById("canvas");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505);

scene.fog = new THREE.FogExp2(
    0x050505,
    0.045
);


/* =========================================================
   CAMERA
   ========================================================= */

const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(
    0,
    0.2,
    7
);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
);


/* =========================================================
   LIGHTING
   ========================================================= */

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.3
);

scene.add(ambientLight);


const mainLight = new THREE.PointLight(
    0xffffff,
    4,
    20
);

mainLight.position.set(
    0,
    2,
    4
);

scene.add(mainLight);


const sideLight = new THREE.PointLight(
    0xbfdcff,
    3,
    15
);

sideLight.position.set(
    -4,
    1,
    2
);

scene.add(sideLight);


/* =========================================================
   WORLD
   ========================================================= */

const world = new THREE.Group();

scene.add(world);


/* =========================================================
   MOUSE
   ========================================================= */

const mouse = {
    x: 0,
    y: 0,

    targetX: 0,
    targetY: 0
};


window.addEventListener(
    "pointermove",
    event => {

        mouse.targetX =
            (event.clientX / window.innerWidth) * 2 - 1;

        mouse.targetY =
            -(event.clientY / window.innerHeight) * 2 + 1;
    }
);


window.addEventListener(
    "pointerdown",
    () => {

        if (currentScene < scenes.length - 1) {

            transitionTo(
                currentScene + 1
            );
        }
    }
);


/* =========================================================
   PARTICLES
   ========================================================= */

const particleCount =
    window.innerWidth < 700
        ? 1800
        : 3200;


const particleGeometry =
    new THREE.BufferGeometry();


const positions =
    new Float32Array(
        particleCount * 3
    );


const basePositions =
    new Float32Array(
        particleCount * 3
    );


const targetPositions =
    new Float32Array(
        particleCount * 3
    );


const velocities =
    new Float32Array(
        particleCount * 3
    );


for (
    let i = 0;
    i < particleCount;
    i++
) {

    const i3 = i * 3;

    const radius =
        4 + Math.random() * 6;

    const theta =
        Math.random() * Math.PI * 2;

    const phi =
        Math.acos(
            2 * Math.random() - 1
        );

    positions[i3] =
        Math.sin(phi) *
        Math.cos(theta) *
        radius;

    positions[i3 + 1] =
        Math.cos(phi) *
        radius;

    positions[i3 + 2] =
        Math.sin(phi) *
        Math.sin(theta) *
        radius;

    basePositions[i3] =
        positions[i3];

    basePositions[i3 + 1] =
        positions[i3 + 1];

    basePositions[i3 + 2] =
        positions[i3 + 2];

    targetPositions[i3] =
        positions[i3];

    targetPositions[i3 + 1] =
        positions[i3 + 1];

    targetPositions[i3 + 2] =
        positions[i3 + 2];

    velocities[i3] = 0;
    velocities[i3 + 1] = 0;
    velocities[i3 + 2] = 0;
}


particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);


const particleMaterial =
    new THREE.PointsMaterial({

        color: 0xffffff,

        size:
            window.innerWidth < 700
                ? 0.018
                : 0.025,

        transparent: true,

        opacity: 0.75,

        blending:
            THREE.AdditiveBlending,

        depthWrite: false
    });


const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );


world.add(particles);


/* =========================================================
   SCENE OBJECTS
   ========================================================= */

let currentObject = null;


/* =========================================================
   IGLOO
   ========================================================= */

function createIgloo() {

    const group =
        new THREE.Group();


    const domeGeometry =
        new THREE.SphereGeometry(
            2.15,
            32,
            20,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.55
        );


    const domeWire =
        new THREE.WireframeGeometry(
            domeGeometry
        );


    const domeMaterial =
        new THREE.LineBasicMaterial({

            color: 0xffffff,

            transparent: true,

            opacity: 0.85
        });


    const dome =
        new THREE.LineSegments(
            domeWire,
            domeMaterial
        );


    group.add(dome);


    /* Inner glow */

    const innerGeometry =
        new THREE.SphereGeometry(
            2.08,
            32,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.55
        );


    const innerMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x9fb9c9,

            transparent: true,

            opacity: 0.08,

            side: THREE.DoubleSide
        });


    const inner =
        new THREE.Mesh(
            innerGeometry,
            innerMaterial
        );


    group.add(inner);


    /* Rings */

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const radius =
            0.5 + i * 0.32;

        const ringGeometry =
            new THREE.RingGeometry(
                radius,
                radius + 0.008,
                64
            );

        const ringMaterial =
            new THREE.MeshBasicMaterial({

                color: 0xffffff,

                transparent: true,

                opacity: 0.25,

                side: THREE.DoubleSide
            });

        const ring =
            new THREE.Mesh(
                ringGeometry,
                ringMaterial
            );

        ring.rotation.x =
            -Math.PI / 2;

        ring.position.y =
            -1.65 + i * 0.03;

        group.add(ring);
    }


    /* Door */

    const doorGeometry =
        new THREE.TorusGeometry(
            0.55,
            0.025,
            8,
            32,
            Math.PI
        );


    const doorMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });


    const door =
        new THREE.Mesh(
            doorGeometry,
            doorMaterial
        );


    door.position.set(
        0,
        -1.05,
        1.92
    );


    door.rotation.x =
        Math.PI / 2;


    group.add(door);


    return group;
}


/* =========================================================
   SPHERE
   ========================================================= */

function createSphere() {

    const group =
        new THREE.Group();


    const geometry =
        new THREE.IcosahedronGeometry(
            2.1,
            3
        );


    const wire =
        new THREE.WireframeGeometry(
            geometry
        );


    const material =
        new THREE.LineBasicMaterial({

            color: 0xffffff,

            transparent: true,

            opacity: 0.85
        });


    const mesh =
        new THREE.LineSegments(
            wire,
            material
        );


    group.add(mesh);


    return group;
}


/* =========================================================
   ENERGY RINGS
   ========================================================= */

function createEnergy() {

    const group =
        new THREE.Group();


    for (
        let i = 0;
        i < 14;
        i++
    ) {

        const geometry =
            new THREE.TorusGeometry(
                0.8 + i * 0.16,
                0.012,
                8,
                96
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: 0xffffff,

                transparent: true,

                opacity:
                    0.15 +
                    Math.random() * 0.4
            });


        const ring =
            new THREE.Mesh(
                geometry,
                material
            );


        ring.rotation.x =
            Math.random() *
            Math.PI;

        ring.rotation.y =
            Math.random() *
            Math.PI;

        ring.rotation.z =
            Math.random() *
            Math.PI;

        group.add(ring);
    }


    return group;
}


/* =========================================================
   DNA
   ========================================================= */

function createDNA() {

    const group =
        new THREE.Group();


    const material =
        new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.75
        });


    for (
        let strand = 0;
        strand < 2;
        strand++
    ) {

        const points = [];


        for (
            let i = 0;
            i < 100;
            i++
        ) {

            const y =
                (i / 99) * 5 - 2.5;

            const angle =
                y * 3;


            const x =
                Math.cos(
                    angle +
                    strand * Math.PI
                ) * 0.9;

            const z =
                Math.sin(
                    angle +
                    strand * Math.PI
                ) * 0.9;


            points.push(
                new THREE.Vector3(
                    x,
                    y,
                    z
                )
            );
        }


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(points);


        const line =
            new THREE.Line(
                geometry,
                material
            );


        group.add(line);
    }


    return group;
}


/* =========================================================
   PARTICLE FIELD
   ========================================================= */

function createField() {

    const group =
        new THREE.Group();


    const geometry =
        new THREE.PlaneGeometry(
            10,
            10,
            40,
            40
        );


    const material =
        new THREE.MeshBasicMaterial({

            color: 0xffffff,

            wireframe: true,

            transparent: true,

            opacity: 0.13
        });


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.rotation.x =
        -Math.PI / 2;

    mesh.position.y =
        -2.1;


    group.add(mesh);


    return group;
}


/* =========================================================
   FINAL CORE
   ========================================================= */

function createFinal() {

    const group =
        new THREE.Group();


    const geometry =
        new THREE.IcosahedronGeometry(
            1.5,
            2
        );


    const wire =
        new THREE.WireframeGeometry(
            geometry
        );


    const material =
        new THREE.LineBasicMaterial({

            color: 0xffffff,

            transparent: true,

            opacity: 1
        });


    const core =
        new THREE.LineSegments(
            wire,
            material
        );


    group.add(core);


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    2 + i * 0.35,
                    0.012,
                    8,
                    100
                ),

                new THREE.MeshBasicMaterial({

                    color: 0xffffff,

                    transparent: true,

                    opacity: 0.35
                })
            );


        ring.rotation.x =
            Math.random() * Math.PI;

        ring.rotation.y =
            Math.random() * Math.PI;

        group.add(ring);
    }


    return group;
}


/* =========================================================
   SCENES
   ========================================================= */

const scenes = [

    {
        name: "DIGITAL IGLOO",
        description:
            "GEOMETRIC STRUCTURE // INITIALIZATION",

        object:
            createIgloo()
    },

    {
        name: "CORE SPHERE",
        description:
            "NEXA CORE // GEOMETRIC ANALYSIS",

        object:
            createSphere()
    },

    {
        name: "ENERGY FIELD",
        description:
            "ENERGY SYSTEM // ACTIVE",

        object:
            createEnergy()
    },

    {
        name: "DNA SYSTEM",
        description:
            "INTELLIGENCE STRUCTURE // PROCESSING",

        object:
            createDNA()
    },

    {
        name: "DIGITAL TERRAIN",
        description:
            "ENVIRONMENT // GENERATION",

        object:
            createField()
    },

    {
        name: "NEXA CORE",
        description:
            "ARTIFICIAL INTELLIGENCE // ONLINE",

        object:
            createFinal()
    },

    {
        name: "FINAL STATE",
        description:
            "NEXA // SYSTEM COMPLETE",

        object:
            createFinal()
    }

];


/* =========================================================
   ADD FIRST OBJECT
   ========================================================= */

currentObject =
    scenes[0].object;

world.add(
    currentObject
);


/* =========================================================
   SCENE STATE
   ========================================================= */

let currentScene = 0;

let sceneStart =
    performance.now();

const sceneDuration =
    9000;

let transitionProgress = 1;

let transitioning = false;

let nextScene =
    0;


/* =========================================================
   HUD
   ========================================================= */

const hud =
    document.getElementById("hud");

const intro =
    document.getElementById("intro");

const enterButton =
    document.getElementById("enterButton");

const progress =
    document.querySelector(".progress");

const sceneNumber =
    document.querySelector(".scene-number");

const sceneTitle =
    document.querySelector(".scene-title");

const sceneDescription =
    document.querySelector(".scene-description");

const flash =
    document.getElementById("flash");


function updateHUD() {

    const number =
        String(currentScene + 1)
            .padStart(2, "0");

    sceneNumber.textContent =
        `${number} / ${String(scenes.length).padStart(2, "0")}`;

    sceneTitle.textContent =
        scenes[currentScene].name;

    sceneDescription.textContent =
        scenes[currentScene].description;
}


/* =========================================================
   ENTER
   ========================================================= */

enterButton.addEventListener(
    "click",
    () => {

        intro.classList.add(
            "hidden"
        );

        hud.classList.add(
            "active"
        );

        sceneStart =
            performance.now();
    }
);


/* =========================================================
   TRANSITION
   ========================================================= */

function transitionTo(index) {

    if (transitioning) {
        return;
    }

    if (
        index < 0 ||
        index >= scenes.length
    ) {
        return;
    }


    transitioning = true;

    nextScene = index;

    flash.classList.add(
        "active"
    );


    setTimeout(
        () => {

            if (currentObject) {

                world.remove(
                    currentObject
                );
            }


            currentScene =
                nextScene;


            currentObject =
                scenes[currentScene].object;


            currentObject.scale.set(
                0.1,
                0.1,
                0.1
            );


            currentObject.rotation.set(
                0,
                0,
                0
            );


            world.add(
                currentObject
            );


            updateHUD();


            transitionProgress =
                0;


            sceneStart =
                performance.now();


            flash.classList.remove(
                "active"
            );


            setTimeout(
                () => {

                    transitioning =
                        false;

                },
                700
            );

        },
        500
    );
}


/* =========================================================
   PARTICLE TARGETS
   ========================================================= */

function createParticleTarget(
    type
) {

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const i3 =
            i * 3;


        let x = 0;
        let y = 0;
        let z = 0;


        if (type === "igloo") {

            const angle =
                Math.random() *
                Math.PI * 2;

            const radius =
                Math.sqrt(
                    Math.random()
                ) * 3.3;

            x =
                Math.cos(angle) *
                radius;

            z =
                Math.sin(angle) *
                radius;

            y =
                -1.5 +
                Math.random() *
                0.3;


            if (
                Math.random() > 0.45
            ) {

                const domeRadius =
                    2.4 *
                    Math.sqrt(
                        Math.random()
                    );

                const domeAngle =
                    Math.random() *
                    Math.PI *
                    2;

                x =
                    Math.cos(
                        domeAngle
                    ) *
                    domeRadius;

                z =
                    Math.sin(
                        domeAngle
                    ) *
                    domeRadius;

                y =
                    Math.sqrt(
                        Math.max(
                            0,
                            2.4 * 2.4 -
                            domeRadius *
                            domeRadius
                        )
                    ) - 1.5;
            }

        }

        else if (type === "sphere") {

            const phi =
                Math.acos(
                    2 *
                    Math.random() -
                    1
                );

            const theta =
                Math.random() *
                Math.PI *
                2;

            const radius =
                2.8;

            x =
                radius *
                Math.sin(phi) *
                Math.cos(theta);

            y =
                radius *
                Math.cos(phi);

            z =
                radius *
                Math.sin(phi) *
                Math.sin(theta);

        }

        else if (type === "energy") {

            const angle =
                Math.random() *
                Math.PI *
                2;

            const radius =
                1 +
                Math.random() *
                2.5;

            x =
                Math.cos(a
