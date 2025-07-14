import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

// import DashBoardView from '@/pages/DashBoard.vue'



const routes = [
	// {
	// 	path: "/",
	// 	name:"home",
	// 	component: DashBoardView,
	// },
	
];
const router = createRouter({
	history: createWebHistory(),
	routes,
});


export default router;
