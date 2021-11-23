<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'GlobalBanner'
})
</script>

<template>
  <section class="banner">
    <div class="container mx-auto">
      <div class="banner-inner">
        <div class="banner-content px-4 sm:px-6">
          <h1 class="banner__title">Every Play in the Marketing & Sales Playbook</h1>
          <p class="banner__desc">
            Dribbble is the leading destination to find &amp; showcase creative work and
            home to the world's
            best
            design professionals.
          </p>
          <NuxtLink v-if="$strapi.user" class="banner__btn btn-primary" to="/upload">Upload now</NuxtLink>
          <NuxtLink v-else class="banner__btn btn-primary" to="/signup">Sign up</NuxtLink>
        </div>
        <div class="banner-image">
          <NuxtPicture
            :src="`/homepage/${!$strapi.user ? 'hero-' : ''}illustration.png`"
            alt
            class="mx-auto"
          />
        </div>
      </div>
    </div>
  </section>
</template>