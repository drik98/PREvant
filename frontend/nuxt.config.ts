// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  css: [
    'primeflex/primeflex.css',
    'primevue/resources/primevue.css',
    'primevue/resources/themes/lara-dark-green/theme.css',
    'primeicons/primeicons.css',
  ],
  modules: [
    'nuxt-primevue',
    '@pinia/nuxt',
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  primevue: {
    components: {
      prefix: 'Prime',
    },
  },
  app: {
    head: {
      title: 'PREvant',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      noscript: [{ children: 'Javascript is required' }],
    },
  },
  runtimeConfig: {
    public: {
      dockerImageByServiceName: 'kafka:docker.io/confluentinc/cp-kafka,prevant:docker.io/aixigo/prevant',
      envConfigPrefix: 'NUXT_',
      enableConfigToEnv: 'false',
    },
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/api',
        changeOrigin: true,
      },
    },
  },
})
