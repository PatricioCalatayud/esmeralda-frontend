/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.pexels.com',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
          },
          
          {
            protocol: 'https',
            hostname: 'platform-lookaside.fbsbx.com',
          },
          {
            protocol: 'https',
            hostname: 'imgur.com',
          },
          {
            protocol: 'https',
            hostname: 'api.dicebear.com',
          },
          {
            protocol: 'https',
            hostname: 'example.com',
          }
        ],
        domains: ['www.cafelaesmeralda.com.ar'],
      },
};

export default nextConfig;
