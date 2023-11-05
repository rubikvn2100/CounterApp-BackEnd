import * as cdk from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
  IFileSetProducer,
} from "aws-cdk-lib/pipelines";
import { githubSource } from "../config/config";
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

    const repoSuffixes = ["", "-Config"];
    const [sourceCode, configCode] = repoSuffixes.map(createGitHubSource);

    new CodePipeline(this, "CounterAppBackEndPipeline", {
      pipelineName: "CounterAppBackEndPipeline",
      synth: new ShellStep("AppSynth", {
        input: sourceCode,
        additionalInputs: {
          config: configCode,
        },
        commands: ["npm ci", "npm run deploy"],
        primaryOutputDirectory: "cdk.out",
      }),
      crossAccountKeys: true,
    });
  }
}
