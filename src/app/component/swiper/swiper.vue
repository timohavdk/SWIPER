<script lang="ts" src="./swiper.ts"></script>
<style src="./swiper.scss"></style>

<template>
	<div class="swiper">
		<div
			:class="[
				'swiper__overlay',
				{'swiper__overlay_visible': isOpacityVisible}
			]"
			@click="overlayCloseHandler"
		></div>
		<div
			@touchstart="touchStartHandler"
			@touchend="touchEndHandler"
			@touchmove="touchMoveHandler"
			:style="{height: `${maxSize - hookHeight}px`}"
			class="swiper__road">
			<div
				ref="modal"
				:style="{
					transform:     `translateY(${translate}px)`,
					paddingTop: `${hookHeight}px`
				}"
				class="swiper__modal"
			>
				<div
					:class="[
						'swiper__container',
						{'swiper__container_no-scroll': translate !== hookHeight}
					]"
					ref="swiperContainer"
					@scroll="scrollHandler"
				>
					<div class="swiper__header">
						<slot name="header"/>
					</div>
					<div class="swiper__content">
						<slot name="content"/>
					</div>
					<div
						class="swiper__footer"
						:style="{paddingBottom: `${hookHeight}px`}"
					>
						<slot name="footer"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
