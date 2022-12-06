import type { context as ctx, GitHub } from '@actions/github/lib/utils';

/**
 * Notifies the PR about uncommitted changes generated by the `generate:*` commands.
 *
 * This script is used by github-script
 * https://github.com/actions/github-script
 *
 * @param github A pre-authenticated octokit/rest.js client with pagination plugins
 * @param context An object containing the context of the workflow run
 * @param isSuccess A boolean indicating whether the workflow was successful
 */
module.exports = async (
  github: InstanceType<typeof GitHub>,
  context: typeof ctx,
  isSuccess: boolean
) => {
  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  });

  const body = `Uncommitted changes were detected after runnning <code>generate:*</code> commands.\nPlease run <code>pnpm run generate:locales</code>, <code>pnpm run generate:api-docs</code>,  and <code>pnpm run test -u</code> to generate/update the related files, and commit them.`;

  const botComment = comments.find(
    (comment) => comment.user?.type === 'Bot' && comment.body?.includes(body)
  );

  if (isSuccess) {
    if (!botComment) return;
    await github.rest.issues.deleteComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: botComment.id,
    });
    return;
  }

  if (!botComment) {
    await github.rest.issues.createComment({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body,
    });
  }
};
