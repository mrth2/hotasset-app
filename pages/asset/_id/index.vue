<script lang="ts">
import gql from 'graphql-tag'
import Vue from 'vue'
import SwiperClass from 'swiper'
import type { SwiperOptions } from 'swiper'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { IAsset } from '~/@types/asset'
import 'swiper/css/swiper.css'

export default Vue.extend({
	name: 'AssetDetail',
	components: {
		Swiper,
		SwiperSlide
	},
	data() {
		return {
			assets: {} as IAsset,
			swiper: {
				thumbnail: {
					spaceBetween: 10,
					slidesPerView: 8,
					freeMode: true,
					watchSlidesProgress: true,
					direction: 'vertical'
				},
				main: {} as SwiperOptions
			}
		}
	},
	async fetch() {
		await this.$apollo
			.query({
				query: gql`
					query AssetDetail($id: ID!) {
						asset(id: $id) {
							id
							title
							description
							createdAt
							updatedAt
							tags {
								id
								name
							}
							resources {
								id
								name
								mime
								width
								height
								url
								size
								ext
							}
							likes
							author {
								username
								first_name
								last_name
								avatar {
									url
								}
							}
						}
					}
				`,
				variables: {
					id: this.assetId
				}
			})
			.then(({ data }) => {
				this.assets = data.asset
			})
			.catch((err) => {
				throw err
			})
	},
	computed: {
		assetId() {
			return this.$route.params.id
		},
		thumbSwiper(): SwiperClass {
			return (this.$refs.thumbnailSwiper as any).$swiper
		},
		mainSwiper(): SwiperClass {
			return (this.$refs.mainSwiper as any)?.$swiper
		}
	},
	mounted() {
		this.swiper.main = {
			spaceBetween: 10,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			thumbs: {
				swiper: this.thumbSwiper
			}
		}
	}
})
</script>

<template>
	<main class="border-t relative">
		<div class="container mx-auto px-4 sm:px-6 relative">
			<div class="back xl:absolute mt-8 left-6">
				<a href="" class="text-gray-500 inline-flex items-center"
					><img
						src="~/assets/images/icons/arrow-left.svg"
						class="inline-block mr-2"
						alt=""
					/>
					back</a
				>
			</div>
			<div class="indivisual-card">
				<div class="flex justify-between items-center py-7">
					<div class="flex space-x-3">
						<img
							srcset="~/assets/images/avatar.png 2x"
							alt=""
							class="rounded-full"
							width="44"
							height="44"
						/>
						<div>
							<span class="block">masump</span>
							<a href="#" class="text-brand">Follow</a>
						</div>
					</div>
					<div>
						<button class="btn__like">
							<svg
								width="16"
								height="16"
								xmlns="http://www.w3.org/2000/svg"
								enable-background="new 0 0 24 24"
								viewBox="0 0 24 24"
								role="img"
								class="icon fill-current shot-tools-icon mr-2"
							>
								<path
									d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
								></path>
							</svg>
							Like
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="container mx-auto sm:px-6 relative">
			<div class="indivisual-card">
				<div class="indivisual-card-container">
					<div class="indivisual-card-img relative">
						<Swiper v-if="Object.keys(swiper.main).length" ref="mainSwiper" class="card-img-large" :options="swiper.main">
							<SwiperSlide>
								<img
									src="https://swiperjs.com/demos/images/nature-1.jpg"
									class="sm:rounded-lg"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://swiperjs.com/demos/images/nature-2.jpg"
									class="sm:rounded-lg"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://swiperjs.com/demos/images/nature-3.jpg"
									class="sm:rounded-lg"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://swiperjs.com/demos/images/nature-4.jpg"
									class="sm:rounded-lg"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://swiperjs.com/demos/images/nature-5.jpg"
									class="sm:rounded-lg"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://swiperjs.com/demos/images/nature-6.jpg"
									class="sm:rounded-lg"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://swiperjs.com/demos/images/nature-7.jpg"
									class="sm:rounded-lg"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://swiperjs.com/demos/images/nature-8.jpg"
									class="sm:rounded-lg"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://swiperjs.com/demos/images/nature-9.jpg"
									class="sm:rounded-lg"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://swiperjs.com/demos/images/nature-10.jpg"
									class="sm:rounded-lg"
								/>
							</SwiperSlide>
						</Swiper>
						<div class="card-img-gallery z-10">
							<Swiper
								ref="thumbnailSwiper"
								class="thumbnail-gallery"
								:options="swiper.thumbnail"
							>
								<SwiperSlide class="rounded-lg">
									<img
										src="https://swiperjs.com/demos/images/nature-1.jpg"
										class="rounded-md"
									/>
								</SwiperSlide>
								<SwiperSlide class="rounded-lg">
									<img
										src="https://swiperjs.com/demos/images/nature-2.jpg"
										class="rounded-md"
									/>
								</SwiperSlide>
								<SwiperSlide class="rounded-lg">
									<img
										src="https://swiperjs.com/demos/images/nature-3.jpg"
										class="rounded-md"
									/>
								</SwiperSlide>
								<SwiperSlide class="rounded-lg">
									<img
										src="https://swiperjs.com/demos/images/nature-4.jpg"
										class="rounded-md"
									/>
								</SwiperSlide>
								<SwiperSlide class="rounded-lg">
									<img
										src="https://swiperjs.com/demos/images/nature-5.jpg"
										class="rounded-md"
									/>
								</SwiperSlide>
								<SwiperSlide class="rounded-lg">
									<img
										src="https://swiperjs.com/demos/images/nature-6.jpg"
										class="rounded-md"
									/>
								</SwiperSlide>
								<SwiperSlide class="rounded-lg">
									<img
										src="https://swiperjs.com/demos/images/nature-7.jpg"
										class="rounded-md"
									/>
								</SwiperSlide>
								<SwiperSlide class="rounded-lg">
									<img
										src="https://swiperjs.com/demos/images/nature-8.jpg"
										class="rounded-md"
									/>
								</SwiperSlide>
								<SwiperSlide class="rounded-lg">
									<img
										src="https://swiperjs.com/demos/images/nature-9.jpg"
										class="rounded-md"
									/>
								</SwiperSlide>
								<SwiperSlide class="rounded-lg">
									<img
										src="https://swiperjs.com/demos/images/nature-10.jpg"
										class="rounded-md"
									/>
								</SwiperSlide>
							</Swiper>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container mx-auto px-4 sm:px-6 relative">
			<div class="indivisual-card">
				<div class="indivisual-card-container">
					<div class="indivisual-tag">
						<a href="#" class="indivisual-tag__item active"
							>Digital Marketing</a
						>
						<a href="#" class="indivisual-tag__item">Wireframes</a>
						<a href="#" class="indivisual-tag__item">Prototype</a>
						<a href="#" class="indivisual-tag__item">Mockup</a>
						<a href="#" class="indivisual-tag__item">Sketches</a>
						<a href="#" class="indivisual-tag__item">User Flows</a>
						<a href="#" class="indivisual-tag__item">Components Design</a>
						<a href="#" class="indivisual-tag__item">Icons</a>
					</div>
					<h1 class="indivisual__name">Online Music Streaming App</h1>
					<p class="indivisual__desc">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gravida
						vestibulum sed vel sed. Euismod enim felis non ultricies at lorem.
						Quam ac placerat commodo non ac pulvinar elementum fringilla. Sem id
						tortor, urna nulla enim id elit praesent. Netus volutpat adipiscing
						quam adipiscing tincidunt eget fermentum non.
					</p>
					<p class="indivisual__desc mt-10">
						Something something
						<a href="#" class="text-brand">www.weburl.com</a>
					</p>
				</div>
			</div>
		</div>
		<div class="container mx-auto px-4 sm:px-6 relative">
			<section class="mb-8 mt-20">
				<div class="flex justify-between items-center mb-4">
					<h4 class="font-bold text-xl">More from masump</h4>
					<a href="#" class="text-brand">View Profile</a>
				</div>
				<div class="shots-grid">
					<div class="shots-grid-row grid md:grid-cols-2 xl:grid-cols-4 gap-8">
						<div class="shot-item">
							<div class="shot-thumbnail group">
								<figure>
									<img src="~/assets/images/upload/1.png" alt="" />
								</figure>
								<a class="shot-thumbnail__link" href="#"></a>
								<div class="shot-thumbnail-overlay">
									<div class="shot-thumbnail-overlay-content">
										<div class="shot-title">
											Asset Type Name Asset Type Name Asset Type Name
										</div>
										<div class="shot-action">
											<a class="like-shot" itle="Like this shot">
												<svg
													width="18"
													height="18"
													xmlns="http://www.w3.org/2000/svg"
													enable-background="new 0 0 24 24"
													viewBox="0 0 24 24"
													role="img"
													class="icon"
												>
													<path
														d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
													></path>
												</svg>
											</a>
										</div>
									</div>
								</div>
							</div>

							<div class="shot-details-container">
								<p class="shots-item__desc">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor di...
								</p>
								<div class="flex items-center justify-between">
									<div class="user-information">
										<a href="" class="user-infor__avatar">
											<img
												src="~/assets/images/upload/1.png"
												alt=""
												width="24"
												height="24"
											/>
										</a>
										<a href="" class="user-info__name"> masump </a>
									</div>
									<div class="shot-statistics">
										<a href="">
											<svg
												width="16"
												height="16"
												xmlns="http://www.w3.org/2000/svg"
												enable-background="new 0 0 24 24"
												viewBox="0 0 24 24"
												role="img"
												class="icon fill-current shot-tools-icon"
											>
												<path
													d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
												></path>
											</svg>
										</a>
										<span>223</span>
									</div>
								</div>
							</div>
						</div>
						<!--End .shot-item-->
						<div class="shot-item">
							<div class="shot-thumbnail group">
								<figure>
									<img src="~/assets/images/upload/1.png" alt="" />
								</figure>
								<a class="shot-thumbnail__link" href="#"></a>
								<div class="shot-thumbnail-overlay">
									<div class="shot-thumbnail-overlay-content">
										<div class="shot-title">
											Asset Type Name Asset Type Name Asset Type Name
										</div>
										<div class="shot-action">
											<a class="like-shot liked" itle="Like this shot">
												<svg
													width="18"
													height="18"
													xmlns="http://www.w3.org/2000/svg"
													enable-background="new 0 0 24 24"
													viewBox="0 0 24 24"
													role="img"
													class="icon"
												>
													<path
														d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
													></path>
												</svg>
											</a>
										</div>
									</div>
								</div>
							</div>

							<div class="shot-details-container">
								<p class="shots-item__desc">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor di...
								</p>
								<div class="flex items-center justify-between">
									<div class="user-information">
										<a href="" class="user-infor__avatar">
											<img
												src="~/assets/images/upload/1.png"
												alt=""
												width="24"
												height="24"
											/>
										</a>
										<a href="" class="user-info__name"> masump </a>
									</div>
									<div class="shot-statistics">
										<a href="">
											<svg
												width="16"
												height="16"
												xmlns="http://www.w3.org/2000/svg"
												enable-background="new 0 0 24 24"
												viewBox="0 0 24 24"
												role="img"
												class="icon fill-current shot-tools-icon"
											>
												<path
													d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
												></path>
											</svg>
										</a>
										<span>223</span>
									</div>
								</div>
							</div>
						</div>
						<!--End .shot-item-->
						<div class="shot-item">
							<div class="shot-thumbnail group">
								<figure>
									<img src="~/assets/images/upload/1.png" alt="" />
								</figure>
								<a class="shot-thumbnail__link" href="#"></a>
								<div class="shot-thumbnail-overlay">
									<div class="shot-thumbnail-overlay-content">
										<div class="shot-title">
											Asset Type Name Asset Type Name Asset Type Name
										</div>
										<div class="shot-action">
											<a class="like-shot" itle="Like this shot">
												<svg
													width="18"
													height="18"
													xmlns="http://www.w3.org/2000/svg"
													enable-background="new 0 0 24 24"
													viewBox="0 0 24 24"
													role="img"
													class="icon"
												>
													<path
														d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
													></path>
												</svg>
											</a>
										</div>
									</div>
								</div>
							</div>

							<div class="shot-details-container">
								<p class="shots-item__desc">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor di...
								</p>
								<div class="flex items-center justify-between">
									<div class="user-information">
										<a href="" class="user-infor__avatar">
											<img
												src="~/assets/images/upload/1.png"
												alt=""
												width="24"
												height="24"
											/>
										</a>
										<a href="" class="user-info__name"> masump </a>
									</div>
									<div class="shot-statistics">
										<a href="">
											<svg
												width="16"
												height="16"
												xmlns="http://www.w3.org/2000/svg"
												enable-background="new 0 0 24 24"
												viewBox="0 0 24 24"
												role="img"
												class="icon fill-current shot-tools-icon"
											>
												<path
													d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
												></path>
											</svg>
										</a>
										<span>223</span>
									</div>
								</div>
							</div>
						</div>
						<!--End .shot-item-->
						<div class="shot-item">
							<div class="shot-thumbnail group">
								<figure>
									<img src="~/assets/images/upload/1.png" alt="" />
								</figure>
								<a class="shot-thumbnail__link" href="#"></a>
								<div class="shot-thumbnail-overlay">
									<div class="shot-thumbnail-overlay-content">
										<div class="shot-title">
											Asset Type Name Asset Type Name Asset Type Name
										</div>
										<div class="shot-action">
											<a class="like-shot" itle="Like this shot">
												<svg
													width="18"
													height="18"
													xmlns="http://www.w3.org/2000/svg"
													enable-background="new 0 0 24 24"
													viewBox="0 0 24 24"
													role="img"
													class="icon"
												>
													<path
														d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
													></path>
												</svg>
											</a>
										</div>
									</div>
								</div>
							</div>

							<div class="shot-details-container">
								<p class="shots-item__desc">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor di...
								</p>
								<div class="flex items-center justify-between">
									<div class="user-information">
										<a href="" class="user-infor__avatar">
											<img
												src="~/assets/images/upload/1.png"
												alt=""
												width="24"
												height="24"
											/>
										</a>
										<a href="" class="user-info__name"> masump </a>
									</div>
									<div class="shot-statistics">
										<a href="">
											<svg
												width="16"
												height="16"
												xmlns="http://www.w3.org/2000/svg"
												enable-background="new 0 0 24 24"
												viewBox="0 0 24 24"
												role="img"
												class="icon fill-current shot-tools-icon"
											>
												<path
													d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
												></path>
											</svg>
										</a>
										<span>223</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section class="mb-4">
				<div class="flex justify-between mb-4">
					<h4 class="font-bold text-xl">Similar Assets</h4>
				</div>
				<div class="shots-grid">
					<div class="shots-grid-row grid md:grid-cols-2 xl:grid-cols-4 gap-8">
						<div class="shot-item">
							<div class="shot-thumbnail group">
								<figure>
									<img src="~/assets/images/upload/1.png" alt="" />
								</figure>
								<a class="shot-thumbnail__link" href="#"></a>
								<div class="shot-thumbnail-overlay">
									<div class="shot-thumbnail-overlay-content">
										<div class="shot-title">
											Asset Type Name Asset Type Name Asset Type Name
										</div>
										<div class="shot-action">
											<a class="like-shot" itle="Like this shot">
												<svg
													width="18"
													height="18"
													xmlns="http://www.w3.org/2000/svg"
													enable-background="new 0 0 24 24"
													viewBox="0 0 24 24"
													role="img"
													class="icon"
												>
													<path
														d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
													></path>
												</svg>
											</a>
										</div>
									</div>
								</div>
							</div>

							<div class="shot-details-container">
								<p class="shots-item__desc">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor di...
								</p>
								<div class="flex items-center justify-between">
									<div class="user-information">
										<a href="" class="user-infor__avatar">
											<img
												src="~/assets/images/upload/1.png"
												alt=""
												width="24"
												height="24"
											/>
										</a>
										<a href="" class="user-info__name"> masump </a>
									</div>
									<div class="shot-statistics">
										<a href="">
											<svg
												width="16"
												height="16"
												xmlns="http://www.w3.org/2000/svg"
												enable-background="new 0 0 24 24"
												viewBox="0 0 24 24"
												role="img"
												class="icon fill-current shot-tools-icon"
											>
												<path
													d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
												></path>
											</svg>
										</a>
										<span>223</span>
									</div>
								</div>
							</div>
						</div>
						<!--End .shot-item-->
						<div class="shot-item">
							<div class="shot-thumbnail group">
								<figure>
									<img src="~/assets/images/upload/1.png" alt="" />
								</figure>
								<a class="shot-thumbnail__link" href="#"></a>
								<div class="shot-thumbnail-overlay">
									<div class="shot-thumbnail-overlay-content">
										<div class="shot-title">
											Asset Type Name Asset Type Name Asset Type Name
										</div>
										<div class="shot-action">
											<a class="like-shot liked" itle="Like this shot">
												<svg
													width="18"
													height="18"
													xmlns="http://www.w3.org/2000/svg"
													enable-background="new 0 0 24 24"
													viewBox="0 0 24 24"
													role="img"
													class="icon"
												>
													<path
														d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
													></path>
												</svg>
											</a>
										</div>
									</div>
								</div>
							</div>

							<div class="shot-details-container">
								<p class="shots-item__desc">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor di...
								</p>
								<div class="flex items-center justify-between">
									<div class="user-information">
										<a href="" class="user-infor__avatar">
											<img
												src="~/assets/images/upload/1.png"
												alt=""
												width="24"
												height="24"
											/>
										</a>
										<a href="" class="user-info__name"> masump </a>
									</div>
									<div class="shot-statistics">
										<a href="">
											<svg
												width="16"
												height="16"
												xmlns="http://www.w3.org/2000/svg"
												enable-background="new 0 0 24 24"
												viewBox="0 0 24 24"
												role="img"
												class="icon fill-current shot-tools-icon"
											>
												<path
													d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
												></path>
											</svg>
										</a>
										<span>223</span>
									</div>
								</div>
							</div>
						</div>
						<!--End .shot-item-->
						<div class="shot-item">
							<div class="shot-thumbnail group">
								<figure>
									<img src="~/assets/images/upload/1.png" alt="" />
								</figure>
								<a class="shot-thumbnail__link" href="#"></a>
								<div class="shot-thumbnail-overlay">
									<div class="shot-thumbnail-overlay-content">
										<div class="shot-title">
											Asset Type Name Asset Type Name Asset Type Name
										</div>
										<div class="shot-action">
											<a class="like-shot" itle="Like this shot">
												<svg
													width="18"
													height="18"
													xmlns="http://www.w3.org/2000/svg"
													enable-background="new 0 0 24 24"
													viewBox="0 0 24 24"
													role="img"
													class="icon"
												>
													<path
														d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
													></path>
												</svg>
											</a>
										</div>
									</div>
								</div>
							</div>

							<div class="shot-details-container">
								<p class="shots-item__desc">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor di...
								</p>
								<div class="flex items-center justify-between">
									<div class="user-information">
										<a href="" class="user-infor__avatar">
											<img
												src="~/assets/images/upload/1.png"
												alt=""
												width="24"
												height="24"
											/>
										</a>
										<a href="" class="user-info__name"> masump </a>
									</div>
									<div class="shot-statistics">
										<a href="">
											<svg
												width="16"
												height="16"
												xmlns="http://www.w3.org/2000/svg"
												enable-background="new 0 0 24 24"
												viewBox="0 0 24 24"
												role="img"
												class="icon fill-current shot-tools-icon"
											>
												<path
													d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
												></path>
											</svg>
										</a>
										<span>223</span>
									</div>
								</div>
							</div>
						</div>
						<!--End .shot-item-->
						<div class="shot-item">
							<div class="shot-thumbnail group">
								<figure>
									<img src="~/assets/images/upload/1.png" alt="" />
								</figure>
								<a class="shot-thumbnail__link" href="#"></a>
								<div class="shot-thumbnail-overlay">
									<div class="shot-thumbnail-overlay-content">
										<div class="shot-title">
											Asset Type Name Asset Type Name Asset Type Name
										</div>
										<div class="shot-action">
											<a class="like-shot" itle="Like this shot">
												<svg
													width="18"
													height="18"
													xmlns="http://www.w3.org/2000/svg"
													enable-background="new 0 0 24 24"
													viewBox="0 0 24 24"
													role="img"
													class="icon"
												>
													<path
														d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
													></path>
												</svg>
											</a>
										</div>
									</div>
								</div>
							</div>

							<div class="shot-details-container">
								<p class="shots-item__desc">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
									do eiusmod tempor di...
								</p>
								<div class="flex items-center justify-between">
									<div class="user-information">
										<a href="" class="user-infor__avatar">
											<img
												src="~/assets/images/upload/1.png"
												alt=""
												width="24"
												height="24"
											/>
										</a>
										<a href="" class="user-info__name"> masump </a>
									</div>
									<div class="shot-statistics">
										<a href="">
											<svg
												width="16"
												height="16"
												xmlns="http://www.w3.org/2000/svg"
												enable-background="new 0 0 24 24"
												viewBox="0 0 24 24"
												role="img"
												class="icon fill-current shot-tools-icon"
											>
												<path
													d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
												></path>
											</svg>
										</a>
										<span>223</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</main>
</template>
