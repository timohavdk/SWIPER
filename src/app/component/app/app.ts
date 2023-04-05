import { transformRef } from '@vue/compiler-sfc';
import { defineComponent, ref, Ref, computed } from "vue";
import Coordinates from './coordinates';
import { Direction } from './direction';
import { LastPosition } from './last-position';

export default defineComponent({
	name:    "App",
	setup() {
		const direction          = ref<string>(Direction.UP);
		const beginPosition      = ref<Coordinates>(null);
		const lastPosition       = ref<Coordinates>(null);
		const currentPosition    = ref<Coordinates>(null);
		const endPosition        = ref<Coordinates>(null);
		const lastObjectPosition = ref<string>(LastPosition.BOTTOM);
		const translateValue     = ref<number>(0);

		const reset = (): void => {
			beginPosition.value   = null;
			lastPosition.value    = null;
			currentPosition.value = null;
			endPosition.value     = null;
		}

		const touchEndHandler = (event) => {
			console.log('END');

			const coordinates: Coordinates = {
				x: event.changedTouches[0].clientX,
				y: event.changedTouches[0].clientY,
			}

			// Присваивание последней координате;
			endPosition.value = coordinates;

			// Расчёт оставшегося расстояния в зависимости от начального положения

			// Начало движения с позиции снизу
			if (LastPosition.BOTTOM === lastObjectPosition.value) {
				// Движение вверх
				if (Direction.UP === direction.value) {
					const currentTranslateValue = beginPosition.value.y - endPosition.value.y;

					if (300 <= currentTranslateValue) {
						console.log("MAX");
						lastObjectPosition.value = LastPosition.TOP;
						translateValue.value = 300;
						reset();
					}
					else if (300 > currentTranslateValue && 30 < currentTranslateValue) {
						console.log("MAX UPPER");
						lastObjectPosition.value = LastPosition.TOP;
						reset();
						for (let i = 0; i < 300 - currentTranslateValue; i++) {
							setTimeout(() => {
								translateValue.value += 1;
							}, 2 * i);
						}
					}
					else {
						console.log("DOWN");
						lastObjectPosition.value = LastPosition.BOTTOM;
						reset();
						for (let i = 0; i < currentTranslateValue; i++) {
							setTimeout(() => {
								translateValue.value -= 1;
							}, 2 * i);
						}
					}
				}
				// Движение вниз
				else {
					const currentTranslateValue = beginPosition.value.y - endPosition.value.y;

					if (0 >= currentTranslateValue) {
						lastObjectPosition.value = LastPosition.BOTTOM;
						translateValue.value = 0;
						reset();
					}

					for (let i = 0; i < currentTranslateValue; i++) {
						lastObjectPosition.value = LastPosition.BOTTOM;
						reset();
						setTimeout(() => {
							translateValue.value -= 1;
						}, i);
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
						translateValue.value = 300;
						reset();
					}

					for (let i = 0; i < currentTranslateValue; i++) {
						lastObjectPosition.value = LastPosition.TOP;
						reset();
						setTimeout(() => {
							translateValue.value += 1;
						}, i);
					}
				}
				// Движение вниз
				else {
					const currentTranslateValue = endPosition.value.y - beginPosition.value.y;

					if (300 <= currentTranslateValue) {
						console.log("MAX");
						lastObjectPosition.value = LastPosition.BOTTOM;
						translateValue.value = 0;
						reset();
					}
					else if (300 > currentTranslateValue && 30 < currentTranslateValue) {
						console.log("MAX UPPER");
						lastObjectPosition.value = LastPosition.BOTTOM;
						reset();
						for (let i = 0; i < 300 - currentTranslateValue; i++) {
							setTimeout(() => {
								translateValue.value -= 1;
							}, 2 * i);
						}
					}
					else {
						console.log("DOWN");
						lastObjectPosition.value = LastPosition.BOTTOM;
						reset();
						for (let i = 0; i < currentTranslateValue; i++) {
							setTimeout(() => {
								translateValue.value += 1;
							}, 2 * i);
						}
					}
				}
			}
		}

		const touchMoveHandler = (event) => {
			console.log('MOVE');

			const coordinates: Coordinates = {
				x: Math.floor(event.changedTouches[0].clientX),
				y: Math.floor(event.changedTouches[0].clientY),
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
				console.log('dir val', direction.value);
			}
			else {
				direction.value = Direction.DOWN;
				console.log('dir val', direction.value);
			}

			// Определение смещения

			// Если объект смещают снизу
			if (LastPosition.BOTTOM === lastObjectPosition.value) {
				// Направление вверх
				if (Direction.UP === direction.value) {
					console.log('UP');
					const currentTranslateValue = beginPosition.value.y - currentPosition.value.y;

					if (300 >= currentTranslateValue) {
						translateValue.value = currentTranslateValue;

						return;
					}

					translateValue.value = 300;
				}
				// Направление вниз
				else {
					console.log('DOWN')
					const currentTranslateValue = beginPosition.value.y - currentPosition.value.y;

					if (0 <= currentTranslateValue && 300 >= currentTranslateValue) {
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
					console.log('UP');
					const currentTranslateValue =  currentPosition.value.y - beginPosition.value.y;

					if (0 <= currentTranslateValue && 300 >= currentTranslateValue) {
						translateValue.value = 300 - currentTranslateValue;

						return;
					}

					translateValue.value = 300;
				}
				// Направление вниз
				else {
					console.log('DOWN')
					const currentTranslateValue = currentPosition.value.y - beginPosition.value.y;

					if (300 >= currentTranslateValue) {
						translateValue.value = 300 - currentTranslateValue;

						return;
					}

					translateValue.value = 0;
				}
			}
		}

		const touchStartHandler = (event) => {
			console.log('START');

			const coordinates: Coordinates = {
				x: event.changedTouches[0].clientX,
				y: event.changedTouches[0].clientY,
			}

			// Присваивание первой координате;
			beginPosition.value = coordinates;
		}

		return {
			touchStartHandler,
			touchEndHandler,
			touchMoveHandler,
			translateValue
		}
	}
});
