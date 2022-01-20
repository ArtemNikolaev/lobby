# Lobby Serverless

Lobby is a simple application with authorization, chats and saving/retrieving data.
Technologies: Serverless Framework, AWS (Lambda, API Gateway, S3), Websocket, MongoDB, Redis.

Client side is the static site hosting to AWS S3.
Backend side is AWS API Gateway (REST, Websocket) and Lambdas.

## How to

[Sign up] for an AWS account.

### Backend Services

1. Use `env.dev.sample.json` file to configure services with your sensitive data and rename to `env.dev.json`.
2. Then install dependencies and deploy services:

```sh
cd restService
npm install
sls deploy

cd websocketService
npm install
sls deploy
```

### Frontend Service

1. Fill `config.js` in frontend part using backend services output keys:

   `ServiceEndpoint` -- restService API URL.
   `ServiceEndpointWebsocket` -- websocketService API URL.

2. Then install plugin `serverless-s3-sync` and deploy service:

```sh
cd frontendService
npm install serverless-s3-sync

sls deploy
```

Use the `StaticSiteS3BucketWebsiteURL` output key of the frontendService to test the app.
Use `sls s3sync` command to sync local files with s3 bucket.

[sign up]: https://www.serverless.com/framework/docs/providers/aws/guide/credentials
