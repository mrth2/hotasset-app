<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	name: 'AssetModalEdit'
})
</script>
<template>
	<div id="modal-edit-post" class="modal modal-edit-post">
		<form action="#" class="mx-auto">
			<div class="max-w-2xl mx-auto">
				<div class="mb-8">
					<h2
						class="
							text-2xl
							md:text-4xl
							font-extrabold
							leading-9
							text-gray-900 text-center
						"
					>
						Edit Your Post
					</h2>
					<p class="mt-4 leading-5 text-gray-500 text-center">
						You can make a changes to your existed post here
					</p>
				</div>

				<p
					class="
						text-xl
						md:text-2xl
						text-center
						block
						w-full
						outline-none
						mb-4
						font-medium
					"
				>
					Post about boxed water
				</p>
				<div class="upload-workspace">
					<img
						src="~/assets/images/upload/6.png"
						alt=""
						class="rounded-md h-full w-full object-cover"
					/>
				</div>
			</div>
			<div class="w-full sm:max-w-xl mx-auto self-center">
				<div class="upload-gallery">
					<div class="upload-gallery-item active">
						<img
							src="~/assets/images/upload/6.png"
							alt=""
							class="w-full h-full object-cover rounded-md"
						/>
						<span class="upload-gallery-delete">
							<img src="~/assets/images/icons/delete.svg" alt="" />
						</span>
					</div>
					<div class="upload-gallery-item">
						<img
							src="~/assets/images/upload/6.png"
							alt=""
							class="w-full h-full object-cover rounded-md"
						/>
					</div>
					<div class="upload-gallery-item">
						<img
							src="~/assets/images/upload/6.png"
							alt=""
							class="w-full h-full object-cover rounded-md"
						/>
					</div>
					<div
						class="
							upload-gallery-item
							flex
							items-center
							justify-center
							upload-gallery-item-plus
						"
					>
						<span><img src="~/assets/images/icons/plus.svg" alt="" /></span>
					</div>
				</div>
				<div class="mb-8">
					<label for="bio" class="form-label">Post Description</label>
					<textarea
						id="bio"
						name=""
						cols="30"
						rows="10"
						class="form-control"
						placeholder="Tell about yourself"
					></textarea>
				</div>
				<div class="mb-8">
					<label for="pronounce" class="form-label">Category</label>
					<select
						id="pronounce"
						name=""
						class="form-control"
						multiple="multiple"
					>
						<option value="">Option 1</option>
						<option value="">Option 2</option>
						<option value="">Option 3</option>
					</select>
				</div>
				<div class="mb-8">
					<label for="tags" class="form-label">Tags</label>
					<select id="tags" name="" class="form-control" multiple="multiple">
						<option value="">Lorem</option>
						<option value="">Ippsum</option>
					</select>
				</div>

				<div class="mb-8 flex justify-between">
					<button
						type="button"
						class="btn-primary w-full md:w-auto rounded-md shadow-sm"
					>
						Upload a Post
					</button>
					<button
						type="button"
						class="btn-secondary w-full md:w-auto rounded-md shadow-sm"
					>
						Delete Post
					</button>
				</div>
			</div>
		</form>
	</div>
</template>
