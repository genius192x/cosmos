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
import { boolean } from 'zod'

const camera = new THREE.PerspectiveCamera(
	10,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

camera.position.z = window.innerWidth > 768 ? 100 : 200;

const scene = new THREE.Scene();

let astronaut;
let navbar
const loader = new GLTFLoader();
loader.load('astronaut.glb',
  function (gltf) {
    astronaut = gltf.scene;
		navbar = document.querySelector('nav');
    const textureLoader = new THREE.TextureLoader();
		const aoMap = textureLoader.load('austranaut_ao.png');
		const normalMap = textureLoader.load('austranaut_normal.png');
		const roughnessMap = textureLoader.load('austranaut_matid.png');
		const idMap = textureLoader.load('austranaut_curve.png');

		// astronaut.traverse((child) => {
		// 	if (child.isMesh) {
		// 		// Копируем UV в uv2 для aoMap
		// 		if (child.geometry.attributes.uv && !child.geometry.attributes.uv2) {
		// 			child.geometry.setAttribute('uv2', child.geometry.attributes.uv);
		// 		}
		// 		child.material.aoMap = aoMap;
		// 		child.material.normalMap = normalMap;
		// 		child.material.roughnessMap = roughnessMap;
		// 		// idMap не назначаем как map, если это маска
		// 		child.material.needsUpdate = true;
		// 	}
		// });
		scene.add(astronaut);

		// astronaut.position.set(2, 10, 0);
		astronaut.position.set(0, 0, 0);
		astronaut.scale.set(1, 1, 1);
    astronaut.rotation.y = 1;

    setTimeout(() => {
      modelMove();
    }, 500);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('An error happened', error);
  }
);

//light

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1.1);
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


const modelMove = (params) => {
	
	const section = document.querySelectorAll('.section');
	let currentSection;
	section.forEach((el, index) => {
		const rect = el.getBoundingClientRect();
		if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
			currentSection = el.id;
		}
	});
	if (params) {
		currentSection = params;
	}
	let positionActive = arrPositionModel.findIndex((el) => el.id === currentSection);
	console.log('positionActive', positionActive, currentSection);
	
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
	if (positionActive > 1) {
		gsap.to(navbar, {
			opacity: 1,
			bottom: '80px',
			duration: 1,
			ease: 'power1.out',
		});
	} else {
		gsap.to(navbar, {
			bottom: '-100px',
			opacity: 0,
			duration: 1,
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
		id: 'moon',
		position: { x: 8, y: -2, z: 40 },
		rotation: { x: 0, y: 1.6, z: 0.25 },
	},
	{
		id: 'back',
		position: { x: -6, y: -4, z: 30 },
		rotation: { x: 0, y: -2.15, z: 0 },
	},
	{
		id: 'helmet',
		position: { x: 8, y: -5, z: 50 },
		rotation: { x: 0, y: 1.9, z: 0 },
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
	<!-- <section id="left" class="section flex flex-col items-strart justify-center w-full h-screen">
		
	</section>
	<section id="back" class="section flex flex-col items-strart justify-center w-full h-screen">
		
	</section>
	<section id="right" class="section flex flex-col items-strart justify-center w-full h-screen">
		
	</section> -->
	<nav class="fixed -bottom-20 left-1/2 -translate-x-1/2 z-[1100] bg-[rgba(255,255,255,0.1)] backdrop-blur-xs rounded-2xl">
		<ul class="flex justify-around p-4 gap-20">
			<li>
				<a @click.prevent="modelMove('back')" class="text-white hover:text-white">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-backpack-icon lucide-backpack"><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 10h8"/><path d="M8 18h8"/><path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
				</a>
			</li>
			<li>
				<a @click.prevent="modelMove('moon')" class="text-white hover:text-white">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-icon lucide-moon"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
				</a>
			</li>
			<li>
				<a @click.prevent="modelMove('helmet')" class="text-white hover:text-white">
					<svg fill="#fff" width="24px" height="24px" viewBox="0 -0.3 47.6 47.6" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg"><path d="M45.55,8.31a3.32,3.32,0,1,1,4.22,3.2v8.55H48V11.51A3.36,3.36,0,0,1,45.55,8.31Z" transform="translate(-4.57 -5)"/><path d="M35.31,7.47v8.68C41,18.62,45,23.86,45,30c0,8.43-7.6,13.25-16.88,13.25S11.2,38.38,11.2,30c0-6.09,4-11.33,9.64-13.8V7.47c-7.77,3-12,11-12,20.31,0,12,8.62,18.8,19.28,18.8s19.29-6.81,19.29-18.8C47.36,18.44,43.08,10.48,35.31,7.47Z" transform="translate(-4.57 -5)"/><path d="M34.1,15.67V7.05a21.51,21.51,0,0,0-6-.91,19.52,19.52,0,0,0-6,.91v8.62a18.14,18.14,0,0,1,12.05,0Z" transform="translate(-4.57 -5)"/><path d="M24.4,17.83a14.36,14.36,0,0,0-8.92,6.93.6.6,0,0,0,.36.85l2.65.84a.66.66,0,0,0,.73-.3,9.9,9.9,0,0,1,6.2-4.94.66.66,0,0,0,.43-.72l-.67-2.23A.59.59,0,0,0,24.4,17.83Z" transform="translate(-4.57 -5)"/><path d="M4.57,30.31v1.2a3,3,0,0,0,3,3h1a19.61,19.61,0,0,1-.84-4.22Z" transform="translate(-4.57 -5)"/><path d="M7.59,27.78a28.48,28.48,0,0,1,.72-6.51H7.59a3,3,0,0,0-3,3V29.1h3Z" transform="translate(-4.57 -5)"/><path d="M47.6,34.53h1a3,3,0,0,0,3-3v-1.2H48.44A19.61,19.61,0,0,1,47.6,34.53Z" transform="translate(-4.57 -5)"/><path d="M48.56,21.27h-.72a28.48,28.48,0,0,1,.72,6.51,10.17,10.17,0,0,1-.06,1.32h3V24.28A2.89,2.89,0,0,0,48.56,21.27Z" transform="translate(-4.57 -5)"/><path d="M42.42,43.44a21.89,21.89,0,0,1-14.35,4.94,21.89,21.89,0,0,1-14.34-4.94l-.84.85a.57.57,0,0,0-.06.78c3.56,4.52,9,6.93,15.24,6.93s11.69-2.41,15.25-6.93a.56.56,0,0,0-.06-.78Z" transform="translate(-4.57 -5)"/></svg>
				</a>
			</li>
		</ul>
	</nav>
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
