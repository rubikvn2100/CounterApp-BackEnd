import * as cdk from "aws-cdk-lib";
import { DatabaseTableStack } from "./DatabaseTableStack";
import { Construct } from "constructs";

export class AppStage extends cdk.Stage {
  constructor(scope: Construct, stageName: string, props: cdk.StackProps) {
    super(scope, stageName, props);

    new DatabaseTableStack(this, "DatabaseTableStack");
  }
}
