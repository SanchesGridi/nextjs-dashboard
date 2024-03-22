/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        useDeploymentId: true,
        useDeploymentIdServerActions: true,
    }
};

module.exports = nextConfig;
