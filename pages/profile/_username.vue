<script lang="ts">
import Vue from 'vue'
export default Vue.extend({

})
</script>
<template>
    <div class="h-96 flex justify-center">
        <h1 class="m-auto text-2xl uppercase">Welcome to {{ $route.params.username }} personal page.</h1>
    </div>
</template>