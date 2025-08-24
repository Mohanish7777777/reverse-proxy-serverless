# ReverseProxy-Serverless

<p align="center">
  <img src="https://cf-assets.www.cloudflare.com/slt3lc6tev37/3msJRtqxDysQslvrKvEf8x/f7f54c9a2cad3e4586f58e8e0e305389/reverse_proxy_flow.png" alt="ReverseProxy-Serverless">
</p>

<p align="center">
  A serverless reverse proxy for routing and managing HTTP requests in cloud environments.
</p>

## GitHub Repository Structure
```bash
proxy-worker/
├── src/
│   ├── config.ts
│   ├── transform.ts
│   ├── index.ts
│   └── types.ts
├── package.json
├── wrangler.toml
├── tsconfig.json
└── README.md
```

## Documentation (README.md)

# Cloudflare Worker Proxy

A configurable reverse proxy worker that handles HTML transformation, ad-blocking, and host rewriting.

## Features

- **HTML Rewriting**: Rewrites URLs in HTML documents to point through the proxy
- **Ad Blocking**: Removes external scripts from non-CDN domains
- **Text Replacement**: Replaces hostnames in text content
- **On-Demand Host Configuration**: Dynamic upstream host configuration via query parameter
- **CORS Headers**: Automatic CORS headers configuration

## Configuration

### Environment Variables
Set these in your `wrangler.toml`:

```
[vars]
BASE = "https://example.com"  # Default upstream host
FEATURE_FLAGS = "AD_BLOCKER,TEXT_REPLACER,ON_DEMAND_HOST_CONFIG"
```

### Query Parameters
- `host`: Specify an alternate upstream host (requires ON_DEMAND_HOST_CONFIG feature flag)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd proxy-worker
```

2. Install dependencies:
```bash
npm install
```

3. Configure your `wrangler.toml`:
```toml
name = "proxy-worker"
compatibility_date = "2023-05-18"

[vars]
BASE = "https://example.com"
FEATURE_FLAGS = "AD_BLOCKER,TEXT_REPLACER"
```

4. Deploy to Cloudflare:
```bash
npm run deploy
```

## Usage

Access your worker URL:
```
https://your-worker.your-subdomain.workers.dev/
```

To use with a different host:
```
https://your-worker.your-subdomain.workers.dev/?host=https://different-site.com
```

## Feature Flags

Enable features by adding them to the FEATURE_FLAGS environment variable:

- `AD_BLOCKER`: Blocks external scripts from non-CDN domains
- `TEXT_REPLACER`: Replaces hostnames in text content
- `ON_DEMAND_HOST_CONFIG`: Allows dynamic host configuration via query parameter

## Supported CDNs

The ad blocker allows scripts from these CDNs:
- jsdelivr.net
- googleapis.com
- gstatic.com
- bootstrapcdn.com
- fontawesome.com
- cloudflare.com
- unpkg.com
- jquery.com
- gravatar.com


## Additional Files

### package.json
```json
{
  "name": "proxy-worker",
  "version": "1.0.0",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.0.0",
    "wrangler": "^3.0.0"
  }
}
```

### wrangler.toml
```toml
name = "proxy-worker"
compatibility_date = "2023-11-20"

[vars]
BASE = "https://example.com"
FEATURE_FLAGS = "AD_BLOCKER,TEXT_REPLACER"
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "types": ["@cloudflare/workers-types"],
    "moduleResolution": "node",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

To create the repository:
1. Create a new GitHub repository
2. Clone it locally
3. Add these files
4. Commit and push:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Contact 📧 mail@mohanish.in