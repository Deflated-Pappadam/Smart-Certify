/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["firebasestorage.googleapis.com"],
        formats: ["image/webp"]
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Exclude the problematic file from being processed by webpack
        config.module.rules.push({
          test: /canvas\.node$/,
          use: 'ignore-loader',
        });
    
        return config;
      },
}

module.exports = nextConfig
