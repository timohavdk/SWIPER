<script lang="ts" src="./app.ts"></script>
<style src="./app.scss"></style>

<template>
	<div class="app">
		<button
			class="app__button"
			@click="clickHandlerBottomSheet"
		>Show bottom-sheet</button>
		<Swiper
			@close="clickHandlerBottomSheet"
			:hookHeight="30"
			v-if="isVisible"
		>
			<template #header>
				<p>Header</p>
			</template>
			<template #content>
				<p style="height: 700px">Content</p>
			</template>
			<template #footer>
				<p>Footer</p>
			</template>
		</Swiper>
	</div>
</template>


