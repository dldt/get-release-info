"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const process = __importStar(require("process"));
const REQUIRED = { required: true };
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.GITHUB_TOKEN) {
            throw new Error("Github token must be provided as GITHUB_TOKEN environment variable.");
        }
        const tag_name = core.getInput("tag-name", REQUIRED);
        const octokit = new github.GitHub(process.env.GITHUB_TOKEN);
        const releases = yield octokit.repos.listReleases(Object.assign({}, github.context.repo));
        const matchingReleases = releases.data.filter((x) => tag_name === x.tag_name || (tag_name === "refs/tags/" + x.tag_name));
        if (matchingReleases.length !== 1) {
            throw new Error("Cannot find a single release matching " + tag_name);
        }
        const release = matchingReleases[0];
        core.setOutput("tag-name", release.tag_name);
        core.setOutput("upload_url", release.upload_url);
    }
    catch (error) {
        core.setFailed(error);
    }
});
main();
