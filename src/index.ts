import { debug, getInput } from '@actions/core';
import { context } from '@actions/github';
import { Client } from './Client';

(async () => {
  debug('test');
  const token = getInput('token', { required: true });

  if (!context.payload.pull_request) {
    throw new Error('The action was not called within a pull request.');
  }

  const client = new Client(token, {
    repo: context.repo.repo,
    owner: context.repo.owner,
  });

  const commits = await client.getCommits(context.payload.pull_request.number);

  debug(commits.map((commit) => commit.type).join(','));
})();
