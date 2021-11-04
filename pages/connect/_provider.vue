<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            provider: this.$route.params.provider,
            access_token: this.$route.query.access_token
        }
    },
    async mounted() {
        if (!this.$strapi.user) {
            await this.$strapi.$http
                .get(`/auth/${this.provider}/callback?access_token=${this.access_token}`)
                .then(res => res.json())
                .then(res => {
                    const { jwt, user } = res
                    this.$strapi.setToken(jwt)
                    this.$strapi.setUser(user)

                    this.$nuxt.refresh()

                    this.$router.push(`/profile/${user.username}`)
                })
        }
        else {
            this.$router.push(`/profile/${this.$strapi.user.username}`)
        }
    },
})
</script>
<template>
    <div class="h-full absolute inset-0 flex">
        <h1 class="m-auto text-2xl uppercase animate-pulse">Login you in...</h1>
    </div>
</template>