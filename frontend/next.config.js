/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  /**
   * Windows: Watchpack’s native recursive watcher can hit EINVAL on lstat for drive-root
   * system files (pagefile.sys, hiberfil.sys, swapfile.sys, DumpStack.log.tmp). Polling in
   * dev avoids that scan path. Set NEXT_WEBPACK_NATIVE_WATCH=1 to try native watch again.
   */
  webpack: (config, { dev }) => {
    if (dev && process.platform === 'win32' && process.env.NEXT_WEBPACK_NATIVE_WATCH !== '1') {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 800,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.git/**'],
        followSymlinks: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;