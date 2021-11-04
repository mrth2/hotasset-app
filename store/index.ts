import { Store } from 'vuex'
import { Context } from '@nuxt/types'
import { initialiseStores } from '~/utils/store-accessor'
export * from '~/utils/store-accessor'

export const actions = {
    async nuxtServerInit(_store: Store<any>, _context: Context) {
        
    }
}

const initializer = (store: Store<any>) => initialiseStores(store)
export const plugins = [initializer]