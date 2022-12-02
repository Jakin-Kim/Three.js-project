import './style.scss';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// 조명(light)
function addLighting(scene) {
  let color = 0xFFFFFF;
  let intensity = 1;
  let light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 10, 0);
  light.target.position.set(-5, -2, -5);
  scene.add(light);
  scene.add(light.target);
}

// 공(sphere)
function addSphere(scene) {
  let geometry = new THREE.SphereGeometry( 5, 32, 32 );
  let material = new THREE.MeshStandardMaterial({color: 0x7fffd4, roughness: 0});
  let sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0, 5, 0);
  sphere.name = 'my-sphere';
  scene.add( sphere );
}

// 바닥(floor)
function addFloor(scene) {
  let geometry = new THREE.BoxGeometry(50, 1, 50);
  let material = new THREE.MeshStandardMaterial({color: 0xDDDDDD, roughness: 0});
  const floor = new THREE.Mesh( geometry, material );
  floor.position.set(0, -10, 0);
  floor.name = 'my-floor';
  scene.add(floor);
}

// 반응형 처리
function windowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#FFFFFF');
const canvas = document.querySelector("#canvas");

// camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 20, 50);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, canvas);

// renderer
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize( window.innerWidth, window.innerHeight );

addLighting(scene); // scene에 조명 추가
addFloor(scene);    // scene에 바닥 추가
addSphere(scene);   // scene에 공 추가

// 공의 movement 추가 
let acceleration = 9;       // 가속도(저항이 없다면, 중력과 같다)
let bounce_distance = 18;   // 물체가 떨어져있는 거리
let bottom_position_y = -4; // 
let time_step = 0.02;       // 

// 낙하운동의 공식을 사용하기(s = (1/2)gt*t)
// s = 이동거리, g = 중력(공기저항이 무시된다면 '중력 = 가속도'), t = 이동시간
// 시간으로 공식을 바꿔보면, t = root(2S / g)가 된다.
let time_counter = Math.sqrt(bounce_distance * 2 / acceleration); // 공이 가장 위쪽에 위치하는 시간을 계산한다.
let initial_speed = acceleration * time_counter;
let sphere = scene.getObjectByName("my-sphere");

// 애니메이션 scene
const animate = () => {
  requestAnimationFrame( animate );

  // 바닥에 공이 닿으면 이동시간을 리셋한다.
  if (sphere.position.y < bottom_position_y) time_counter = 0;
  // 시간이 0으로 돌아가면 바닥에서 튀어올라간다. 바닥의 위치 공식 : s2 = s1 + ut + (1/2)gt*t
  sphere.position.y = bottom_position_y + initial_speed * time_counter - 0.5 * acceleration * time_counter * time_counter;
    
  // 이동시간의 흐름
  time_counter += time_step;

  window.addEventListener('resize', windowResize);
  renderer.render( scene, camera );
};
animate();