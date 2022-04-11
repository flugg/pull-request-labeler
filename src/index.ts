import { getInput, info, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { Client } from './Client';

(async () => {
  const token = getInput('token', { required: true });
  const map = getInput('map')
    ? JSON.parse(getInput('map'))
    : {
        feat: 'feature',
        fix: 'fix',
        refactor: 'refactor',
        docs: 'documentation',
      };

  if (!context.payload.pull_request) {
    setFailed('The action was not called within a pull request.');
  }

  const client = new Client(token, {
    repo: context.repo.repo,
    owner: context.repo.owner,
  });

  const commits = await client.getCommits(context.payload.pull_request.number);
  const types = new Set(
    commits
      .map((commit) => commit.type)
      .map((type) => map[type])
      .filter((type) => !!type)
  );

  const labels = await client.getLabels(context.payload.pull_request.number);
  info('labels: ' + labels.join(', '));

  // info(`Adding labels [${Array.from(types).join(', ')}] to pull request #${context.payload.pull_request.number}`);
  // await client.addLabels(Array.from(types), context.payload.pull_request.number);
})();
