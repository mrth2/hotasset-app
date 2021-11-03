<template>
  <div class="absolute flex inset-0 top-32">
    <div class="m-auto">
      <h1 class="text-3xl">Welcome to HotAsset</h1>
      <ul v-if="$auth.$state.user" class="mt-4 flex flex-col gap-4 text-center text-lg"> 
        <li>You are logged in with:</li>
        <li>Email: {{$auth.$state.user.email}}</li>
        <li>Username: {{$auth.$state.user.username}}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
