<script lang="ts" src="./app.ts"></script>
<style src="./app.scss"></style>

<template>
	<div class="app">
		<button
			class="app__button"
			@click="clickHandlerBottomSheet"
		>Show bottom-sheet</button>
		<BaseUiBottomSheet
			@close="closeHandler"
			:hookHeight="30"
			:bottomClose="true"
			:backdropEnabled="true"
			:isHookShown="true"
			:isClose="close"
			v-if="isVisible"
		>
			<template #header>
				<p>Header</p>
			</template>
			<template #content>
				<p style="height: 400px">Content</p>
				<button @click="closeBottomSheet">close</button>
			</template>
			<template #footer>
				<p>Footer</p>
			</template>
		</BaseUiBottomSheet>
	</div>
</template>


