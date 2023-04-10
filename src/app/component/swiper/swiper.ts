import {defineComponent, ref, Ref, computed, onMounted} from "vue";
import Coordinates from './coordinates';
import {Direction} from './direction';
import {LastPosition} from './last-position';

export default defineComponent({
	name: "Swiper",
	setup(props: any) {
		const direction          = ref<string>(Direction.UP);
		const beginPosition      = ref<Coordinates>(null);
		const lastPosition       = ref<Coordinates>(null);
		const currentPosition    = ref<Coordinates>(null);
		const endPosition        = ref<Coordinates>(null);
		const lastObjectPosition = ref<string>(LastPosition.BOTTOM);
		const translateValue     = ref<number>(0);
		const modal              = ref(null);
		const swiperContainer    = ref(null);
		const maxSize            = ref(0);
		const contentSize        = ref(0);
		const scrollTop          = ref(0);

		onMounted(() => {
			document.body.style.overflow = 'hidden';

			translateValue.value = 0;

			const contentHeight = modal.value.offsetHeight;
			const clientHeight = document.documentElement.clientHeight;

			if (contentHeight >= clientHeight - 75) {
				maxSize.value = clientHeight - 75;
				modal.value.style.height = `${maxSize.value}px`;
				swiperContainer.value.style.height = `${maxSize.value}px`
			}
			else {
				maxSize.value = contentHeight;
			}

			contentSize.value = contentHeight;
		});

		const reset = (): void => {
			beginPosition.value   = null;
			lastPosition.value    = null;
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
		}

		const moveSlide = (cycleTime: number, finishTranslate: number, decrement: boolean, finishPosition: string): void => {
			for (let i = 0; i < cycleTime; i++) {
				setTimeout(() => {
					const changeValue = (decrement ? -1 : 1);
					translateValue.value += changeValue;
					if (i === cycleTime - 1) {
						lastObjectPosition.value = finishPosition;
						translateValue.value = finishTranslate;
						console.log('position', lastObjectPosition.value)
					}
				}, i * 0.75);
			}
		}

		const translate = computed<number>(() => {
			if (25 <= maxSize.value - translateValue.value + 25) {
				return maxSize.value - translateValue.value + 25;
			}

			if (maxSize.value < maxSize.value - translateValue.value + 25) {
				console.log(23232);
				return maxSize.value;
			}
			return 25;
		})

		const touchEndHandler = (event) => {
			if (0 !== scrollTop.value) {
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
						console.log('1111- up')
						moveTop();
					}
					else if (maxSize.value > currentTranslateValue && 20 < currentTranslateValue) {
						console.log('2222- up')
						reset();
						moveSlide(maxSize.value - currentTranslateValue, maxSize.value, false, LastPosition.TOP);
					}
					else {
						console.log('3333- up')
						//lastObjectPosition.value = LastPosition.BOTTOM;
						reset();
						moveSlide(currentTranslateValue, 0, true, LastPosition.BOTTOM);
					}
				}
				// Движение вниз
				else {
					const currentTranslateValue = beginPosition.value.y - endPosition.value.y;

					if (0 >= currentTranslateValue) {
						console.log('4444- up')
						moveDown();
					}

					else {
						console.log('5555- up')
						//lastObjectPosition.value = LastPosition.BOTTOM;
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
						console.log('1111');
						moveTop();
					}
					else {
						console.log('2222');
						moveSlide(currentTranslateValue, maxSize.value, false, LastPosition.TOP)
					}
				}
				// Движение вниз
				else {
					const currentTranslateValue = endPosition.value.y - beginPosition.value.y;

					if (maxSize.value <= currentTranslateValue) {
						console.log('3333');
						moveDown();
					}
					else if (maxSize.value > currentTranslateValue && 20 < currentTranslateValue) {
						//lastObjectPosition.value = LastPosition.BOTTOM;
						reset();
						moveSlide(maxSize.value - currentTranslateValue, 0, true, LastPosition.BOTTOM);

					}
					else {
						//lastObjectPosition.value = LastPosition.TOP;
						reset();
						console.log('5555')
						moveSlide(currentTranslateValue, maxSize.value, false, LastPosition.TOP);
					}
				}
			}
		}

		const touchMoveHandler = (event) => {
			//event.preventDefault();
			if (0 !== scrollTop.value) {
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
			if (0 !== scrollTop.value) {
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

			if (0 == scrollTop.value && 25 !== translate.value) {
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
			touchStartHandler,
			touchEndHandler,
			touchMoveHandler,
			scrollHandler,
		}
	}
});
