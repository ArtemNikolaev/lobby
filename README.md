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
gcloud functions add-iam-policy-binding `funcName` --region=`funcRegion` --member=allUsers --role=roles/cloudfunctions.invoker
```

! Deploy all functions in the same way as above.

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
