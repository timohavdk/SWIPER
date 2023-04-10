<script lang="ts" src="./base-ui-bottom-sheet.ts"></script>
<style src="./base-ui-bottom-sheet.scss"></style>

<template>
	<div
		class="base-ui-bottom-sheet"
		:style="{height: `${maxSize}px`}"
	>
		<div
			v-if="backdropEnabled"
			:class="[
				'base-ui-bottom-sheet__overlay',
				{'base-ui-bottom-sheet__overlay_visible': isOpacityVisible}
			]"
			@click="overlayCloseHandler"
		></div>
		<div
			@touchstart="touchStartHandler"
			@touchend="touchEndHandler"
			@touchmove="touchMoveHandler"
			:style="{height: `${maxSize + hookHeight}px`}"
			:class="[
				'base-ui-bottom-sheet__road',
				{'base-ui-bottom-sheet__road_touch-block': isTouchAction},
			]">
			<div
				ref="modal"
				:style="{
					transform:  `translateY(${translate}px)`,
					paddingTop: `${hookHeight}px`,
				}"
				:class="[
					'base-ui-bottom-sheet__modal',
					{'base-ui-bottom-sheet__modal_hook': isHookShown},
					{'base-ui-bottom-sheet__modal_touch-block': isTouchAction},
				]"
			>
				<div
					:class="[
						'base-ui-bottom-sheet__container',
						{'base-ui-bottom-sheet__container_no-scroll': translate !== hookHeight}
					]"
					ref="baseUiBottomSheetContainer"
					@scroll="scrollHandler"
				>
					<div class="base-ui-bottom-sheet__header">
						<slot name="header"/>
					</div>
					<div class="base-ui-bottom-sheet__content">
						<slot name="content"/>
					</div>
					<div
						class="base-ui-bottom-sheet__footer"
						:style="{paddingBottom: `${hookHeight}px`}"
					>
						<slot name="footer"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
