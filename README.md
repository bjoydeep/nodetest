# nodetest
### Playing with nodejs



1. To build locally: `docker build . -t nodetest`
1. To run locally: `docker run -p 8080:8080 nodetest:latest`
1. To test: `http://localhost:8080/one` (one, two..., ten)

### Deploying to OpenShift
1. The docker image for this code is already uploaded to `quay.io/bjoydeep/nodetest:latest`
1. To deploy on OpenShift: 
    ```
    oc login to your cluster

    then set the namespace to which you want to deploy this

    kubectl apply -k deploy/
    ```

Once this is up and running on an OpenShift server and you have hit the service a few times, you can see metrics by running this PromQL:
```
sum(haproxy_backend_http_responses_total{route="nodetest",exported_namespace="development"})
sum(haproxy_backend_connections_total{route="nodetest",exported_namespace="development"})
sum(haproxy_backend_connections_reused_total {route="nodetest",exported_namespace="development"})
sum(haproxy_backend_connection_errors_total {route="nodetest",exported_namespace="development"})
```
Word of caution: The HAProxy metrics are great to monitor a service holistically - but you will not be able to get a break down by URLs or HTTP Method. For indepth stuff, you will need to instrument your application.

