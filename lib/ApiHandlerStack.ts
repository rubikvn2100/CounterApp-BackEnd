import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { stages, apiHandlerConfig } from "../config/config";
import { Construct } from "constructs";

export interface ApiHandlerProps extends cdk.StackProps {
  stageName: string;
  DatabaseTable: dynamodb.Table;
}

export class ApiHandlerStack extends cdk.Stack {
  public readonly apiHandler: lambda.Function;

  constructor(scope: Construct, id: string, props: ApiHandlerProps) {
    super(scope, id, props);

    const stageConfig = stages.find(
      (stage) => stage.stageName === props.stageName,
    );

    const allowOrigins = stageConfig!.allowOrigins;
    const accessControlMaxAge = stageConfig!.accessControlMaxAge;

    this.apiHandler = new lambda.Function(this, "ApiHandler", {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset("./lambda_code/api_handler"),
      handler: "index.handler",
      environment: {
        TABLE_NAME: props.DatabaseTable.tableName,
        SESSION_DURATION: apiHandlerConfig.sessionDuration.toString(),
        ALLOW_ORIGINS: JSON.stringify(allowOrigins),
        ACCESS_CONTROL_MAX_AGE: JSON.stringify(accessControlMaxAge),
      },
    });

    props.DatabaseTable.grantReadWriteData(this.apiHandler);
  }
}
