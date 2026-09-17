/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repoName = '';
if (isGithubActions) {
  // Extract repository name from GITHUB_REPOSITORY (e.g. owner/website-inventory -> /website-inventory)
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (repo) {
    repoName = `/${repo}`;
  } else {
    repoName = '/website-inventory';
  }
}

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: repoName,
  assetPrefix: repoName ? `${repoName}/` : undefined,
};

module.exports = nextConfig;
