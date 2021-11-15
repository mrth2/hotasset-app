import { Plugin } from "@nuxt/types"
const authenticated: Plugin = ({ $strapi, redirect }) => {
    if ($strapi.user) {
        redirect('/')
    }
}
export default authenticated