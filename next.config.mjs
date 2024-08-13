/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.pexels.com',
          },
          
        ],
        domains: ['www.cafelaesmeralda.com.ar'],
      },
};

export default nextConfig;
