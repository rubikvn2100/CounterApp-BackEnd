import * as cdk from "aws-cdk-lib";
import { DatabaseTableStack } from "./DatabaseTableStack";
import { ApiHandlerStack } from "./ApiHandlerStack";
import { Construct } from "constructs";

export class AppStage extends cdk.Stage {
  constructor(scope: Construct, stageName: string, props: cdk.StackProps) {
    super(scope, stageName, props);

    const databaseTableStack = new DatabaseTableStack(
      this,
      "DatabaseTableStack",
    );

    new ApiHandlerStack(this, "ApiHandlerStack", {
      DatabaseTable: databaseTableStack.DatabaseTable,
    });
  }
}
