/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import user from '~/store/user'
import header from '~/store/header'

let userStore: user
let headerStore: header

function initialiseStores(store: Store<any>): void {
    userStore = getModule(user, store)
    headerStore = getModule(header, store)
}

export { initialiseStores, userStore, headerStore }