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

  /** Fetches a list of the last 250 commit messages from a pull request. */
  async getCommits(pullRequestNumber: number) {
    const response = await this.client.rest.pulls.listCommits({
      ...this.context,
      pull_number: pullRequestNumber,
    });

    return response.data.map(({ commit }) => parseCommit(commit.message));
  }

  /** Fetches a list of existing labels for a pull request. */
  async getLabels(pullRequestNumber: number) {
    const response = await this.client.rest.issues.listLabelsOnIssue({
      ...this.context,
      issue_number: pullRequestNumber,
    });

    return response.data.map((label) => label.name);
  }

  /** Adds a label to a pull request. */
  async addLabels(labels: string[], pullRequestNumber: number) {
    this.client.rest.issues.addLabels({
      ...this.context,
      issue_number: pullRequestNumber,
      labels: labels,
    });
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
