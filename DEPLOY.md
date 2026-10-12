# IBM Code Engine Deployment

Run these commands from the Skills Network lab terminal after logging in to IBM Cloud and selecting your Code Engine project.

Replace the `REGISTRY_NAMESPACE` and `REGION` values with your own IBM Container Registry namespace and region.

```sh
export REGION=us-south
export REGISTRY_NAMESPACE=<your-registry-namespace>
export DJANGO_IMAGE=us.icr.io/$REGISTRY_NAMESPACE/dealership-django:latest
export DATABASE_IMAGE=us.icr.io/$REGISTRY_NAMESPACE/dealership-database:latest
export SENTIMENT_URL=https://sentianalyzer.2fublcpclpnm.us-south.codeengine.appdomain.cloud/

ibmcloud login --sso
ibmcloud target -r $REGION
ibmcloud ce project select --name <your-code-engine-project>
ibmcloud cr namespace-add $REGISTRY_NAMESPACE
ibmcloud cr login
```

Build and push the Express/Mongo backend image:

```sh
docker build -t $DATABASE_IMAGE -f server/database/Dockerfile server/database
docker push $DATABASE_IMAGE
```

Deploy MongoDB, then deploy the Express backend so Django can reach it:

```sh
ibmcloud ce application create \
  --name dealership-mongo \
  --image mongo:7 \
  --port 27017 \
  --min-scale 1 \
  --max-scale 1

ibmcloud ce application create \
  --name dealership-database \
  --image $DATABASE_IMAGE \
  --port 3030 \
  --env MONGO_URL=mongodb://dealership-mongo:27017/

export BACKEND_URL=$(ibmcloud ce application get --name dealership-database --output url)
```

Build and push the Django image:

```sh
docker build -t $DJANGO_IMAGE -f server/Dockerfile .
docker push $DJANGO_IMAGE
```

Deploy Django to Code Engine:

```sh
ibmcloud ce application create \
  --name dealership-django \
  --image $DJANGO_IMAGE \
  --port 8000 \
  --env backend_url=$BACKEND_URL \
  --env sentiment_analyzer_url=$SENTIMENT_URL \
  --env DJANGO_DEBUG=False

export DJANGO_URL=$(ibmcloud ce application get --name dealership-django --output url)
echo $DJANGO_URL
```

Get the deployed app URLs:

```sh
ibmcloud ce application get --name dealership-database
ibmcloud ce application get --name dealership-django
```

If you update the code later, rebuild, push, and update each app:

```sh
docker build -t $DATABASE_IMAGE -f server/database/Dockerfile server/database
docker push $DATABASE_IMAGE
ibmcloud ce application update --name dealership-database --image $DATABASE_IMAGE

docker build -t $DJANGO_IMAGE -f server/Dockerfile .
docker push $DJANGO_IMAGE
ibmcloud ce application update \
  --name dealership-django \
  --image $DJANGO_IMAGE \
  --env backend_url=$BACKEND_URL \
  --env sentiment_analyzer_url=$SENTIMENT_URL \
  --env DJANGO_DEBUG=False
```

If the MongoDB app does not become reachable in your lab's Code Engine project, use an IBM Cloud Databases for MongoDB connection string instead and update the Express app with:

```sh
ibmcloud ce application update \
  --name dealership-database \
  --env MONGO_URL='<your-mongodb-connection-string>'
```
