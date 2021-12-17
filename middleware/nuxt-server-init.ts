import { Plugin } from "@nuxt/types"
import { useHeaderStore } from "~/stores/header"

const nuxtServerInit: Plugin = async ({ $pinia }) => {
  await useHeaderStore($pinia).fetchRequiredData()
}
export default nuxtServerInit