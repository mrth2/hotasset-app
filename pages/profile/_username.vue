<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

})
</script>
<template>
    <div class="absolute inset-0 top-32 flex">
        <h1 class="m-auto text-2xl uppercase">Welcome to {{ $route.params.username }} personal page.</h1>
    </div>
</template>