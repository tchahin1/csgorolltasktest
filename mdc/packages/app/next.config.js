const { withNx } = require('@nrwl/next/plugins/with-nx');
const path = require('path');
/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    outputFileTracingRoot: path.join(__dirname, '../../'),
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  env: {
    AWS_AI_ACCESS_KEY_ID: process.env.AWS_AI_ACCESS_KEY_ID,
    AWS_AI_SECRET_ACCESS_KEY: process.env.AWS_AI_SECRET_ACCESS_KEY,
    AWS_AI_REGION: process.env.AWS_AI_REGION,
    AWS_AI_S3_BUCKET_NAME: process.env.AWS_AI_S3_BUCKET_NAME,
  },
};

module.exports = withNx(nextConfig);
