# gcp-scale-image
The "gcp-scale-image" project is simple node.js app based on express.js for google cloud run.
App has 1 endpoint of method `POST` which require Pub/Sub notification about uploaded file to bucket and environment variable `BUCKET` with name of bucket to upload scaled images.

## Run locally with docker
```bash
docker run -p 8080:8080 ghcr.io/elgovanni/gcp-scale-image:master
```

## Run on Google Cloud Run
[![Run on Google Cloud](https://storage.googleapis.com/cloudrun/button.svg)](https://console.cloud.google.com/cloudshell/editor?shellonly=true&cloudshell_image=gcr.io/cloudrun/button&cloudshell_git_repo=https://github.com/ElGovanni/gcp-scale-image.git)
