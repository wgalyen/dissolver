import Dissolve from './modules/dissolve.js';

const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
const clock = new THREE.Clock();
const stats = new Stats();

const images = [
  'img/japan01.jpg',
  'img/japan02.jpg',
  'img/japan03.jpg',
  'img/japan04.jpg',
  'img/japan05.jpg',
];
const dissolve = new Dissolve(images);

const resizeWindow = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  dissolve.resize();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
const setEvent = () => {
  $(window).on('resize', () => {
    resizeWindow();
  });
}
const initDatGui = () => {
  const gui = new dat.GUI();
  const controller = {
    time: gui.add(dissolve, 'interval', 1, 10).name('interval').step(1),
    noiseX: gui.add(dissolve.noise, 'x', -100, 100).name('noiseX'),
    noiseY: gui.add(dissolve.noise, 'y', -100, 100).name('noiseY'),
    noiseZ: gui.add(dissolve.noise, 'z', -100, 100).name('noiseZ'),
  }
  controller.time.onChange((value) => {
    dissolve.uniforms.interval.value = value;
  });
  controller.noiseX.onChange((value) => {
    dissolve.uniforms.noiseX.value = value;
  });
  controller.noiseY.onChange((value) => {
    dissolve.uniforms.noiseY.value = value;
  });
  controller.noiseZ.onChange((value) => {
    dissolve.uniforms.noiseZ.value = value;
  });
}
const initStats = () => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
}
const render = () => {
  dissolve.render(clock.getDelta());
  renderer.render(scene, camera);
}
const renderLoop = () => {
  stats.begin();
  render();
  stats.end();
  requestAnimationFrame(renderLoop);
}
const init = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1.0);

  dissolve.loadTexture(images, () => {
    scene.add(dissolve.mesh);
    setEvent();
    initDatGui();
    initStats();
    resizeWindow();
    renderLoop();
  });
}
init();