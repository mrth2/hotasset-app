import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({
    name: 'user',
    stateFactory: true,
    namespaced: true
})
export default class UserModule extends VuexModule {
    isLoggedIn = false

    get isAuthenticated(): boolean {
        return this.isLoggedIn === true
    }

    @Mutation
    setLoggedIn(isLoggedIn: boolean) {
        this.isLoggedIn = isLoggedIn
    }

    @Action
    async logout() {
        await this.setLoggedIn(false)
    }
}