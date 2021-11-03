import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { ICategory } from '~/@types/index'

@Module({
    name: 'header',
    stateFactory: true,
    namespaced: true
})
export default class HeaderModule extends VuexModule {
    categories: ICategory[] = []

    @Mutation
    setCategories(categories: ICategory[]) {
        this.categories = categories
    }
}