<template>
	<div class="flex flex-col justify-center items-center min-h-screen w-full mb-16">
		<CoreImage src="~/assets/images/404-error.png" />
		<h2 class="text-2xl font-medium">
			Sorry, we have nothing to show you here! :(
		</h2>
		<NuxtLink to="/" class="btn-primary mt-8">Go Home instead</NuxtLink>
	</div>
</template>

<script>
export default {
	layout: 'error'
}
</script>
