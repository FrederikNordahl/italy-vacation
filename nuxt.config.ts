// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt'
  ],

  alias: {
    '#shared': fileURLToPath(new URL('./shared', import.meta.url))
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  compatibilityDate: '2025-01-15',

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || '',
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN || ''
  },

  nitro: {
    preset: 'vercel'
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
