import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { IUser } from '~/types'
import { IAssetProvider, IAssetTypeValue } from '~/types/asset'

interface HAHelper {
  $displayName(user: IUser): string
  $getAssetUrl(assetUrl: string, type: string | undefined): { provider: IAssetProvider, url: string, format: string }
}
declare module 'vue/types/vue' {
  interface Vue extends HAHelper { }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions extends HAHelper { }
  interface Context extends HAHelper { }
}

export default function (_context: Context, inject: Inject) {
  inject('displayName', (user: IUser) => {
    if (user) {
      if (user.first_name && user.last_name) {
        return user.first_name + ' ' + user.last_name
      }
      else if (user.last_name) {
        return user.last_name
      }
      else if (user.first_name) {
        return user.first_name
      }
    }
    return user.username
  })

  inject('getAssetUrl', (assetUrl: string, type: string | undefined) => {
    if (!type) type = IAssetTypeValue.IMAGE
    let provider = IAssetProvider.LOCAL
    let format = 'jpg'
    let url = ''
    if (type === IAssetTypeValue.IMAGE) {
      provider = IAssetProvider.CLOUDINARY
      url = assetUrl
    }
    else if (type === IAssetTypeValue.PDF) {
      url = '/icons/pdf.svg'
      format = 'svg'
    }
    else if (type === IAssetTypeValue.CSV) {
      url = '/icons/csv.svg'
      format = 'svg'
    }
    else if (type === IAssetTypeValue.PPT) {
      url = '/icons/ppt.svg'
      format = 'svg'
    }
    return { provider, url, format }
  })
}