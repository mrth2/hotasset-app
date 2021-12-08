<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	middleware: 'require-login'
})
</script>

<template>
	<main class="border-t relative">
		<div class="container mx-auto px-5 relative">
			<div class="back xl:absolute mt-8 left-6">
				<a class="text-gray-500 inline-flex items-center cursor-pointer" @click="$router.go(-1)">
					<CoreImage
						src="~/assets/images/icons/arrow-left.svg"
						class="inline-block mr-2"
						alt
					/>
					Back
				</a>
			</div>
			<div class="content py-10">
				<AssetForm />
			</div>
		</div>
	</main>
</template>
