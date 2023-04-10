import {defineComponent, ref} from 'vue';
import Swiper from '../swiper/swiper.vue';

export default defineComponent({
	name: 'App',
	components: {
		Swiper,
	},
	setup() {
		const isVisible = ref<boolean>(false);

		const breaks = {
			top: {
				enabled: true,
				height: 300,
				bounce: true,
			}
		}

		const clickHandlerBottomSheet = () => {
			console.log(1);
			isVisible.value = !isVisible.value;
		}

		return {
			clickHandlerBottomSheet,
			isVisible,
			breaks
		}
	}
})
