<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            provider: this.$route.params.provider,
            id_token: this.$route.query.id_token,
            access_token: this.$route.query.access_token
        }
    },
    async mounted() {
        await this.$strapi.$http
            .get(`/auth/${this.provider}/callback?access_token=${this.access_token}`)
            .then(res => res.json())
            .then(res => {
                const { jwt, user } = res
                // store jwt and user object in localStorage
                this.$auth.$storage.setUniversal('jwt', jwt)
                this.$auth.$storage.setUniversal('user', {
                    username: user.username,
                    id: user.id,
                    email: user.email
                })

                this.$router.push(`/profile/${user.username}`)
            })
    },
})
</script>
<template>
    <div class="h-full absolute inset-0 flex">
        <h1 class="m-auto text-2xl uppercase animate-pulse">Login you in...</h1>
    </div>
</template>