/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
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
          },
          {
            protocol: "https",
            hostname:"storage.googleapis.com"
          },
          {
            protocol: "https",
            hostname:"img.freepik.com"
          },

        ],
        domains: ['www.cafelaesmeralda.com.ar','localhost','18.231.148.97', 'esmeralda-frontend-git-brunodev-patricio-calatayuds-projects.vercel.app', "esmeralda-frontend-jet.vercel.app/"],
      },
};

export default nextConfig;
