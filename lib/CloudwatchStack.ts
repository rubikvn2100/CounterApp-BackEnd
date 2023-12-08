import * as cdk from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { cloudwatchConfigs } from "../config/config";
import { Construct } from "constructs";

export interface CloudwatchStackProps extends cdk.StackProps {
  alarmTopic: sns.Topic;
}

export class CloudwatchStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CloudwatchStackProps) {
    super(scope, id, props);

    for (const cloudwatchConfig of cloudwatchConfigs) {
      const metric = new cloudwatch.Metric({
        namespace: cloudwatchConfig.metric.namespace,
        metricName: cloudwatchConfig.metric.metricName,
        period: cdk.Duration.minutes(cloudwatchConfig.metric.periodMinute),
        statistic: cloudwatchConfig.metric.statistic,
      });

      const alarm = new cloudwatch.Alarm(this, cloudwatchConfig.alarmName, {
        metric: metric,
        threshold: cloudwatchConfig.alarm.threshold,
        evaluationPeriods: cloudwatchConfig.alarm.evaluationPeriods,
      });

      alarm.addAlarmAction(new SnsAction(props.alarmTopic));
    }
  }
}
