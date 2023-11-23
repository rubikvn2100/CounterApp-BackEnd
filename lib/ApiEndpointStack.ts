import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { apiEndpointConfig } from "../config/config";
import { Construct } from "constructs";

export interface ApiEndpointStackProps extends cdk.StackProps {
  stageName: string;
  apiHandler: lambda.Function;
}

export class ApiEndpointStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiEndpointStackProps) {
    super(scope, id, props);

    const apiEndpoint = new apigateway.RestApi(this, "ApiEndpoint", {
      restApiName: "ApiEndpoint",
      description: "Endpoint to access database table.",
    });

    const apiEndpointDeployment = new apigateway.Deployment(
      this,
      "ApiEndpointDeployment",
      {
        api: apiEndpoint,
      },
    );

    apiEndpoint.deploymentStage = new apigateway.Stage(
      this,
      `ApiEndpoint${props.stageName}`,
      {
        deployment: apiEndpointDeployment,
        stageName: props.stageName,
        throttlingRateLimit: apiEndpointConfig.throttlingRateLimit,
        throttlingBurstLimit: apiEndpointConfig.throttlingBurstLimit,
      },
    );

    const databaseHandlerIntegration = new apigateway.LambdaIntegration(
      props.apiHandler,
    );

    const apiResource = apiEndpoint.root.addResource("api");

    const [sessionResource, counterResource] = ["session", "counter"].map(
      (resourceName) => apiResource.addResource(resourceName),
    );

    sessionResource.addMethod("POST", databaseHandlerIntegration, {
      operationName: "createSessionToken",
    });

    counterResource.addMethod("GET", databaseHandlerIntegration, {
      operationName: "getCounter",
    });

    counterResource.addMethod("POST", databaseHandlerIntegration, {
      operationName: "updateCounter",
    });
  }
}
