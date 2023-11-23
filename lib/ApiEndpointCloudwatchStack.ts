import * as cdk from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { apiEndpointCloudwatchConfig } from "../config/config";
import { Construct } from "constructs";

export interface ApiEndpointCloudwatchStackProps extends cdk.StackProps {
  alarmTopic: sns.Topic;
}

export class ApiEndpointCloudwatchStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: ApiEndpointCloudwatchStackProps,
  ) {
    super(scope, id, props);

    const apiEndpointCallsMetric = new cloudwatch.Metric({
      namespace: apiEndpointCloudwatchConfig.metric.namespace,
      metricName: apiEndpointCloudwatchConfig.metric.metricName,
      period: cdk.Duration.minutes(
        apiEndpointCloudwatchConfig.metric.periodMinute,
      ),
      statistic: apiEndpointCloudwatchConfig.metric.statistic,
    });

    const apiEndpointCallsAlarm = new cloudwatch.Alarm(
      this,
      "ApiEndpointCallsAlarm",
      {
        metric: apiEndpointCallsMetric,
        threshold: apiEndpointCloudwatchConfig.alarm.threshold,
        evaluationPeriods: apiEndpointCloudwatchConfig.alarm.evaluationPeriods,
      },
    );

    apiEndpointCallsAlarm.addAlarmAction(new SnsAction(props.alarmTopic));
  }
}
