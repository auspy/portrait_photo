/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_SECRET_KEY: process.env.API_SECRET_KEY,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
  async headers() {
    return [
      // {
      //   source: "/api/:path*",
      //   headers: [
      //     {
      //       key: "Access-Control-Allow-Origin",
      //       value: "*",
      //     },
      //     {
      //       key: "Access-Control-Allow-Methods",
      //       value: "POST,GET",
      //     },
      //     {
      //       key: "Access-Control-Allow-Headers",
      //       value: "Content-Type, Authorization, x-vizolv",
      //     },
      //     {
      //       key: "Access-Control-Allow-Credentials",
      //       value: "true",
      //     },
      //   ],
      // },
    ];
  },
};

export default nextConfig;
