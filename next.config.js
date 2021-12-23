/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: false,
  productionBrowserSourceMaps: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['media.giphy.com'],
  },
};
