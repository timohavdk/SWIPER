import {defineComponent, ref} from 'vue';
import BaseUiBottomSheet from '../base-ui-bottom-sheet/base-ui-bottom-sheet.vue';

export default defineComponent({
	name: 'App',
	components: {
		BaseUiBottomSheet,
	},
	setup() {
		const isVisible = ref<boolean>(false);
		const close = ref<boolean>(false);

		const breaks = {
			top: {
				enabled: true,
				height:  300,
				bounce:  true,
			}
		}

		const clickHandlerBottomSheet = () => {
			isVisible.value = true;
		}

		const closeHandler = () => {
			isVisible.value = false;
			close.value     = false;
		}

		const closeBottomSheet = () => {
			close.value = true;
		}

		return {
			clickHandlerBottomSheet,
			closeBottomSheet,
			closeHandler,
			isVisible,
			breaks,
			close,
		}
	}
})
