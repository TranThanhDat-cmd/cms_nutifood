import {
  AmbientLight,
  Box3,
  Cache,
  DirectionalLight,
  HemisphereLight,
  LinearEncoding,
  LoadingManager,
  PerspectiveCamera,
  PMREMGenerator,
  REVISION,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { environments } from './environments';
import { createBackground } from './lib/three-vignette.js';

const DEFAULT_CAMERA = '[default]';

const MANAGER = new LoadingManager();
const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`;
const DRACO_LOADER = new DRACOLoader(MANAGER).setDecoderPath(
  `${THREE_PATH}/examples/js/libs/draco/gltf/`
);
const KTX2_LOADER = new KTX2Loader(MANAGER).setTranscoderPath(
  `${THREE_PATH}/examples/js/libs/basis/`
);

const MAP_NAMES = [
  'map',
  'aoMap',
  'emissiveMap',
  'glossinessMap',
  'metalnessMap',
  'normalMap',
  'roughnessMap',
  'specularMap',
];

const Preset = { ASSET_GENERATOR: 'assetgenerator' };
let gWebGLRenderer: WebGLRenderer | undefined = undefined;
Cache.enabled = true;

export class Viewer {
  el: HTMLElement;
  options: any;
  zoomValue: number;
  speedValue: number;
  lights: any;
  content: any;
  state: any;
  scene: any;
  defaultCamera: any;
  activeCamera: any;
  renderer: WebGLRenderer;
  pmremGenerator: any;
  controls: any;
  vignette: any;

  constructor(el: HTMLElement, options: any, zoomValue: number, speedValue: number) {
    this.el = el;
    this.options = options;
    this.zoomValue = zoomValue;
    this.speedValue = speedValue;

    this.lights = [];
    this.content = null;

    this.state = {
      environment: environments[1].name,
      playbackSpeed: 1.0,
      actionStates: {},
      camera: DEFAULT_CAMERA,
      addLights: true,
      exposure: 1.0,
      textureEncoding: 'sRGB',
      ambientIntensity: 0.3,
      ambientColor: 0xffffff,
      directIntensity: 0.8 * Math.PI, // TODO(#116)
      directColor: 0xffffff,
      bgColor1: '#fff',
      bgColor2: '#fff',
    };

    this.scene = new Scene();
    // TODO(#116) Adjust zoom
    this.defaultCamera = new PerspectiveCamera(
      this.zoomValue,
      el.clientWidth / el.clientHeight,
      0.01,
      1000
    );
    // this.activeCamera = this.defaultCamera;
    this.scene.add(this.defaultCamera);
    if (gWebGLRenderer == null) {
      this.renderer = gWebGLRenderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        stencil: true,
        preserveDrawingBuffer: true,
      });
      this.renderer.debug = { checkShaderErrors: false };
      this.renderer.physicallyCorrectLights = true;
      this.renderer.outputEncoding = sRGBEncoding;
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(el.clientWidth, el.clientHeight);
    } else {
      this.renderer = gWebGLRenderer;
    }

    this.pmremGenerator = new PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();

    this.controls = new OrbitControls(this.defaultCamera, this.renderer.domElement);
    this.controls.autoRotate = true;
    // TODO(#116) Adjust speed
    this.controls.autoRotateSpeed = this.speedValue;
    this.controls.screenSpacePanning = false;

    this.vignette = createBackground({
      aspect: this.defaultCamera.aspect,
      grainScale: 0, // mattdesl/three-vignette-background#1
      colors: [this.state.bgColor1, this.state.bgColor2],
    });
    this.vignette.name = 'Vignette';
    this.vignette.renderOrder = -1;
    this.el.appendChild(this.renderer.domElement);
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
    window.addEventListener('resize', this.resize.bind(this), false);
  }

  animate(time) {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.render();
  }

  updateEnvironment() {
    const environment = environments.filter(entry => entry.name === this.state.environment)[0];

    this.getCubeMapTexture(environment).then(({ envMap }) => {
      if (!envMap || !this.state.background) {
        this.scene.add(this.vignette);
      }

      this.scene.environment = envMap;
      this.scene.background = this.state.background ? envMap : null;
    });
  }

  resize() {
    if (this.el.parentElement == null) return;
    const { clientHeight, clientWidth } = this.el.parentElement;

    this.defaultCamera.aspect = clientWidth / clientHeight;
    this.defaultCamera.updateProjectionMatrix();
    this.vignette.style({ aspect: this.defaultCamera.aspect });
    this.renderer.setSize(clientWidth, clientHeight);
  }

  load(url) {
    // Load.
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader(MANAGER)
        .setCrossOrigin('anonymous')
        .setDRACOLoader(DRACO_LOADER)
        .setKTX2Loader(KTX2_LOADER.detectSupport(this.renderer))
        .setMeshoptDecoder(MeshoptDecoder);

      const blobURLs = [];

      loader.load(
        url,
        gltf => {
          const scene = gltf.scene || gltf.scenes[0];
          const clips = gltf.animations || [];
          if (!scene) {
            // Valid, but not supported by this viewer.
            throw new Error(
              'This model contains no scene, and cannot be viewed here. However,' +
                ' it may contain individual 3D resources.'
            );
          }

          this.setContent(scene, clips);

          blobURLs.forEach(URL.revokeObjectURL);

          // See: https://github.com/google/draco/issues/349
          //DRACOLoader.releaseDecoderModule();

          resolve(gltf);
        },
        undefined,
        reject
      );
    });
  }

  /**
   * @param {THREE.Object3D} object
   * @param {Array<THREE.AnimationClip} clips
   */
  setContent(object, clips) {
    this.clear();

    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());

    this.controls.reset();

    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;
    this.controls.maxDistance = size * 10;
    this.defaultCamera.near = size / 100;
    this.defaultCamera.far = size * 100;
    this.defaultCamera.updateProjectionMatrix();

    if (this.options.cameraPosition) {
      this.defaultCamera.position.fromArray(this.options.cameraPosition);
      this.defaultCamera.lookAt(new Vector3());
    } else {
      this.defaultCamera.position.copy(center);
      this.defaultCamera.position.x += size / 2.0;
      this.defaultCamera.position.y += size / 5.0;
      this.defaultCamera.position.z += size / 2.0;
      this.defaultCamera.lookAt(center);
    }
    this.controls.enabled = true;

    this.controls.saveState();

    this.scene.add(object);
    this.content = object;

    this.state.addLights = true;

    this.content.traverse(node => {
      if (node.isLight) {
        this.state.addLights = false;
      } else if (node.isMesh) {
        // TODO(https://github.com/mrdoob/three.js/pull/18235): Clean up.
        node.material.depthWrite = !node.material.transparent;
      }
    });

    //this.setClips(clips);
    this.updateLights();
    this.updateEnvironment();
    this.updateTextureEncoding();
  }

  updateTextureEncoding() {
    const encoding = this.state.textureEncoding === 'sRGB' ? sRGBEncoding : LinearEncoding;
    traverseMaterials(this.content, material => {
      if (material.map) material.map.encoding = encoding;
      if (material.emissiveMap) material.emissiveMap.encoding = encoding;
      if (material.map || material.emissiveMap) material.needsUpdate = true;
    });
  }

  updateLights() {
    const state = this.state;
    const lights = this.lights;

    if (state.addLights && !lights.length) {
      this.addLights();
    } else if (!state.addLights && lights.length) {
      this.removeLights();
    }

    this.renderer.toneMappingExposure = state.exposure;

    if (lights.length === 2) {
      lights[0].intensity = state.ambientIntensity;
      lights[0].color.setHex(state.ambientColor);
      lights[1].intensity = state.directIntensity;
      lights[1].color.setHex(state.directColor);
    }
  }

  addLights() {
    const state = this.state;

    if (this.options.preset === Preset.ASSET_GENERATOR) {
      const hemiLight = new HemisphereLight();
      hemiLight.name = 'hemi_light';
      this.scene.add(hemiLight);
      this.lights.push(hemiLight);
      return;
    }

    const light1 = new AmbientLight(state.ambientColor, state.ambientIntensity);
    light1.name = 'ambient_light';
    this.defaultCamera.add(light1);

    const light2 = new DirectionalLight(state.directColor, state.directIntensity);
    light2.position.set(0.5, 0, 0.866); // ~60º
    light2.name = 'main_light';
    this.defaultCamera.add(light2);

    this.lights.push(light1, light2);
  }

  removeLights() {
    this.lights.forEach(light => light.parent.remove(light));
    this.lights.length = 0;
  }

  getCubeMapTexture(environment): Promise<{ envMap: any }> {
    const { path } = environment;
    if (!path) return Promise.resolve({ envMap: null });

    return new Promise((resolve, reject) => {
      new RGBELoader().load(
        path,
        texture => {
          const envMap = this.pmremGenerator.fromEquirectangular(texture).texture;
          this.pmremGenerator.dispose();
          resolve({ envMap });
        },
        undefined,
        reject
      );
    });
  }

  updateBackground() {
    this.vignette.style({ colors: [this.state.bgColor1, this.state.bgColor2] });
  }

  clear() {
    if (!this.content) return;

    this.scene.remove(this.content);

    // dispose geometry
    this.content.traverse(node => {
      if (!node.isMesh) return;
      node.geometry.dispose();
    });

    // dispose textures
    traverseMaterials(this.content, material => {
      MAP_NAMES.forEach(map => {
        if (material[map]) material[map].dispose();
      });
    });
  }

  render() {
    this.renderer.render(this.scene, this.defaultCamera);
  }
}

function traverseMaterials(object, callback) {
  object.traverse(node => {
    if (!node.isMesh) return;
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.forEach(callback);
  });
}
