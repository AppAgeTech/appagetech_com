import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EquirectangularToCubeGenerator } from "three/examples/jsm/loaders/EquirectangularToCubeGenerator.js";
import { PMREMGenerator } from "three/examples/jsm/pmrem/PMREMGenerator.js";
import { PMREMCubeUVPacker } from "three/examples/jsm/pmrem/PMREMCubeUVPacker.js";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
import About from "./2D/About";
import Client from "./2D/Client";
import Contact from "./2D/Contact";
import Projects from "./2D/Projects";
import LandingTransition from "./LandingTransition";

let camera, glScene, cssScene, glRenderer, cssRenderer, container;
let cubeGenerator, pmremGenerator, pmremCubeUVPacker;
let logo, about, contact, projects, client;
let logoType, aboutType, contactType, projectsType, clientType;
let intersected;
let waterUniforms, waterMesh, meshRay, gpuCompute, heightmapVariable;
let mouseMoved = false;
let mouseCoords = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let WIDTH = 512;
let BOUNDS = 256;
let plane;
let landingScene;
let zPosition2D = 215;
let offScreenZPosition2D = 10000;
let placementDirection = "horizontal";

const reactComponents = ["about", "contact", "projects", "client"];
let reactComponentsObj = {};

const displayIcons = {
  logo: {
    horizontal: { x: -2.2, y: 0 },
    vertical: { x: 0, y: 1.8 }
  },
  about: {
    horizontal: { x: -0.97, y: 0 },
    vertical: { x: 0, y: 0.72 }
  },
  contact: {
    horizontal: { x: 0, y: 0 },
    vertical: { x: 0, y: -0.15 }
  },
  projects: {
    horizontal: { x: 0.97, y: 0 },
    vertical: { x: 0, y: -1.02 }
  },
  client: {
    horizontal: { x: 1.94, y: 0 },
    vertical: { x: 0, y: -1.89 }
  }
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show2D: false,
      showWater: true,
      showComponent: null,
      reactComponentsMounted: false,
      landingPage: true,
      navPosition: "middle",
      moveNavBar: false,
      cssComponentDisplayed: ""
    };
  }

  componentDidMount() {
    this.setLoadLocations();
    this.initialize();
    this.loadAssets();
    this.update();
    this.matchRenderToLocation();
  }

  setLoadLocations = () => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    console.log(windowHeight + " " + windowWidth);
    const windowAspect = window.innerWidth / window.innerHeight;
    console.log(windowAspect);
    if (windowAspect < 1) {
      placementDirection = "vertical";
    }
  };

  matchRenderToLocation = () => {
    const location = this.props.location.pathname.substring(1);
    if (location !== "") {
      this.setState({ landingPage: false });
      landingScene.removeLandingMouseDown();
      if (reactComponentsObj[location]) {
        this.showReactComponent(location);
      }
    }
  };

  createGlRenderer = () => {
    var glRenderer = new THREE.WebGLRenderer({ alpha: true });
    glRenderer.setClearColor(0xecf8ff, 1);
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setSize(window.innerWidth, window.innerHeight);
    glRenderer.domElement.style.position = "absolute";
    glRenderer.domElement.style.top = 0;
    return glRenderer;
  };

  createCssRenderer = () => {
    var cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.zIndex = -1;
    cssRenderer.domElement.style.top = 0;
    return cssRenderer;
  };

  createPlane = (w, h, position, rotation) => {
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.0,
      side: THREE.DoubleSide
    });

    var geometry = new THREE.PlaneGeometry(w, h);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
    mesh.rotation.x = rotation.x;
    mesh.rotation.y = rotation.y;
    mesh.rotation.z = rotation.z;
    return mesh;
  };

  toggleTransition = () => {
    if (this.state.landingPage === true) {
      this.setState({ landingPage: false });
      this.props.history.push("/home");
    } else {
      this.setState({ landingPage: true });
    }
  };

  initialize = () => {
    camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.25,
      4000
    );
    camera.position.set(0, 0, 224);
    camera.lookAt(0, 0, 0);
    glRenderer = this.createGlRenderer();
    cssRenderer = this.createCssRenderer();
    container = document.createElement("div");
    document.body.appendChild(container);
    container.appendChild(glRenderer.domElement);
    container.appendChild(cssRenderer.domElement);
    glScene = new THREE.Scene();
    cssScene = new THREE.Scene();
    cssScene.scale.set(0.1, 0.1, 0.1);

    // Landing scene
    landingScene = new LandingTransition(
      glRenderer,
      0xffffff,
      this.toggleTransition
    );

    reactComponents.forEach(item => {
      let element = document.createElement("div");
      element.id = item;
      let object = new CSS3DObject(element);
      // Hides the element off camera => z = 10,000
      object.position.z = offScreenZPosition2D;
      cssScene.add(object);
      reactComponentsObj[item] = object;
    });

    window.addEventListener("resize", this.onWindowResize, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    document.addEventListener("touchstart", this.onDocumentTouchStart, false);
    document.addEventListener("touchmove", this.onDocumentTouchMove, false);
    document.addEventListener("mousedown", this.onDocumentMouseDown, false);

    this.initWater();
  };

  // Attached to logo to hide everything
  hideAllReactComponents = () => {
    if (this.state.show2D) {
      cssRenderer.domElement.style.zIndex = -1;
      glScene.remove(plane);
      this.setState({
        moveNavBar: true,
        cssComponentDisplayed: "",
        show2D: false,
        showWater: true
      });
      Object.entries(reactComponentsObj).forEach(
        ([key, value]) => (value.position.z = offScreenZPosition2D)
      );
      // Pushes location back to home
      this.props.history.push(`/home`);

      // Toggle Icons ON
      glScene.traverse(function(child) {
        if (
          (child.isMesh && child.name === "clientIcon") ||
          (child.isMesh && child.name === "projectsIcon") ||
          (child.isMesh && child.name === "contactIcon") ||
          (child.isMesh && child.name === "aboutIcon")
        ) {
          child.material.opacity = 1;
        } else if (
          (child.isMesh && child.name === "logoType") ||
          (child.isMesh && child.name === "clientType") ||
          (child.isMesh && child.name === "projectsType") ||
          (child.isMesh && child.name === "contactType") ||
          (child.isMesh && child.name === "aboutType")
        ) {
          child.material.emissiveIntensity = 1;
        }
      });
    }
  };

  // Show react component
  showReactComponent = reactComponentName => {
    // Checks a second click: is the CSS renderer is visible
    if (
      parseInt(cssRenderer.domElement.style.zIndex, 10) === 0 &&
      this.state.cssComponentDisplayed === reactComponentName
    ) {
      this.hideAllReactComponents();
    } else if (
      parseInt(cssRenderer.domElement.style.zIndex, 10) === 0 &&
      this.state.cssComponentDisplayed !== reactComponentName
    ) {
      // Sets current css object to offscreen
      reactComponentsObj[
        this.state.cssComponentDisplayed
      ].position.z = offScreenZPosition2D;
      // Brings forward selected css object
      reactComponentsObj[reactComponentName].position.z = zPosition2D;
      // Sets state with the name of the currently displayed object
      this.setState({ cssComponentDisplayed: reactComponentName });
      // Pushes location to URL bar
      this.props.history.push(`/${reactComponentName}`);
    } else {
      reactComponentsObj[reactComponentName].position.z = zPosition2D;
      this.setState({
        moveNavBar: true,
        cssComponentDisplayed: reactComponentName,
        show2D: true,
        showWater: false
      });

      // Toggle Icons OFF
      glScene.traverse(function(child) {
        if (
          (child.isMesh && child.name === "clientIcon") ||
          (child.isMesh && child.name === "projectsIcon") ||
          (child.isMesh && child.name === "contactIcon") ||
          (child.isMesh && child.name === "aboutIcon")
        ) {
          child.material.opacity = 0;
        } else if (
          (child.isMesh && child.name === "logoType") ||
          (child.isMesh && child.name === "clientType") ||
          (child.isMesh && child.name === "projectsType") ||
          (child.isMesh && child.name === "contactType") ||
          (child.isMesh && child.name === "aboutType")
        ) {
          child.material.emissiveIntensity = 0;
        }
      });

      plane = this.createPlane(
        window.innerWidth,
        window.innerHeight,
        new THREE.Vector3(0, 0, 210),
        new THREE.Vector3(0, 0, 0)
      );
      glScene.add(plane);
      cssRenderer.domElement.style.zIndex = 0;
      // Pushes location to URL bar
      if (this.props.location.pathname !== `/${reactComponentName}`) {
        this.props.history.push(`/${reactComponentName}`);
      }
    }
  };

  loadAssets = () => {
    let showReactComponent = this.showReactComponent.bind(this);
    let hideAllReactComponents = this.hideAllReactComponents.bind(this);

    new RGBELoader()
      .setDataType(THREE.UnsignedByteType)
      .setPath("textures/")
      .load("diyHdri_04i.hdr", function(texture) {
        cubeGenerator = new EquirectangularToCubeGenerator(texture, {
          resolution: 512
        });
        cubeGenerator.update(glRenderer);
        pmremGenerator = new PMREMGenerator(cubeGenerator.renderTarget.texture);
        pmremGenerator.update(glRenderer);
        pmremCubeUVPacker = new PMREMCubeUVPacker(pmremGenerator.cubeLods);
        pmremCubeUVPacker.update(glRenderer);
        const hdrEnvMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;

        const emissiveMapLoader = new THREE.TextureLoader();
        const emissiveMap = emissiveMapLoader.load(
          "textures/EmissiveMap_01.png"
        );
        emissiveMap.anisotropy = 16;

        // Models
        const typeParams = {
          envMap: hdrEnvMap,
          envMapIntensity: 1,
          color: 0x040404,
          metalness: 1,
          roughness: 0.2,
          emissive: 0x00fffc, //teal
          // emissive: 0xff0042, //red
          // emissive: 0x00ff42,//green
          emissiveIntensity: 1
        };
        const iconParams = {
          envMap: hdrEnvMap,
          envMapIntensity: 1,
          emissiveMap: emissiveMap,
          emissive: 0x7a7fc8,
          emissiveIntensity: 0.6,
          // color: 0x191a21, //darkPurple
          color: 0x32396e, //blue
          // color: 0x454d91,
          // color: 0x000e94,
          // color: 0x694112,
          metalness: 1,
          roughness: 0.5,
          transparent: true
        };
        const zPos = 215;
        const zRot = null;
        const scale = new THREE.Vector3(1.3, 1.3, 1.3);

        const logoTypeLoader = new GLTFLoader().setPath("/models/");
        logoTypeLoader.load("Logo_Type.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(typeParams);
              child.scale.copy(scale);
              logoType = child;
              logoType.name = "logoType";
            }
          });
          gltf.scene.position.x = displayIcons.logo[placementDirection].x;
          gltf.scene.position.y = displayIcons.logo[placementDirection].y;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          glScene.add(gltf.scene);
        });

        const logoIconLoader = new GLTFLoader().setPath("/models/");
        logoIconLoader.load("Solid_Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(iconParams);
              child.scale.copy(scale);
              logo = child;
              logo.name = "logoIcon";
            }
          });
          gltf.scene.position.x = displayIcons.logo[placementDirection].x;
          gltf.scene.position.y = displayIcons.logo[placementDirection].y;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          glScene.add(gltf.scene);
          logo.callback = () => hideAllReactComponents();
        });

        const contactTypeLoader = new GLTFLoader().setPath("/models/");
        contactTypeLoader.load("Contact_Button_Type.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(typeParams);
              contactType = child;
              contactType.name = "contactType";
            }
          });
          glScene.add(gltf.scene);
          gltf.scene.position.x = displayIcons.contact[placementDirection].x;
          gltf.scene.position.y = displayIcons.contact[placementDirection].y;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
        });

        const contactIconLoader = new GLTFLoader().setPath("/models/");
        contactIconLoader.load("Solid_Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(iconParams);
              contact = child;
              contact.name = "contactIcon";
            }
          });
          gltf.scene.position.x = displayIcons.contact[placementDirection].x;
          gltf.scene.position.y = displayIcons.contact[placementDirection].y;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          glScene.add(gltf.scene);
          contact.callback = () => showReactComponent("contact");
        });

        const aboutTypeLoader = new GLTFLoader().setPath("/models/");
        aboutTypeLoader.load("About_Button_Type.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(typeParams);
              aboutType = child;
              aboutType.name = "aboutType";
            }
          });
          gltf.scene.position.x = displayIcons.about[placementDirection].x;
          gltf.scene.position.y = displayIcons.about[placementDirection].y;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          glScene.add(gltf.scene);
        });

        const aboutIconLoader = new GLTFLoader().setPath("/models/");
        aboutIconLoader.load("Solid_Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(iconParams);
              about = child;
              about.name = "aboutIcon";
            }
          });
          gltf.scene.position.x = displayIcons.about[placementDirection].x;
          gltf.scene.position.y = displayIcons.about[placementDirection].y;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          glScene.add(gltf.scene);
          about.callback = () => showReactComponent("about");
        });

        const projectsTypeLoader = new GLTFLoader().setPath("/models/");
        projectsTypeLoader.load("Projects_Button_Type.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(typeParams);
              projectsType = child;
              projectsType.name = "projectsType";
            }
          });
          gltf.scene.position.x = displayIcons.projects[placementDirection].x;
          gltf.scene.position.y = displayIcons.projects[placementDirection].y;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          glScene.add(gltf.scene);
        });

        const projectsIconLoader = new GLTFLoader().setPath("/models/");
        projectsIconLoader.load("Solid_Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(iconParams);
              projects = child;
              projects.name = "projectsIcon";
            }
          });
          gltf.scene.position.x = displayIcons.projects[placementDirection].x;
          gltf.scene.position.y = displayIcons.projects[placementDirection].y;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          glScene.add(gltf.scene);
          projects.callback = () => showReactComponent("projects");
        });

        const clientTypeLoader = new GLTFLoader().setPath("/models/");
        clientTypeLoader.load("Client_Button_Type.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(typeParams);
              clientType = child;
              clientType.name = "clientType";
            }
          });
          gltf.scene.position.x = displayIcons.client[placementDirection].x;
          gltf.scene.position.y = displayIcons.client[placementDirection].y;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          glScene.add(gltf.scene);
        });

        const clientIconLoader = new GLTFLoader().setPath("/models/");
        clientIconLoader.load("Solid_Icon.glb", function(gltf) {
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial(iconParams);
              client = child;
              client.name = "clientIcon";
            }
          });
          gltf.scene.position.x = displayIcons.client[placementDirection].x;
          gltf.scene.position.y = displayIcons.client[placementDirection].y;
          gltf.scene.position.z = zPos;
          gltf.scene.rotation.z = zRot;
          glScene.add(gltf.scene);
          client.callback = () => showReactComponent("client");
        });
        pmremGenerator.dispose();
        pmremCubeUVPacker.dispose();
      });
  };

  initWater = () => {
    const zPos = this.state.showWater ? 0 : -5000;
    const materialColor = 0x000000;
    var geometry = new THREE.PlaneBufferGeometry(
      BOUNDS,
      BOUNDS,
      WIDTH - 1,
      WIDTH - 1
    );
    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib["phong"].uniforms,
        {
          heightmap: { value: null }
        }
      ]),
      vertexShader: document.getElementById("waterVertexShader").textContent,
      fragmentShader: THREE.ShaderChunk["meshphong_frag"]
    });
    material.lights = true;
    material.color = new THREE.Color(materialColor);
    material.specular = new THREE.Color(0x111111);
    material.shininess = 100;
    material.uniforms["diffuse"].value = material.color;
    material.uniforms["specular"].value = material.specular;
    material.uniforms["shininess"].value = Math.max(material.shininess, 1e-4);
    material.uniforms["opacity"].value = material.opacity;
    material.defines.WIDTH = WIDTH.toFixed(1);
    material.defines.BOUNDS = BOUNDS.toFixed(1);
    waterUniforms = material.uniforms;
    waterMesh = new THREE.Mesh(geometry, material);
    waterMesh.matrixAutoUpdate = false;
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.z = zPos;
    waterMesh.updateMatrix();
    glScene.add(waterMesh);
    var geometryRay = new THREE.PlaneBufferGeometry(BOUNDS, BOUNDS, 1, 1);
    meshRay = new THREE.Mesh(
      geometryRay,
      new THREE.MeshBasicMaterial({ color: 0xffffff, visible: false })
    );
    meshRay.matrixAutoUpdate = false;
    meshRay.updateMatrix();
    glScene.add(meshRay);
    gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, glRenderer);
    var heightmap0 = gpuCompute.createTexture();
    this.fillTexture(heightmap0);
    heightmapVariable = gpuCompute.addVariable(
      "heightmap",
      document.getElementById("heightmapFragmentShader").textContent,
      heightmap0
    );
    gpuCompute.setVariableDependencies(heightmapVariable, [heightmapVariable]);
    heightmapVariable.material.uniforms["mousePos"] = {
      value: new THREE.Vector2(10000, 10000)
    };
    heightmapVariable.material.uniforms["mouseSize"] = { value: 3.0 };
    heightmapVariable.material.uniforms["viscosityConstant"] = {
      value: 0.97
    };
    heightmapVariable.material.uniforms["heightCompensation"] = {
      value: 0
    };
    heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed(1);
    var error = gpuCompute.init();
    if (error !== null) {
      console.error(error);
    }

    gpuCompute.compute();
    waterUniforms["heightmap"].value = gpuCompute.getCurrentRenderTarget(
      heightmapVariable
    ).texture;
  };

  fillTexture = texture => {
    var simplex = new SimplexNoise();
    var waterMaxHeight = 1;
    function noise(x, y) {
      var multR = waterMaxHeight;
      var mult = 0.025;
      var r = 0;
      for (var i = 0; i < 15; i++) {
        r += multR * simplex.noise(x * mult, y * mult);
        multR *= 0.53 + 0.025 * i;
        mult *= 1.25;
      }
      return r;
    }
    var pixels = texture.image.data;
    var p = 0;
    for (var j = 0; j < WIDTH; j++) {
      for (var i = 0; i < WIDTH; i++) {
        var x = (i * 128) / WIDTH;
        var y = (j * 128) / WIDTH;
        pixels[p + 0] = noise(x, y);
        pixels[p + 1] = pixels[p + 0];
        pixels[p + 2] = 0;
        pixels[p + 3] = 1;
        p += 4;
      }
    }
  };

  checkNavBarMove = () => {
    if (
      logo &&
      logoType &&
      contact &&
      projects &&
      projectsType &&
      client &&
      about
    ) {
      if (this.state.navPosition === "middle") {
        // Moving navbar up
        if (this.state.moveNavBar === true) {
          const scaleY = new THREE.Vector3(1, 0.5, 1);
          const scaleLogo = new THREE.Vector3(1, 1, 1);
          logo.scale.copy(scaleLogo);
          logoType.scale.copy(scaleLogo);
          contact.scale.copy(scaleY);
          projects.scale.copy(scaleY);
          client.scale.copy(scaleY);
          about.scale.copy(scaleY);
          if (logo.position.y <= 1.75) {
            logo.position.y += 0.3;
            about.position.y += 0.3;
            contact.position.y += 0.3;
            projects.position.y += 0.3;
            client.position.y += 0.3;
            logoType.position.y += 0.3;
            aboutType.position.y += 0.3;
            contactType.position.y += 0.3;
            projectsType.position.y += 0.3;
            clientType.position.y += 0.3;
          } else {
            this.setState({
              moveNavBar: false,
              navPosition: "top"
            });
          }
        }
      } else if (this.state.navPosition === "top") {
        // Moving navbar down
        if (this.state.moveNavBar === true) {
          const scaleY = new THREE.Vector3(1, 1, 1);
          const scaleLogo = new THREE.Vector3(1.3, 1.3, 1.3);
          logo.scale.copy(scaleLogo);
          logoType.scale.copy(scaleLogo);
          contact.scale.copy(scaleY);
          projects.scale.copy(scaleY);
          client.scale.copy(scaleY);
          about.scale.copy(scaleY);
          if (logo.position.y >= 0) {
            logo.position.y -= 0.3;
            about.position.y -= 0.3;
            contact.position.y -= 0.3;
            projects.position.y -= 0.3;
            client.position.y -= 0.3;
            logoType.position.y -= 0.3;
            aboutType.position.y -= 0.3;
            contactType.position.y -= 0.3;
            projectsType.position.y -= 0.3;
            clientType.position.y -= 0.3;
          } else {
            this.setState({
              moveNavBar: false,
              navPosition: "middle"
            });
          }
        }
      }
    }
  };

  update = () => {
    requestAnimationFrame(this.update);
    if (this.state.landingPage) {
      landingScene.render();
    } else {
      glRenderer.render(glScene, camera);
      cssRenderer.render(cssScene, camera);
      if (this.state.reactComponentsMounted === false) {
        const aboutElement = document.getElementById("about");
        ReactDOM.render(<About />, aboutElement);
        const clientElement = document.getElementById("client");
        ReactDOM.render(<Client />, clientElement);
        const contactElement = document.getElementById("contact");
        ReactDOM.render(<Contact />, contactElement);
        const projectsElement = document.getElementById("projects");
        ReactDOM.render(<Projects />, projectsElement);
        this.setState({ reactComponentsMounted: true });
      }
      raycaster.setFromCamera(mouseCoords, camera);
      if (mouseMoved && logo && about && contact && projects && client) {
        var uniforms = heightmapVariable.material.uniforms;
        var intersectWater = raycaster.intersectObject(meshRay);

        // raycast water
        if (intersectWater.length > 0) {
          //** turn off emissive type
          glScene.traverse(function(child) {
            if (
              (child.isMesh && child.name === "clientType") ||
              (child.isMesh && child.name === "projectsType") ||
              (child.isMesh && child.name === "contactType") ||
              (child.isMesh && child.name === "aboutType")
            ) {
              child.material.emissive.setHex(0x00fffc);
            }
          });
          var point = intersectWater[0].point;
          uniforms["mousePos"].value.set(point.x, point.z);
        } else {
          uniforms["mousePos"].value.set(10000, 10000);
        }
        mouseMoved = false;

        // raycast buttons
        const intersectButtons = raycaster.intersectObjects([
          logo,
          about,
          contact,
          projects,
          client
        ]);
        //2D
        if (this.state.show2D) {
          if (intersectButtons.length > 0) {
            if (intersected !== intersectButtons[0].object) {
              if (intersected) {
                intersected.material.opacity = 0; //off
              }
              intersected = intersectButtons[0].object;
            }
            intersected.material.opacity = 1; //on

            // ** clientIcon

            if (intersected.isMesh && intersected.name === "clientIcon") {
              console.log("intersected clientIcon");
              glScene.traverse(function(child) {
                if (child.isMesh && child.name === "clientType") {
                  console.log("found clientType");
                  child.material.emissive.setHex(0xff0042);
                  // intersected = null;
                } else if (
                  (child.isMesh && child.name === "projectsType") ||
                  (child.isMesh && child.name === "contactType") ||
                  (child.isMesh && child.name === "aboutType")
                ) {
                  child.material.emissive.setHex(0x00fffc);
                }
              });
            }

            // ** projectsIcon

            if (intersected.isMesh && intersected.name === "projectsIcon") {
              glScene.traverse(function(child) {
                if (child.isMesh && child.name === "projectsType") {
                  child.material.emissive.setHex(0xff0042);
                  // intersected = null;
                } else if (
                  (child.isMesh && child.name === "clientType") ||
                  (child.isMesh && child.name === "contactType") ||
                  (child.isMesh && child.name === "aboutType")
                ) {
                  child.material.emissive.setHex(0x00fffc);
                }
              });
            }

            // ** contactIcon

            if (intersected.isMesh && intersected.name === "contactIcon") {
              glScene.traverse(function(child) {
                if (child.isMesh && child.name === "contactType") {
                  child.material.emissive.setHex(0xff0042);
                  // intersected = null;
                } else if (
                  (child.isMesh && child.name === "clientType") ||
                  (child.isMesh && child.name === "projectsType") ||
                  (child.isMesh && child.name === "aboutType")
                ) {
                  child.material.emissive.setHex(0x00fffc);
                }
              });
            }

            // ** aboutIcon

            if (intersected.isMesh && intersected.name === "aboutIcon") {
              glScene.traverse(function(child) {
                if (child.isMesh && child.name === "aboutType") {
                  child.material.emissive.setHex(0xff0042);
                  // intersected = null;
                } else if (
                  (child.isMesh && child.name === "clientType") ||
                  (child.isMesh && child.name === "projectsType") ||
                  (child.isMesh && child.name === "contactType")
                ) {
                  child.material.emissive.setHex(0x00fffc);
                }
              });
            }
          } else {
            if (intersected) intersected.material.opacity = 0;
            intersected = null;
          }
        }
        //3D
        if (!this.state.show2D) {
          if (intersectButtons.length > 0) {
            intersected = intersectButtons[0].object;
            // intersected.currentHex = intersected.material.emissive.getHex();
            // intersected.material.emissive.setHex(0x7a7fc8);

            // ** clientIcon

            if (intersected.isMesh && intersected.name === "clientIcon") {
              console.log("intersected clientIcon");
              glScene.traverse(function(child) {
                if (child.isMesh && child.name === "clientType") {
                  console.log("found clientType");
                  child.material.emissive.setHex(0xff0042);
                } else if (
                  (child.isMesh && child.name === "projectsType") ||
                  (child.isMesh && child.name === "contactType") ||
                  (child.isMesh && child.name === "aboutType")
                ) {
                  child.material.emissive.setHex(0x00fffc);
                }
              });
            }

            // ** projectsIcon

            if (intersected.isMesh && intersected.name === "projectsIcon") {
              glScene.traverse(function(child) {
                if (child.isMesh && child.name === "projectsType") {
                  child.material.emissive.setHex(0xff0042);
                } else if (
                  (child.isMesh && child.name === "clientType") ||
                  (child.isMesh && child.name === "contactType") ||
                  (child.isMesh && child.name === "aboutType")
                ) {
                  child.material.emissive.setHex(0x00fffc);
                }
              });
            }

            // ** contactIcon

            if (intersected.isMesh && intersected.name === "contactIcon") {
              glScene.traverse(function(child) {
                if (child.isMesh && child.name === "contactType") {
                  child.material.emissive.setHex(0xff0042);
                } else if (
                  (child.isMesh && child.name === "clientType") ||
                  (child.isMesh && child.name === "projectsType") ||
                  (child.isMesh && child.name === "aboutType")
                ) {
                  child.material.emissive.setHex(0x00fffc);
                }
              });
            }

            // ** aboutIcon

            if (intersected.isMesh && intersected.name === "aboutIcon") {
              glScene.traverse(function(child) {
                if (child.isMesh && child.name === "aboutType") {
                  child.material.emissive.setHex(0xff0042);
                } else if (
                  (child.isMesh && child.name === "clientType") ||
                  (child.isMesh && child.name === "projectsType") ||
                  (child.isMesh && child.name === "contactType")
                ) {
                  child.material.emissive.setHex(0x00fffc);
                }
              });
            }
          } else {
            intersected = null;
          }
        }
      }
      // Checks the if update function needs to move the navbar based on click and component statefulness
      this.checkNavBarMove();
      if (this.state.showWater) {
        waterUniforms["heightmap"].value = gpuCompute.getCurrentRenderTarget(
          heightmapVariable
        ).texture;
        gpuCompute.compute();
      }
    }
  };

  onDocumentMouseDown = event => {
    event.preventDefault();
    this.setMouseCoords(event.clientX, event.clientY);
    const intersectButtonsMd = raycaster.intersectObjects([
      logo,
      about,
      contact,
      projects,
      client
    ]);
    if (intersectButtonsMd.length > 0) {
      if (intersectButtonsMd[0].object.callback) {
        intersectButtonsMd[0].object.callback();
      }
    }
  };

  setMouseCoords = (x, y) => {
    mouseCoords.set(
      (x / glRenderer.domElement.clientWidth) * 2 - 1,
      -(y / glRenderer.domElement.clientHeight) * 2 + 1
    );
    mouseMoved = true;
  };

  onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    glRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
  };

  onDocumentMouseMove = event => {
    this.setMouseCoords(event.clientX, event.clientY);
  };

  onDocumentTouchStart = event => {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.setMouseCoords(event.touches[0].pageX, event.touches[0].pageY);
    }
  };

  onDocumentTouchMove = event => {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.setMouseCoords(event.touches[0].pageX, event.touches[0].pageY);
    }
  };
  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  }
  render() {
    return <div ref={this.mount} />;
  }
}

export default Home;
