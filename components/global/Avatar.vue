<script lang="ts">
import Vue from 'vue'
import { IUser } from '~/@types/user'
export default Vue.extend({
	props: {
		size: {
			type: Number,
			default: 36
		},
    src: {
      type: String,
      default: null
    }
	},
	computed: {
		user(): IUser {
			return this.$strapi.user as IUser
		},
    avatar(): string | null {
      return this.src || (this.user.avatar ? this.user.avatar.url : null)
    }
	}
})
</script>
<template>
	<CoreImage
		v-if="avatar"
		:component="'NuxtImg'"
		class="rounded-full"
		:src="avatar"
		:modifiers="{ roundCorner: 'max', gravity: 'face' }"
		fit="fill"
		alt
		:width="size"
		:height="size"
	/>
	<div v-else :style="`font-size: ${size}px; line-height: ${size}px;`">
		<FontAwesomeIcon :icon="['far', 'user-circle']" />
	</div>
</template>
