<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		manualShow: {
			type: Boolean,
			default: false
		},
		isAbsolute: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isShow: false
		}
	},
	methods: {
		hide() {
			this.isShow = false
		},
		show() {
			this.isShow = true
		},
		toggle() {
			this.isShow = !this.isShow
		}
	}
})
</script>

<template>
	<div class="select-none">
		<slot name="trigger" :toggle="toggle" />
		<transition name="slide">
			<div
				v-if="isShow || manualShow"
				class="slide-content"
				:class="{ absolute: isAbsolute }"
			>
				<slot name="content" :hide="hide" :show="show" :toggle="toggle" />
			</div>
		</transition>
	</div>
</template>

<style scoped lang="postcss">
.slide-content {
	@apply z-50 translate-y-0;

	::v-deep .btn-dropdown-options {
		@apply static;
	}
}
.slide-enter-active,
.slide-leave-active {
	@apply transition-all duration-300 ease-linear;
	transform: translateY(-40%);
  opacity: .5;
  height: 50%;
}

.slide-enter-to,
.slide-leave {
	transform: translateY(-0%);
	opacity: 1;
  height: 100%;
}

.slide-enter .slide-leave-to {
	transform: translateY(-40%);
	opacity: 0.3;
  height: 30%;
}
</style>
