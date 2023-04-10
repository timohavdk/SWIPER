<script lang="ts" src="./swiper.ts"></script>
<style src="./swiper.scss"></style>

<template>
	<div class="swiper">
		<div
			@touchstart="touchStartHandler"
			@touchend="touchEndHandler"
			@touchmove="touchMoveHandler"
			:style="{height: `${maxSize + 25}px`}"
			class="swiper__road">
			<div
				ref="modal"
				:style="{transform: `translateY(${translate}px)`}"
				class="swiper__modal"
			>
				<div
					class="swiper__container"
					ref="swiperContainer"
					@scroll="scrollHandler"
				>
					<div class="swiper__header">
						<slot name="header"/>
					</div>
					<div class="swiper__content">
						<slot name="content"/>
					</div>
					<div class="swiper__footer">
						<slot name="footer"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
