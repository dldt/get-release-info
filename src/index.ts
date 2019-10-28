import * as core from "@actions/core";
import * as github from "@actions/github";

import * as process from "process";

const REQUIRED = { required: true };

const main = async () => {
    try {
        if (!process.env.GITHUB_TOKEN) {
            throw new Error("Github token must be provided as GITHUB_TOKEN environment variable.")
        }
        const tag_name = core.getInput("tag-name", REQUIRED);
        
        const octokit = new github.GitHub(process.env.GITHUB_TOKEN);

        const releases = await octokit.repos.listReleases({...github.context.repo});

        const matchingReleases = releases.data.filter((x) =>
         tag_name === x.tag_name || (tag_name === "refs/tags/" + x.tag_name),
        );

        if (matchingReleases.length !== 1) {
            throw new Error("Cannot find a single release matching " + tag_name);
        }

        const release = matchingReleases[0];

        core.setOutput("tag-name", release.tag_name);
        core.setOutput("upload_url", release.upload_url);
    } catch (error) {
        core.setFailed(error);
    }
};

main();
