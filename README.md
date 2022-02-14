# Lobby Serverless

Lobby is a simple application with authorization, chats and saving/retrieving data.
Technologies: Serverless Framework, GCP, Websocket, MongoDB, Redis.

## How to

[Sign up] for GCP account.

### Google Cloud Functions

1. Use `sample.json` file to configure services with your sensitive data and rename to `env.dev.json`.
2. Create bucket and service keyfile. You can use this [guide].
   Rename json file to `keyfile.json` and store it in the root folder "games".
3. Deploy functions:

```sh
cd gcf/auth
sls deploy

# Allow unauthenticated requests using gcloud CLI:
gcloud functions add-iam-policy-binding <funcName> \
--region=<funcRegion> \
--member=allUsers \
--role=roles/cloudfunctions.invoker
```

! Deploy and make public invoking all functions in the same way as above.

### Google Cloud Run

We are going to use Cloud Run service create Websoket Server.
Build and deploy container from source folder:

```sh
cd websocketServer

gcloud run deploy <serviceName> --timeout=3600 --allow-unauthenticated \
--set-env-vars WS_PORT=<websocketPort> \
--set-env-vars REDIS_HOST=<redisHost> \
--set-env-vars REDIS_PORT=<redisPort> \
--set-env-vars REDIS_PASSWORD=<redisPassword> \
--port <containerPort> --source .
```

After the deployment is complete, use the following command to retrieve the websocket URL string:

```sh
gcloud run services describe <serviceName> --region <serviceRegion>
```

<!-- ### Frontend Service

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
Use `sls s3sync` command to sync local files with s3 bucket. -->

[sign up]: https://www.serverless.com/framework/docs/providers/google/guide/credentials
[guide]: https://medium.com/@olamilekan001/image-upload-with-google-cloud-storage-and-node-js-a1cf9baa1876
