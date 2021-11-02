<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'DefaultLayout',
    asyncData() {
        
    },
    data() {
        return {

        }
    }
})
</script>
<template>
    <div>
        <Header />
        <Nuxt />
    </div>
</template>
<style scoped lang="postcss">
:global(body) {
    @apply min-h-screen;
}
</style>