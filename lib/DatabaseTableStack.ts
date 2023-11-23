import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { databaseTableConfig } from "../config/config";
import { Construct } from "constructs";

export class DatabaseTableStack extends cdk.Stack {
  public readonly DatabaseTable: dynamodb.Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.DatabaseTable = new dynamodb.Table(this, "DatabaseTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: "DatabaseTable",
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: databaseTableConfig.readCapacity,
      writeCapacity: databaseTableConfig.writeCapacity,
    });
  }
}
