<script lang="ts" src="./app.ts"></script>
<style src="./app.scss"></style>

<template>
	<div class="app">
		<div
				@touchstart="touchStartHandler"
				@touchend="touchEndHandler"
				@touchmove="touchMoveHandler"
				class="app__road">
			<div :style="{transform: `translateY(-${translateValue}px)`}" class="app__ball">

			</div>
		</div>
	</div>
</template>
