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
		},
		zIndex: {
			type: Number,
			default: 20
		},
		hideOnClickOut: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isShow: false,
			showing: false
		}
	},
	computed: {
		isOpen(): boolean {
			return this.isShow || this.manualShow
		}
	},
	watch: {
		isOpen(value) {
			if (value) {
				this.showing = true
				setTimeout(() => {
					this.showing = false
				}, 300)
			}
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
		},
		clickOutside() {
			if (this.hideOnClickOut && !this.showing) {
				this.$emit('hide')
				this.hide()
			}
		}
	}
})
</script>

<template>
	<div v-click-outside="clickOutside" class="select-none">
		<slot name="trigger" :toggle="toggle" />
		<transition name="slide">
			<div
				v-if="isOpen"
				class="slide-content relative"
				:class="{ '!absolute': isAbsolute }"
				:style="`z-index: ${zIndex}`"
			>
				<slot name="content" :hide="hide" :show="show" :toggle="toggle" />
			</div>
		</transition>
	</div>
</template>

<style scoped lang="postcss">
.slide-content {
	::v-deep .btn-dropdown-options {
		@apply static;
	}
}
.slide-enter-active,
.slide-leave-active {
	@apply transition-all duration-300 ease-linear;
	opacity: 0.5;
	height: 50%;
}

.slide-enter-to,
.slide-leave {
	transform: translateY(0%);
	opacity: 1;
	height: 100%;
}

.slide-enter,
.slide-leave-to {
	transform: translateY(-40%);
	opacity: 0;
	height: 0%;
}
</style>
