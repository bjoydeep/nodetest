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
sum(haproxy_backend_http_responses_total{route="nodetest",exported_namespace="development"}) #RHACM does not collect, but need to. It has http status code
sum(haproxy_backend_connections_total{route="nodetest",exported_namespace="development"})
sum(haproxy_backend_connections_reused_total {route="nodetest",exported_namespace="development"})
sum(haproxy_backend_connection_errors_total {route="nodetest",exported_namespace="development"})
```
Word of caution: The HAProxy metrics are great to monitor a service holistically - but you will not be able to get a break down by URLs or HTTP Method. For indepth stuff, you will need to instrument your application.

The nodejs program is also instrumented with prometheus client to emit metrics. It emits:
1. default prometheus metrics for nodejs
1. nodejs gcstats: 
    1. nodejs_gc_runs_total: Counts the number of time GC is invoked
    1. nodejs_gc_pause_seconds_total: Time spent in GC in seconds
    1. nodejs_gc_reclaimed_bytes_total: The number of bytes GC has freed
1. custom app metrics: 
    1. total_hit_count
    1. http_request_duration_ms



## Prometheus API call for OpenShift Metric

### From outside of the OpenShift - that is from a kubectl client:
```

# oc whoami -t
(.. will yield <TOKEN> ..)
# curl -ks -H 'Authorization: Bearer <TOKEN>' \
     '${PROMETHEUS-ROUTE-HOST}/api/v1/query?query=${QUERY_EXPRESSION}'

OR

# curl -ks -H 'Authorization: Bearer <TOKEN>' \
'https://prometheus-k8s-openshift-monitoring.apps.dashing-muskox.dev05.red-chesterfield.com/api/v1/query?query=up'
```     

### Equivalent call from inside container would be :
`curl http://localhost:9090/api/v1/query?query=up` . Notice the change of port from 9091 to 9090

This would look like:
```
# oc exec -n openshift-monitoring -c prometheus prometheus-k8s-0 -- curl -s \
'http://localhost:9090/api/v1/query?query=up'
```

Or, if you choose to use port 9091, then AFTER logging into any pod, you can make a call as:
```
# curl -k -H 'Authorization: Bearer <TOKEN>' \
     'https://prometheus-k8s.openshift-monitoring.svc:9091/api/v1/query?query=${QUERY_EXPRESSION}'
 ```    

## Prometheus API call for Custom Metric 

Custom metrics are to be queried from `ns: openshift-user-workload-monitoring , pod: prometheus-user-workload-0, service: prometheus-user-workload`. Notice this is from a different namespace, pod and service. Notably from the prometheus added to handle custom metrics.

```
oc exec -n openshift-user-workload-monitoring -c prometheus prometheus-user-workload-0 -- curl -s \
'http://localhost:9090/api/v1/query?query=total_hit_count'
```
