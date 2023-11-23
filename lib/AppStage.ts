import * as cdk from "aws-cdk-lib";
import { DatabaseTableStack } from "./DatabaseTableStack";
import { ApiHandlerStack } from "./ApiHandlerStack";
import { ApiEndpointStack } from "./ApiEndpointStack";
import { AlarmNotificationStack } from "./AlarmNotificationStack";
import { ApiEndpointCloudwatchStack } from "./ApiEndpointCloudwatchStack";
import { Construct } from "constructs";

export class AppStage extends cdk.Stage {
  constructor(scope: Construct, stageName: string, props: cdk.StackProps) {
    super(scope, stageName, props);

    const databaseTableStack = new DatabaseTableStack(
      this,
      "DatabaseTableStack",
    );

    const apiHandlerStack = new ApiHandlerStack(this, "ApiHandlerStack", {
      DatabaseTable: databaseTableStack.DatabaseTable,
    });

    new ApiEndpointStack(this, "ApiEndpointStack", {
      stageName: stageName,
      apiHandler: apiHandlerStack.apiHandler,
    });

    const alarmNotificationStack = new AlarmNotificationStack(
      this,
      "AlarmNotificationStack",
      {
        stageName: stageName,
      },
    );

    new ApiEndpointCloudwatchStack(this, "ApiEndpointCloudwatchStack", {
      alarmTopic: alarmNotificationStack.alarmTopic,
    });
  }
}
