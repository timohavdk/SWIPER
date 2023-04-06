import {defineComponent, ref} from 'vue';
import Swiper from '../swiper/swiper.vue';

export default defineComponent({
	name: 'App',
	components: {
		Swiper,
	},
	setup() {
		const isVisibleCupertino = ref<boolean>(false);

		const breaks = {
			top: {
				enabled: true,
				height: 300,
				bounce: true,
			}
		}

		const clickHandlerBottomSheetCupertino = () => {
			isVisibleCupertino.value = !isVisibleCupertino.value;
		}

		return {
			clickHandlerBottomSheetCupertino,
			isVisibleCupertino,
			breaks
		}
	}
})
