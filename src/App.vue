<script setup lang=ts>
import { useToggle, useColorMode } from '@vueuse/core'
import { ref, onBeforeMount, computed, onMounted } from 'vue'
import { useCycleList } from '@vueuse/core'
import { watchEffect } from 'vue'
// import { parseAcl, checkPermission } from '@/lib/utils'
import BlurReveal from './components/BlurReveal.vue'
import { ParticlesBg } from './components/ui/particles-bg'
import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0/build/three.module.js'
import {GLTFLoader} from 'https://cdn.skypack.dev/three@v0.129.0/examples/jsm/loaders/GLTFLoader.js';
import FlipWords from './components/FlipWords.vue'
import BorderBeam from './components/BorderBeam.vue'
import { gsap } from 'https://cdn.skypack.dev/gsap'

const camera = new THREE.PerspectiveCamera(
	10,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

camera.position.z = window.innerWidth > 768 ? 90 : 200;

const scene = new THREE.Scene();

let astronaut;
const loader = new GLTFLoader();
loader.load('/models/astronaut.glb',
	function (gltf) { 
		astronaut = gltf.scene;
		scene.add(astronaut);
		
		
		astronaut.position.set(2, 10, 0);
		astronaut.rotation.y = 1;
		setTimeout(() => {
			modelMove()
		}, 500)
		
	},
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	function (error) {
		console.error('An error happened', error);
	}
)

//light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const renderer = new THREE.WebGLRenderer({alpha: true});

renderer.setSize(window.innerWidth, window.innerHeight);


const reRender3D= () => {
	requestAnimationFrame(reRender3D);
	renderer.render(scene, camera);
};

reRender3D()
onMounted(() => {
	const model3d = document.getElementById('model3d');
	if (model3d) {
		model3d.appendChild(renderer.domElement);
	}
});
const modelMove = () => {
	const section = document.querySelectorAll('.section');
	let currentSection;
	section.forEach((el, index) => {
		const rect = el.getBoundingClientRect();
		if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
			currentSection = el.id;
		}
	});
	let positionActive = arrPositionModel.findIndex((el) => el.id === currentSection);
	if (positionActive >= 0) { 
		let newPosition = arrPositionModel[positionActive];
		gsap.to(astronaut.position, {
			x: newPosition.position.x,
			y: newPosition.position.y,
			z: newPosition.position.z,
			duration: 2,
			ease: 'power1.out',
		});
		gsap.to(astronaut.rotation, {
			x: newPosition.rotation.x,
			y: newPosition.rotation.y,
			z: newPosition.rotation.z,
			duration: 2,
			ease: 'power1.out',
		});
	}
};
window.addEventListener('scroll', () => {
	if (astronaut) {
		modelMove()
	}
})

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

let arrPositionModel = [
	{
		id: 'banner',
		position: { x: 2, y: -4, z: 0 },
		rotation: { x: 0, y: 2, z: 0 },
	},
	{
		id: 'description',
		position: { x: 13, y: -4, z: -10 },
		rotation: { x: 0, y: 1, z: 0 },
	},
	{
		id: 'front',
		position: { x: 8, y: -4, z: 10 },
		rotation: { x: 0, y: 1.6, z: 0 },
	},
	{
		id: 'left',
		position: { x: 2, y: -4, z: 10 },
		rotation: { x: 0, y: 0, z: 0 },
	},
	{
		id: 'back',
		position: { x: -6, y: -4, z: 10 },
		rotation: { x: 0, y: -1.65, z: 0 },
	},
	{
		id: 'right',
		position: { x: -1, y: -4, z: 10 },
		rotation: { x: 0, y: -3.1, z: 0 },
	},

]

const mode = useColorMode({
  emitAuto: true,
})

const { state, next } = useCycleList(['dark', 'light'] as const, { initialValue: mode })

watchEffect(() => mode.value = state.value)

document.addEventListener('DOMContentLoaded',()=> {
	const cover = document.querySelector('.cover');
	if(cover) {
		cover.classList.add('-top-[110dvh]!');
	}

})

</script>


<template>
	<div class="fixed top-0 left-0 w-full h-full bg-black z-[10000] transition-all duration-[2s] cover"></div>
	<section class="section relative flex min-h-screen w-full flex-col items-end justify-center text-white" id="banner">
		<ParticlesBg class="-z-10 h-[100dvh] w-full fixed top-0 left-0" :quantity="500"/>
		<div class="mr-24">
			<h1 class="text-white text-6xl font-bold mb-4">Cosmic Explorer</h1>
			<p class="text-gray-300 text-xl max-w-md text-left">Venture into the unknown with our 3D astronaut, floating through the 
				<FlipWords
					:words="['digital', 'beautiful', 'amazing']"
					:duration="3000"
					class="w-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent text-white"
				/> cosmos</p>
		</div>
	</section>
	<section id="description" class="section flex flex-col items-strart justify-center w-full h-screen">
		<div class="ml-20">
			<h1 class="text-white text-6xl font-bold mb-4">3D Space Adventure</h1>
			<p class="text-gray-300 text-xl max-w-lg text-left">
				This interactive astronaut model was created by my friend who is learning Blender. 
				Watch how the astronaut follows your journey through space as you scroll through the cosmic sections.
			</p>
		</div>
	
	</section>
	<section id="front" class="section flex flex-col items-strart justify-center w-full h-screen">
		
	</section>
	<section id="left" class="section flex flex-col items-strart justify-center w-full h-screen">
		
	</section>
	<section id="back" class="section flex flex-col items-strart justify-center w-full h-screen">
		
	</section>
	<section id="right" class="section flex flex-col items-strart justify-center w-full h-screen">
		
	</section>
	<div class="" id="model3d"></div>
</template>

<style>
html {
	/* cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23FFF" stroke="%23000" stroke-width="2" d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"></path></svg>'), auto; */
	/* cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23FFF" stroke="%23000" stroke-width="2" stroke-linejoin="round" d="M10 11V8.99c0-.88.59-1.64 1.44-1.86h.05A1.99 1.99 0 0 1 14 9.05V12v-2c0-.88.6-1.65 1.46-1.87h.05A1.98 1.98 0 0 1 18 10.06V13v-1.94a2 2 0 0 1 1.51-1.94h0A2 2 0 0 1 22 11.06V14c0 .6-.08 1.27-.21 1.97a7.96 7.96 0 0 1-7.55 6.48 54.98 54.98 0 0 1-4.48 0 7.96 7.96 0 0 1-7.55-6.48C2.08 15.27 2 14.59 2 14v-1.49c0-1.11.9-2.01 2.01-2.01h0a2 2 0 0 1 2.01 2.03l-.01.97v-10c0-1.1.9-2 2-2h0a2 2 0 0 1 2 2V11Z"></path></svg>'), pointer; */
}
#app {
	height: 100dvh;
	/* overflow: hidden; */
}
body{
	background: #000;
	height: 100dvh;
}
.dark body{
	background: #1a202c;
}
#model3d {
	position: fixed;
	top: 0;
	z-index: 1000;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	/* z-index: -1;  */
}
</style>
