import {defineComponent, ref, Ref, computed, onMounted} from "vue";
import {createLogger} from 'vuex';
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

		const reset = (): void => {
			beginPosition.value   = null;
			lastPosition.value    = null;
			currentPosition.value = null;
			endPosition.value     = null;
		}

		onMounted(() => {
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
		})

		const touchEndHandler = (event) => {
			event.preventDefault();
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
						lastObjectPosition.value = LastPosition.TOP;
						translateValue.value     = maxSize.value;
						reset();
					}
					else if (maxSize.value > currentTranslateValue && 20 < currentTranslateValue) {
						lastObjectPosition.value = LastPosition.TOP;
						reset();
						for (let i = 0; i < maxSize.value - currentTranslateValue; i++) {
							setTimeout(() => {
								translateValue.value += 1;

								if (i === (maxSize.value - 1) - currentTranslateValue && maxSize.value !== translateValue.value) {
									translateValue.value = maxSize.value;
								}
							}, 2 * i);
						}
					}
					else {
						lastObjectPosition.value = LastPosition.BOTTOM;
						reset();
						for (let i = 0; i < currentTranslateValue; i++) {
							setTimeout(() => {
								translateValue.value -= 1;

								if (i === currentTranslateValue - 1 && 0 !== translateValue.value) {
									translateValue.value = 0;
								}
							}, 2 * i);
						}
					}
				}
				// Движение вниз
				else {
					const currentTranslateValue = beginPosition.value.y - endPosition.value.y;

					if (0 >= currentTranslateValue) {
						lastObjectPosition.value = LastPosition.BOTTOM;
						translateValue.value     = 0;
						reset();
					}

					else {
						lastObjectPosition.value = LastPosition.BOTTOM;
						reset();

						for (let i = 0; i < currentTranslateValue; i++) {
							setTimeout(() => {
								translateValue.value -= 1;

								if (i === currentTranslateValue - 1 && 0 !== translateValue.value) {
									translateValue.value = 0;
								}
							}, 2 * i);
						}
					}
				}
			}

			// Начало движения с позиции сверху
			else {
				// Движение вверх
				if (Direction.UP === direction.value) {
					const currentTranslateValue = endPosition.value.y - beginPosition.value.y;

					if (0 >= currentTranslateValue) {
						lastObjectPosition.value = LastPosition.TOP;
						translateValue.value     = maxSize.value;
						reset();
					}
					else {
						for (let i = 0; i < currentTranslateValue; i++) {
							lastObjectPosition.value = LastPosition.TOP;
							reset();
							setTimeout(() => {
								translateValue.value += 1;

								if (i === currentTranslateValue - 1 && maxSize.value !== translateValue.value) {
									translateValue.value = maxSize.value;
								}
							}, i);
						}
					}
				}
				// Движение вниз
				else {
					const currentTranslateValue = endPosition.value.y - beginPosition.value.y;

					if (maxSize.value <= currentTranslateValue) {
						lastObjectPosition.value = LastPosition.BOTTOM;
						translateValue.value     = 0;
						reset();
					}
					else if (maxSize.value > currentTranslateValue && 20 < currentTranslateValue) {
						lastObjectPosition.value = LastPosition.BOTTOM;
						reset();
						for (let i = 0; i < maxSize.value - currentTranslateValue; i++) {
							setTimeout(() => {
								translateValue.value -= 1;

								if (i === (maxSize.value - currentTranslateValue) - 1 && 0 !== translateValue.value) {
									translateValue.value = 0;
								}
							}, 2 * i);
						}
					}
					else {
						lastObjectPosition.value = LastPosition.TOP;
						reset();
						for (let i = 0; i < currentTranslateValue; i++) {
							setTimeout(() => {
								translateValue.value += 1;

								if (i === currentTranslateValue - 1 && maxSize.value !== translateValue.value) {
									translateValue.value = maxSize.value;
								}
							}, 2 * i);
						}
					}
				}
			}
		}

		const touchMoveHandler = (event) => {
			event.preventDefault();
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
			event.preventDefault();
			if (0 !== scrollTop.value) {
				return;
			}

			console.log('event', event)
			const coordinates: Coordinates = {
				x: Math.floor(event.changedTouches[0].clientX),
				y: Math.floor(event.changedTouches[0].clientY),
			}

			// Присваивание первой координате;
			beginPosition.value = coordinates;
		}

		const scrollHandler = () => {
			scrollTop.value = swiperContainer.value.scrollTop;
		}

		return {
			touchStartHandler,
			touchEndHandler,
			touchMoveHandler,
			translateValue,
			modal,
			maxSize,
			contentSize,
			swiperContainer,
			scrollHandler
		}
	}
});
