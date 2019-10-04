import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EquirectangularToCubeGenerator } from "three/examples/jsm/loaders/EquirectangularToCubeGenerator.js";
import { PMREMGenerator } from "three/examples/jsm/pmrem/PMREMGenerator.js";
import { PMREMCubeUVPacker } from "three/examples/jsm/pmrem/PMREMCubeUVPacker.js";

export default function LandingTransition(renderer, clearColor, toggleTransitionFunc) {
  // Initial variables
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let touchEvent = false;
  //this.clearColor = clearColor;
  // Scene & Camera
  this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.25, 20);
  this.camera.position.z = 7.5;
  const scene = new THREE.Scene();

  // Object callback function
  const startTransition = objectName => {
    //console.log('Objected has been clicked:' + objectName)
    toggleTransitionFunc();
  };

  // Objects
  let cubeGenerator, type, icon;
  // load HDR, then Models
  new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .setPath("textures/")
    .load("diyHdri_01o.hdr", function(texture) {
      cubeGenerator = new EquirectangularToCubeGenerator(texture, {
        resolution: 256
      });

      cubeGenerator.update(renderer);

      const pmremGenerator = new PMREMGenerator(cubeGenerator.renderTarget.texture);
      pmremGenerator.update(renderer);
      const pmremCubeUVPacker = new PMREMCubeUVPacker(pmremGenerator.cubeLods);
      pmremCubeUVPacker.update(renderer);

      const envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;

      const emissiveMapLoader = new THREE.TextureLoader();
      const emissiveMap = emissiveMapLoader.load("textures/EmissiveMap_01.png");
      // emissiveMap.anisotropy = 16;

      // Models
      new GLTFLoader().setPath("/models/").load("Landing-Logo-Type.glb", function(gltf) {
        gltf.scene.traverse(function(child) {
          if (child.isMesh) {
            type = child;
            type.material = new THREE.MeshStandardMaterial({
              envMap: envMap,
              envMapIntensity: 2,
              color: 0x000000,
              metalness: 1,
              roughness: 0.2
            });
          }
        });
        type.callback = () => startTransition("Type");
        scene.add(gltf.scene);
      });

      new GLTFLoader().setPath("/models/").load("Logo_Icon_Large.glb", function(gltf) {
        gltf.scene.traverse(function(child) {
          if (child.isMesh) {
            icon = child;
            icon.material = new THREE.MeshStandardMaterial({
              envMap: envMap,
              envMapIntensity: 1,
              emissiveMap: emissiveMap,
              emissiveIntensity: 0.5,
              emissive: 0xb3dde9,
              color: 0x3da3e3,
              metalness: 1,
              roughness: 0
            });
          }
        });
        icon.callback = () => startTransition("Icon");
        scene.add(gltf.scene);
      });
      pmremGenerator.dispose();
      pmremCubeUVPacker.dispose();

      scene.background = new THREE.Color(0x000000);
    });

  this.removeLandingMouseDown = () => {
    document.removeEventListener("mousedown", onDocumentMouseDown, false);
    document.removeEventListener("touchstart", onDocumentTouchStart, false);
  };

  this.addLandingMouseDown = () => {
    document.addEventListener("mousedown", onDocumentMouseDown, false);
    document.addEventListener("touchstart", onDocumentTouchStart, false);
  };

  const onDocumentMouseDown = event => {
    // Does not use event.preventDefault(), manually handles touch events
    if (touchEvent === false) {
      console.log("Mouse click called");
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);
      let intersects = raycaster.intersectObjects([icon], true);
      if (intersects.length > 0) {
        if (intersects[0].object.callback) {
          intersects[0].object.callback();
          this.removeLandingMouseDown();
        }
      }
    }
    touchEvent = false;
  };
  const onDocumentTouchStart = event => {
    if (event.touches.length === 1) {
      // Assumes that click and mouse down will both be called by the browser
      mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);
      let intersects = raycaster.intersectObjects([icon], true);
      if (intersects.length > 0) {
        if (intersects[0].object.callback) {
          intersects[0].object.callback();
          this.removeLandingMouseDown();
        }
      }
      touchEvent = true;
    }
  };
  this.addLandingMouseDown();

  const starForge = () => {
    var starQty = 800000;
    let starGeometry = new THREE.SphereGeometry(170, 10, 10);

    const materialOptions = {
      size: 0.06,
      transparency: true,
      opacity: 0.7
    };

    const starStuff = new THREE.PointCloudMaterial(materialOptions);

    for (var i = 0; i < starQty; i++) {
      var starVertex = new THREE.Vector3();
      starVertex.x = Math.random() * 200 - 100;
      starVertex.y = Math.random() * 200 - 100;
      starVertex.z = Math.random() * 100 - 100;

      starGeometry.vertices.push(starVertex);
    }

    const stars = new THREE.PointCloud(starGeometry, starStuff);
    scene.add(stars);
  };

  starForge();

  this.render = function(rtt) {
    if (icon && type) {
      icon.rotation.y += 0.01;
      type.rotation.y += 0.01;
    }
    renderer.render(scene, this.camera);
  };
}
