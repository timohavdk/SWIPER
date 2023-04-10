import {defineComponent, ref, computed, onMounted} from "vue";
import Coordinates from './coordinates';
import {Direction} from './direction';
import {LastPosition} from './last-position';

export default defineComponent({
	name: "Swiper",
	props: {
		hookHeight:      {type: Number, default: 25},
		bottomClose:     {type: Boolean, default: true},
		backdropEnabled: {type: Boolean, default: true},
		isHookShown:     {type: Boolean, default: false},
	},
	emits: ['close'],
	setup(props: any, {emit}) {
		const beginPosition      = ref<Coordinates>(null);
		const lastPosition       = ref<Coordinates>(null);
		const currentPosition    = ref<Coordinates>(null);
		const endPosition        = ref<Coordinates>(null);
		const direction          = ref<string>(Direction.UP);
		const lastObjectPosition = ref<string>(LastPosition.BOTTOM);
		const translateValue     = ref<number>(0);
		const maxSize            = ref<number>(0);
		const contentSize        = ref<number>(0);
		const scrollTop          = ref<number>(0);
		const isOpacityVisible   = ref<boolean>(false);
		const modal              = ref(null);
		const swiperContainer    = ref(null);

		const SWIPER_MODAL_CLASS: string = 'swiper__modal';
		const FREE_ZONE: number          = 50;
		const MIN_SCROLL: number         = 20;


		onMounted(() => {
			if (props.isShown == false) {
				return;
			}

			document.body.style.overflow = 'hidden';

			translateValue.value = 0;

			const contentHeight = modal.value.offsetHeight;
			const clientHeight = document.documentElement.clientHeight;

			if (contentHeight >= clientHeight - (FREE_ZONE + props.hookHeight)) {
				maxSize.value                      = clientHeight - (FREE_ZONE + props.hookHeight);
				modal.value.style.height           = `${maxSize.value + FREE_ZONE}px`;
				swiperContainer.value.style.height = `${maxSize.value}px`
			}
			else {
				maxSize.value = contentHeight;
			}

			contentSize.value = contentHeight;

			moveSlide(maxSize.value, maxSize.value, false, LastPosition.TOP);
			setTimeout(() => {
				isOpacityVisible.value = true;
			}, 100);
		});

		const reset = (): void => {
			beginPosition.value   = null;
			currentPosition.value = null;
			endPosition.value     = null;
		}

		const moveTop = (): void => {
			lastObjectPosition.value = LastPosition.TOP;
			translateValue.value     = maxSize.value;
			reset();
		}

		const moveDown = (): void => {
			lastObjectPosition.value = LastPosition.BOTTOM;
			translateValue.value     = 0;
			reset();
			closeBottomSheet();
		}

		const closeBottomSheet = () => {
			isOpacityVisible.value = false;

			setTimeout(() => {
				document.body.style.overflow = 'auto';
				emit('close');
			}, 300)
		}

		const moveSlide = (cycleTime: number, finishTranslate: number, decrement: boolean, finishPosition: string): void => {
			for (let i = 0; i < cycleTime; i++) {
				setTimeout(() => {
					const changeValue = (decrement ? -1 : 1);
					translateValue.value += changeValue;

					if (i === cycleTime - 1) {
						lastObjectPosition.value = finishPosition;
						translateValue.value     = finishTranslate;

						if (LastPosition.BOTTOM === finishPosition) {
							closeBottomSheet();
						}
					}
				}, i * 0.75);
			}
		}

		const translate = computed<number>(() => {
			if (props.hookHeight <= maxSize.value - translateValue.value + props.hookHeight) {
				return maxSize.value - translateValue.value + props.hookHeight;
			}

			return props.hookHeight;
		});

		const overlayCloseHandler = () => {
			moveSlide(maxSize.value, 0, true, LastPosition.BOTTOM);
			closeBottomSheet();
		}

		const touchEndHandler = (event) => {
			if (!props.bottomClose) {
				return;
			}

			if (0 !== scrollTop.value && SWIPER_MODAL_CLASS !== event.srcElement.classList[0]) {
				return;
			}

			const coordinates: Coordinates = {
				x: Math.floor(event.changedTouches[0].clientX),
				y: Math.floor(event.changedTouches[0].clientY),
			}

			// Присваивание последней координате;
			endPosition.value = coordinates;

			// Расчёт оставшегося расстояния в зависимости от начального положения

			// Начало движения с позиции снизу
			if (LastPosition.BOTTOM === lastObjectPosition.value) {
				// Движение вверх
				if (Direction.UP === direction.value) {
					const currentTranslateValue = beginPosition.value.y - endPosition.value.y;

					if (maxSize.value <= currentTranslateValue) {
						moveTop();
					}
					else if (maxSize.value > currentTranslateValue && MIN_SCROLL < currentTranslateValue) {
						reset();
						moveSlide(maxSize.value - currentTranslateValue, maxSize.value, false, LastPosition.TOP);
					}
					else {
						reset();
						moveSlide(currentTranslateValue, 0, true, LastPosition.BOTTOM);
					}
				}
				// Движение вниз
				else {
					const currentTranslateValue = beginPosition.value.y - endPosition.value.y;

					if (0 >= currentTranslateValue) {
						moveDown();
					}
					else {
						reset();
						moveSlide(currentTranslateValue, 0, true, LastPosition.BOTTOM)
					}
				}
			}

			// Начало движения с позиции сверху
			else {
				// Движение вверх
				if (Direction.UP === direction.value) {
					const currentTranslateValue = endPosition.value.y - beginPosition.value.y;

					if (0 >= currentTranslateValue) {
						moveTop();
					}
					else {
						moveSlide(currentTranslateValue, maxSize.value, false, LastPosition.TOP)
					}
				}
				// Движение вниз
				else {
					const currentTranslateValue = endPosition.value.y - beginPosition.value.y;

					if (maxSize.value <= currentTranslateValue) {
						moveDown();
					}
					else if (maxSize.value > currentTranslateValue && MIN_SCROLL < currentTranslateValue) {
						reset();
						moveSlide(maxSize.value - currentTranslateValue, 0, true, LastPosition.BOTTOM);

					}
					else {
						reset();
						moveSlide(currentTranslateValue, maxSize.value, false, LastPosition.TOP);
					}
				}
			}
		}

		const touchMoveHandler = (event) => {
			if (!props.bottomClose) {
				return;
			}

			if (0 !== scrollTop.value && SWIPER_MODAL_CLASS !== event.srcElement.classList[0]) {
				return;
			}

			const coordinates: Coordinates = {
				x: Math.ceil(event.changedTouches[0].clientX),
				y: Math.ceil(event.changedTouches[0].clientY),
			}

			// Обновление текущих координат
			lastPosition.value    = currentPosition.value;
			currentPosition.value = coordinates;

			if (null === lastPosition.value) {
				lastPosition.value = beginPosition.value;
			}

			const directionValue = lastPosition.value.y - currentPosition.value.y;

			// Определение направления свайпа
			if (0 <= directionValue) {
				direction.value = Direction.UP;
			}
			else {
				direction.value = Direction.DOWN;
			}

			// Определение смещения

			// Если объект смещают снизу
			if (LastPosition.BOTTOM === lastObjectPosition.value) {
				// Направление вверх
				if (Direction.UP === direction.value) {
					const currentTranslateValue = beginPosition.value.y - currentPosition.value.y;

					if (maxSize.value >= currentTranslateValue) {
						translateValue.value = currentTranslateValue;

						return;
					}

					translateValue.value = maxSize.value;
				}
				// Направление вниз
				else {
					const currentTranslateValue = beginPosition.value.y - currentPosition.value.y;

					if (0 <= currentTranslateValue && maxSize.value >= currentTranslateValue) {
						translateValue.value = currentTranslateValue;

						return;
					}

					translateValue.value = 0;
				}
			}
			// Если объект смещают сверху
			else {
				// Направление вверх
				if (Direction.UP === direction.value) {
					const currentTranslateValue = currentPosition.value.y - beginPosition.value.y;

					if (0 <= currentTranslateValue && maxSize.value >= currentTranslateValue) {
						translateValue.value = maxSize.value - currentTranslateValue;

						return;
					}

					translateValue.value = maxSize.value;
				}
				// Направление вниз
				else {
					const currentTranslateValue = currentPosition.value.y - beginPosition.value.y;

					if (maxSize.value >= currentTranslateValue) {
						translateValue.value = maxSize.value - currentTranslateValue;

						return;
					}

					translateValue.value = 0;
				}
			}
		}

		const touchStartHandler = (event) => {
			if (!props.bottomClose) {
				return;
			}

			if (0 !== scrollTop.value && SWIPER_MODAL_CLASS !== event.srcElement.classList[0]) {
				return;
			}

			const coordinates: Coordinates = {
				x: Math.floor(event.changedTouches[0].clientX),
				y: Math.floor(event.changedTouches[0].clientY),
			}

			// Присваивание первой координате;
			beginPosition.value = coordinates;
		}

		const scrollHandler = (event) => {
			scrollTop.value = swiperContainer.value.scrollTop;

			if (0 == scrollTop.value && props.hookHeight !== translate.value) {
				event.preventDefault();
			}
		}

		return {
			translateValue,
			modal,
			maxSize,
			contentSize,
			swiperContainer,
			translate,
			isOpacityVisible,
			touchStartHandler,
			touchEndHandler,
			touchMoveHandler,
			scrollHandler,
			overlayCloseHandler,
		}
	}
});
