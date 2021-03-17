const { Octokit } = require("@octokit/rest")
const { env } = require("process")
const createChangeLog = require("auto-changelog/src/run").run

const octokit = new Octokit({ auth: env.GITHUB_TOKEN })

async function script() {
    // Compare: https://docs.github.com/en/rest/reference/repos/#list-organization-repositories
    const tags = (await octokit.repos.listTags({
        owner: "FlorianLebrun",
        repo: "cpp-playground",
    })).data

    const tagV1 = (await octokit.repos.getReleaseByTag({
        owner: "FlorianLebrun",
        repo: "cpp-playground",
        tag: "v1",
    })).data

    const releases = (await octokit.repos.listReleases({
        owner: "FlorianLebrun",
        repo: "cpp-playground",
    })).data

    const lastRelease = releases[0]
    const prevRelease = releases[1]

    lastRelease.tag_name

    const commits = (await octokit.repos.listCommits({
        owner: "FlorianLebrun",
        repo: "cpp-playground",
        since: lastRelease.tag_name,
    })).data

    console.log(tagV1)
    commits.map(x => {
        const username = x.author?.login || x.commit.author.name
        console.log({ message: x.commit.message, author: username })
    })
}

script()