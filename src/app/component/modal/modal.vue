<script>

/**
 * Компонент модального окна для дисконтной логистики
 * Бросает события:
 *  close - закрытие модала
 *
 * @author Андреев Тимофей <andreev.ta1@dns-shop.ru>
 */
export default {
	props: {
		isShown: {type: Boolean, default: false},
	},
	data() {
		return {
			isModalVisible: false,
			isAnimateModal: false,
		}
	},
	methods: {
		/**
		 * Закрытие модала
		 *
		 * @author Андреев Тимофей <andreev.ta1@dns-shop.ru>
		 */
		closeModal() {
			this.$emit('close');
		}
	},
	watch: {
		isShown(value) {
			if (true === value) {
				setTimeout(() => {
					this.isModalVisible = value;
				}, 100);
				setTimeout(() => {
					this.isAnimateModal = value;
				}, 200);
			}
			else {
				setTimeout(() => {
					this.isModalVisible = value;
				}, 300);
				setTimeout(() => {
					this.isAnimateModal = value;
				}, 100);
			}
		}
	}
}
</script>

<template>
	<div
		class="delivery-from-stock-modal"
		v-if="isModalVisible">
		<div
			@click="closeModal"
			:class="[
				'delivery-from-stock-modal__overlay',
				 {'delivery-from-stock-modal__overlay_show': isAnimateModal}
			]">
			<div
				@click.stop
				:class="[
					'delivery-from-stock-modal__container',
					 {'delivery-from-stock-modal__container_show': isAnimateModal}
				]">
				<slot></slot>
			</div>
		</div>
	</div>
</template>
