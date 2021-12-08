<script lang="ts">
import Vue from 'vue'
import { IAsset } from '~/@types/asset'
import { useAppStore } from '~/stores/app'
import { useAssetStore } from '~/stores/asset'
export default Vue.extend({
	middleware: 'require-login',
	metaInfo: {
		title: 'Edit Asset'
	},
	async asyncData({ error, route, $strapi }) {
		useAppStore().toggleModal()
		await useAssetStore().fetchAssetMetaData()
		let asset = null as IAsset | null
		await useAssetStore()
			.fetchAssetDetail(route.params.id, $strapi.user.id, false)
			.then((data) => {
				if (data) {
					asset = data.asset
				}
			})
		if (!asset) {
			error({ statusCode: 404, message: 'Asset not found' })
		} else if (asset.author.id !== $strapi.user.id) {
			error({
				statusCode: 403,
				message: 'You are not authorized to edit this asset'
			})
		}
		return { asset }
	},
	data() {
		return {
			asset: null as unknown as IAsset,
			isLoading: false
		}
	},
	beforeDestroy() {
		useAppStore().toggleModal(false)
	}
})
</script>
<template>
	<main class="border-t relative">
		<div class="container mx-auto px-5 relative">
			<div class="back xl:absolute mt-8 left-6 block md:hidden">
				<a href="" class="text-gray-500 inline-flex items-center"
					><img
						src="~/assets/images/icons/arrow-left.svg"
						class="inline-block mr-2"
						alt=""
					/>
					Back</a
				>
			</div>
			<div class="content py-6">
				<!-- Modal HTML for desktop -->
				<div
					class="fixed z-10 inset-0 overflow-y-auto hidden md:block"
					aria-labelledby="modal-title"
					role="dialog"
					aria-modal="true"
				>
					<div
						class="
							flex
							items-end
							justify-center
							min-h-screen
							pt-4
							px-4
							pb-20
							text-center
							sm:block sm:p-0
						"
					>
						<!--
              Background overlay, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0"
                To: "opacity-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100"
                To: "opacity-0"
            -->
						<div
							class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
							aria-hidden="true"
						></div>

						<!-- This element is to trick the browser into centering the modal contents. -->
						<span
							class="hidden md:block absolute sm:align-middle sm:h-screen"
							aria-hidden="true"
							>&#8203;</span
						>

						<!--
              Modal panel, show/hide based on modal state.

              Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
              Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
						<div id="modal-edit-post" class="modal modal-edit-post">
							<a
								class="close-modal"
								:style="{
									background: `url(${$img('/icons/close.svg')})`
								}"
								@click="$router.go(-1)"
							/>
							<AssetForm :asset="asset" />
						</div>
					</div>
				</div>
				<AssetForm :asset="asset" class="mx-auto block md:hidden" />
			</div>
		</div>
	</main>
</template>

<style lang="postcss" scoped>
.modal-edit-post {
	@apply align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle;
	@apply py-14 mx-auto px-24 lg:px-28 w-auto max-w-3xl;

	.close-modal {
		@apply absolute top-7 right-7 w-6 h-6 cursor-pointer block;
	}
}
</style>
