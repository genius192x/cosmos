import axios from 'axios'
import apiClient from '@/lib/axiosInterceptor.js'
const baseUrl = import.meta.env.VITE_API_URL || ''
import { ref } from 'vue'

export const api = {
	buildUrl: (requestName) => {
    return baseUrl + requestName
	},

	refreshToken: async (params = {}) => {
		const response = await axios.post(`${api.buildUrl('/user/token/refresh/')}`, params);
		return response
	},

	task: async (params = {}) => {
		const response = await apiClient.get('/task/status/', { params });
		return response;
	},

	registration: async (params = {}) => {
		const response = await axios.post(`${api.buildUrl('/user/register/')}`, params);
		return response
	},

	sendEmailCode: async (params = {}) => {
		const response = await axios.post(`${api.buildUrl('/user/register/send-code/')}`, params);
		return response
	},

	verifyEmailCode: async (params = {}) => {
		const response = await axios.post(`${api.buildUrl('/user/register/confirm/')}`, params);
		return response
	},

	authorization: async (params = {}) => {
		const response = await axios.post(`${api.buildUrl('/user/token/')}`, params);

		return response
	},

	verifyEmailResetCode: async (params = {}) => {
		const response = await axios.post(`${api.buildUrl('/user/reset-password/confirm-code/')}`, params);
		return response
	},

	resetPassword: async (params = {}) => {
		const response = await axios.post(`${api.buildUrl('/user/reset-password/confirm/')}`, params);
		return response
	},

	sendResetCode: async (params = {}) => {
		const response = await axios.post(`${api.buildUrl('/user/reset-password/')}`, params);

		return response
	},

	logout: async (params = {}) => {
		const response = await axios.post(`${api.buildUrl('/user/logout/')}`, params, {
			headers: {
				'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`
			}
		});
		console.log("Успешнвый выход:", response);

		return response
	},
	uploadXLS: async (file) => {
		const formData = new FormData();
    formData.append('file', file);
		const response = await axios.post(`${api.buildUrl('/files/xlsx/')}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
				'Content-Disposition': `attachment; filename="${encodeURI(file.name)}"`
			}
		});
		return response
	},
	uploadTXT: async (file) => {

		const formData = new FormData();
    formData.append('file', file);
		const response = await axios.post(`${api.buildUrl('/files/txt/')}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
				'Content-Disposition': `attachment; filename="${encodeURI(file.name)}"`
			}
		});
		return response
	},
	uploadFiles: async (files) => {
		const response = await axios.post(`${api.buildUrl('/files/parse/')}`, files, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,			}
		});
		return response
	},
	downloadTemplate: async () => {
		const response = await axios.get(`${api.buildUrl('/files/download/xlsx')}`, {
			headers: {
				'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
			},
			data: {}
		});
		return response
	},

	getUsersList: async (params) => {
		const response = await apiClient.get('/adminka/users/', { params });
		return response;
	},

	getTaskParser: async (params) => {
		const response = await apiClient.get('/task-status-parsers/', { params });
		return response;
	},

	getStatsData: async (params) => {
		const response = await apiClient.get('/document/stats/', { params });
		return response;
	},

	getTaskPsm: async (params) => {
		const response = await apiClient.get('/task-status-calculate-psm/', { params });
		return response;
	},
	getPsm: async (params) => {
		const response = await apiClient.get('/information/payment-sum-for-month/', { params });
		return response;
	},





	//Document
	// createDoc: async (params) => {
	// 	const response = await apiClient.post('/document/create/', params);
	// 	return response;
	// },
	// softDelDoc: async (params) => {
	// 	const response = await apiClient.post('/document/delete/', params);
	// 	return response;
	// },
	// restoreDoc: async (params) => {
	// 	const response = await apiClient.post('/document/restore/', params);
	// 	return response;
	// },
	// updateDoc: async (params) => {
	// 	const response = await apiClient.post('/document/update/', params);
	// 	return response;
	// },



	//Company
	createCompany: async (params) => {
		const response = await apiClient.post('/company/create/', params);
		return response;
	},
	getRequisiteCompany: async (params) => {
		const response = await apiClient.get('/requisite/', { params }).catch((error) => {});
		return response;
	},
	getCompanies: async (params) => {
		const response = await apiClient.get('/company/', { params });
		return response;
	},
	getContragents: async (params) => {
		const response = await apiClient.get('/company/counterparty/', { params });
		return response;
	},
	updateCompany: async (params) => {
		const response = await apiClient.post('/company/update/', params);
		return response;
	},
	deleteCompany: async (params, getParams) => {
		const getString = ref('')
		for (const key in getParams) {
			getString.value += `${key}=${getParams[key]}&`
		}

		const response = await apiClient.post(`/company/delete/?${getString.value}`, params);
		return response;
	},
	restoreCompany: async (params, getParams) => {
		const getString = ref('')
		for (const key in getParams) {
			getString.value += `${key}=${getParams[key]}&`
		}
		const response = await apiClient.post(`/company/restore/?${getString.value}`, params);
		return response;
	},



	//Requisite
	createRequisite: async (params) => {
		const response = await apiClient.post('/requisite/create/', params);
		return response;
	},
	getRequisites: async (params) => {
		const response = await apiClient.get('/requisite/collection/', { params });
		return response;
	},
	updateRequisite: async (params) => {
		const response = await apiClient.post('/requisite/update/', params);
		return response;
	},
	deleteRequisite: async (params) => {
		const response = await apiClient.post('/requisite/delete/', params);
		return response;
	},
	restoreRequisite: async (params) => {
		const response = await apiClient.post('/requisite/restore/', params);
		return response;
	},

	//User profile
	updateProfile: async (params) => {
		const response = await apiClient.post('/user/info/update/', params);
		return response;
	},


}
