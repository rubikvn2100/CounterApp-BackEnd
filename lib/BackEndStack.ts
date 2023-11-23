import * as cdk from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
  IFileSetProducer,
} from "aws-cdk-lib/pipelines";
import { stages, githubSource } from "../config/config";
import { AppStage } from "./AppStage";
import { Construct } from "constructs";

function createGitHubSource(repoSuffix: string): IFileSetProducer {
  const repoName = `${githubSource.owner}/${githubSource.repoName}${repoSuffix}`;

  return CodePipelineSource.gitHub(repoName, githubSource.branch, {
    authentication: cdk.SecretValue.secretsManager("github-access-token"),
  });
}

export class BackEndStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repoSuffixes = ["", "-Config", "-Lambda"];
    const [sourceCode, configCode, lambdaCode] =
      repoSuffixes.map(createGitHubSource);

    const buildLambda = new ShellStep("BuildLambda", {
      input: lambdaCode,
      commands: ["./setup_and_test.sh"],
      primaryOutputDirectory: "./src",
    });

    const appPipeline = new CodePipeline(this, "CounterAppBackEndPipeline", {
      pipelineName: "CounterAppBackEndPipeline",
      synth: new ShellStep("AppSynth", {
        input: sourceCode,
        additionalInputs: {
          config: configCode,
          lambda_code: buildLambda,
        },
        commands: ["npm ci", "npm run deploy"],
        primaryOutputDirectory: "cdk.out",
      }),
      crossAccountKeys: true,
    });

    for (const stage of stages) {
      appPipeline.addStage(
        new AppStage(this, stage.stageName, {
          env: {
            account: stage.account,
            region: stage.region,
          },
        }),
      );
    }
  }
}
