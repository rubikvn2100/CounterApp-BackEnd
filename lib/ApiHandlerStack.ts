import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { apiHandlerConfig } from "../config/config";
import { Construct } from "constructs";

export interface ApiHandlerProps extends cdk.StackProps {
  DatabaseTable: dynamodb.Table;
}

export class ApiHandlerStack extends cdk.Stack {
  public readonly apiHandler: lambda.Function;

  constructor(scope: Construct, id: string, props: ApiHandlerProps) {
    super(scope, id, props);

    this.apiHandler = new lambda.Function(this, "ApiHandler", {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset("./lambda_code/api_handler"),
      handler: "index.handler",
      environment: {
        TABLE_NAME: props.DatabaseTable.tableName,
        SESSION_DURATION: apiHandlerConfig.sessionDuration.toString(),
      },
    });

    props.DatabaseTable.grantReadWriteData(this.apiHandler);
  }
}
