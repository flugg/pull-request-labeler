import { getOctokit } from '@actions/github';
import { parseCommit } from './parseCommit';

/** The client type as returned by Github's Octokit package. */
export type ClientType = ReturnType<typeof getOctokit>;

/** Common context values provided with every API call. */
export interface ClientContext {
  repo: string;
  owner: string;
}

/** A client used to communicate with the Github API. */
export class Client {
  private client: ClientType;
  private context: ClientContext;

  constructor(token: string, context: ClientContext) {
    this.client = getOctokit(token);
    this.context = context;
  }

  /** Fetches a list of 250 of the most recent commit messages from a pull request. */
  async getCommits(pullRequestNumber: number) {
    const response = await this.client.rest.pulls.listCommits({
      ...this.context,
      pull_number: pullRequestNumber,
    });

    return response.data.map(({ commit }) => parseCommit(commit.message));
  }

  /** Adds a label to a pull request. */
  async addLabels(labels: string[], pullRequestNumber: number) {
    await Promise.all(
      labels.map((label) =>
        this.client.rest.issues.addLabels({
          ...this.context,
          issue_number: pullRequestNumber,
          name: label,
        })
      )
    );
  }

  /** Removes the provided labels from a pull request. */
  async removeLabels(labels: string[], pullRequestNumber: number) {
    await Promise.all(
      labels.map((label) =>
        this.client.rest.issues.removeLabel({
          ...this.context,
          issue_number: pullRequestNumber,
          name: label,
        })
      )
    );
  }
}
