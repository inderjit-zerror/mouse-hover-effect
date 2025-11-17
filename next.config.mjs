/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  turbopack: {},
  
  webpack: (config, { isServer, dev }) => {
    // Add GLSL loaders
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: [
        // raw-loader returns the file as a string
        { loader: 'raw-loader' },
        // optional: allow glslify transforms (if you installed glslify-loader)
        // { loader: 'glslify-loader' },
      ],
    });

    return config;
  },
  reactCompiler: true,
};

export default nextConfig;
