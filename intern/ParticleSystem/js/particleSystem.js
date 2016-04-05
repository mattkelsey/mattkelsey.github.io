var scene, camera, renderer;

init();
animate();

// initialize scene
function init() {
    scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({
        antialias:true
    });

    //for NonStereo
    renderer.setSize(width, height);

    document.body.appendChild(renderer.domElement);

    //Stereo
    effect = new THREE.StereoEffect(renderer);
		effect.setSize(width, height);

    // create camera and position in the scene
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000);
    camera.position.set(500,500,500);
    scene.add(camera);

    //CODE FROM THREEJS DOCS
    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize', function() {
        var width = window.innerWidth,
            height = window.innerHeight;


        renderer.setSize(width, height);

        effect.setSize(width, height);


        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
    //END CODE FROM THREEJS DOCS

    renderer.setClearColor(0x333F47, 1);

    // light source
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);


    //put in objects here

	  //CUBE
    var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
    cube.overdraw = true;
	  cube.position.set(0,0,2);
    scene.add(cube);


	  //SPHERE
	  var sphere = new THREE.Mesh(new THREE.SphereGeometry(1,40,40), new THREE.MeshNormalMaterial({color: 0x37FDFC}));
	  sphere.overdraw = true;
	  scene.add(sphere);

	  // create the particle variables
    var particleCount = 1800,
        particles = new THREE.Geometry(),
        mat = new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
            size: 20
        });

    // create the individual particles
    for (var p = 0; p < particleCount; p++) {
        // create a particle with random position values, -250 -> 250
        var pX = Math.random() * 500 - 250,
            pY = Math.random() * 500 - 250,
            pZ = Math.random() * 500 - 250,
            particle = new THREE.Vector3(pX, pY, pZ);
        // and add it to the geometry
        particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        mat);

    // add it to the scene...
    scene.add(particleSystem);

	  // add OrbitalControls lib so that we can have mouse and touch controls
	  controls = new THREE.OrbitControls(camera, renderer.domElement);

}

// threejs updater
function animate() {
    requestAnimationFrame(animate);
    // render scene
     //renderer.render(scene, camera);

    //Stereo
    effect.render(scene, camera);


    controls.update();
}
