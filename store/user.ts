import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { IUser } from '~/@types/index'

@Module({
    name: 'user',
    stateFactory: true,
    namespaced: true
})
export default class UserModule extends VuexModule {
    user: IUser | null = null
    isLoggedIn = false

    get isAuthenticated(): boolean {
        return this.isLoggedIn === true
    }

    @Mutation
    initUserStore() {
        if (process.client) {
            const user = localStorage.getItem('user')
            if (user) {
                this.user = JSON.parse(user)
            }
        }
    }

    @Mutation
    setLoggedIn(isLoggedIn: boolean) {
        this.isLoggedIn = isLoggedIn
    }

    @Mutation
    setUser(user: IUser) {
        this.user = user
        if (process.client) {
            localStorage.setItem('user', JSON.stringify(user))
        }
    }

    @Mutation
    clearUser() {
        this.user = null
    }

    @Action
    async logout() {
        await this.setLoggedIn(false)
        await this.clearUser()
    }
}