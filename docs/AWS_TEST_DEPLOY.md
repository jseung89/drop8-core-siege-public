# DROP8 AWS Test Server Deploy

This repo is a Node.js 22 + pnpm workspace. The production server serves both:

- `client/dist` static files
- Colyseus HTTP/WebSocket server on `PORT`, default `2567`

The simplest test deployment is one EC2 Ubuntu instance, port `2567`, and GitHub Actions SSH deploy.

## 1. Create AWS EC2

Recommended test instance:

- Ubuntu 24.04 LTS or 22.04 LTS
- `t3.small` or larger
- 20 GB gp3 disk
- Security group inbound:
  - SSH `22` from your IP only
  - TCP `2567` from your test players, or `0.0.0.0/0` for a quick public test

After launch, copy the public IPv4 or DNS name.

## 2. Create GitHub Test Repo

Create a new repo, for example:

```bash
drop8-aws-test
```

Push this local branch:

```bash
git remote add origin https://github.com/YOUR_ID/drop8-aws-test.git
git push -u origin aws-test
```

## 3. Add GitHub Actions Secrets

In GitHub repo:

`Settings -> Secrets and variables -> Actions -> New repository secret`

Required:

- `EC2_HOST`: EC2 public IPv4 or DNS
- `EC2_SSH_KEY`: private key text for the EC2 SSH key

Optional:

- `EC2_USER`: default `ubuntu`
- `APP_DIR`: default `/opt/drop8-test`
- `PORT`: default `2567`

## 4. Deploy

Push to `aws-test`:

```bash
git push
```

The workflow will:

1. install dependencies
2. build shared/client/server
3. run focused server tests
4. bootstrap EC2 if needed
5. rsync source to EC2
6. build on EC2
7. restart PM2 app `drop8-test`
8. call `/api/health`

Test URL:

```text
http://EC2_HOST:2567/
```

If the instance uses the DROP8 Nginx proxy, use `http://EC2_HOST/` instead. The
EC2 process still listens on port `2567` internally.

Health URL:

```text
http://EC2_HOST:2567/api/health
```

With the Nginx proxy, the public health URL is `http://EC2_HOST/api/health`.

## 5. EC2 Manual Commands

Check app:

```bash
pm2 status
pm2 logs drop8-test
```

Restart:

```bash
cd /opt/drop8-test
PORT=2567 NODE_ENV=production pm2 startOrReload ecosystem.config.cjs --env production
```

Stop:

```bash
pm2 stop drop8-test
```
