# Auto update DNS record with dynamic IP

Auto update DNS record with dynamic IP with CloudFlare API

## Usage with docker

Deploy the container with the following configuration

```yaml
services:
  agent:
    image: arkdevuk/cloudflare-dynamic-dns:latest
    restart: always
    environment:
      - CLOUDFLARE_API_KEY=your_api_key
      - ZONE_ID=your_zone_id
      - DOMAIN=test.domain.com
```
