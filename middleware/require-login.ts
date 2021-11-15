import { Plugin } from "@nuxt/types"
const requireLogin: Plugin = ({ $strapi, redirect }) => {
  if (!$strapi.user) {
    redirect('/login')
  }
}
export default requireLogin