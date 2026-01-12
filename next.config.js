/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      return [];
    }
    return [
      {
        source: "/api/action.php/:path*",
        destination: `${apiBaseUrl.replace(/\/+$/, "")}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
