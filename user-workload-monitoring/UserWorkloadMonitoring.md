# User Work load Monitoring

We have created our new service and exposed some custom metrics. Now we need to expose it in Prometheus. In OpenShift Container Platform 4.6, you can enable monitoring for user-defined projects in addition to the default platform monitoring. You can now monitor your own projects in OpenShift Container Platform without the need for an additional monitoring solution. Using this new feature centralizes monitoring for core platform components and user-defined projects. The architecture is explained [here](https://docs.openshift.com/container-platform/4.6/monitoring/understanding-the-monitoring-stack.html#understanding-the-monitoring-stack_understanding-the-monitoring-stack).

## Steps
I generally followed [Enabling monitoring for user-defined projects](https://docs.openshift.com/container-platform/4.6/monitoring/enabling-monitoring-for-user-defined-projects.html) . But there was a caveat. It says in Prereq section:
Prerequisites
1. You have access to the cluster as a user with the cluster-admin role.
1. You have installed the OpenShift CLI (oc).
1. You have created the cluster-monitoring-config ConfigMap object.
1. You have optionally created and configured the user-workload-monitoring-config ConfigMap object in the openshift-user-workload-monitoring project. You can add configuration options to this ConfigMap object for the components that monitor user-defined projects.

The cluster-monitoring-config ConfigMap object as in that link is correct. And its also added as a yaml file in this directory.
I have found out that the user-workload-monitoring-config ConfigMap object is `not optional` (will need to re confirm this). So I had to create this. And its also added as a yaml file in this directory - [reference is here](https://docs.openshift.com/container-platform/4.6/monitoring/configuring-the-monitoring-stack.html#creating-user-defined-workload-monitoring-configmap_configuring-the-monitoring-stack) .

Follow rest of the instructions in this link. And finally created a ServiceMonitor Object as explained [here](https://docs.openshift.com/container-platform/4.6/monitoring/managing-metrics.html#specifying-how-a-service-is-monitored_managing-metrics) And its also added as a yaml file in this directory.

BTW, as mentioned above, I stumbled upon the fact that the user-workload-monitoring-config ConfigMap was needed. I found this [Investigating why user-defined metrics are unavailable]( https://docs.openshift.com/container-platform/4.6/monitoring/troubleshooting-monitoring-issues.html#investigating-why-user-defined-metrics-are-unavailable_troubleshooting-monitoring-issues) incredibly helpful in troubleshooting. Specially:
```
Review the target status for your project in the Prometheus UI directly.

Establish port-forwarding to the Prometheus instance in the openshift-user-workload-monitoring project:


$ oc port-forward -n openshift-user-workload-monitoring pod/prometheus-user-workload-0 9090

Open http://localhost:9090/targets in a web browser and review the status of the target for your project directly in the Prometheus UI. Check for error messages relating to the target.
```
In our example, we saw this in the UI:
```
nodetest-foo/nodetest-monitor/0 (1/1 up)
```

Then I could check the custom metrics being captured by the `new Prometheus` installed. 

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


