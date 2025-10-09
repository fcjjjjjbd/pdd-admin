import { ref, computed, unref } from 'vue';
import { defineStore } from 'pinia';
import { showAuthorize } from '../utils/common';

export const useLocationStore = defineStore('location', () => {
	const location = ref([]); //经度 、 纬度
	const city = ref({
		code: '',
		name: ''
	});
	const doLocation = () => {
		return new Promise((resolve, reject) => {
			uni.getLocation({
				type: 'gcj02',
				success: ({ longitude, latitude }) => {
					location.value = [longitude, latitude];
					console.log(location.value);
					resolve();
				},
				fail: async (err) => {
					try {
						await showAuthorize({ text: '您的位置信息' });
						doLocation().then(resolve).catch(reject);
					} catch (err) {
						reject();
					}
				}
			});
		});
	};

	return {
		location,
		doLocation,
		city
	};
});
