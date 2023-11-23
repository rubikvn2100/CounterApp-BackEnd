import * as cdk from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import { alarmNotificationConfig } from "../config/config";
import { Construct } from "constructs";

export interface AlarmNotificationStackProps extends cdk.StackProps {
  stageName: string;
}

export class AlarmNotificationStack extends cdk.Stack {
  public readonly alarmTopic: sns.Topic;

  constructor(
    scope: Construct,
    id: string,
    props: AlarmNotificationStackProps,
  ) {
    super(scope, id, props);

    this.alarmTopic = new sns.Topic(this, "AlarmTopic");

    this.alarmTopic.addSubscription(
      new subscriptions.EmailSubscription(
        `${alarmNotificationConfig.emailReceiverSuffix}-${props.stageName}@gmail.com`,
      ),
    );
  }
}
