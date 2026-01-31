# Generate PR Description

Generate a pull request description based on the changes in the current branch.

## Instructions

1. First, determine the base branch by checking for a PR or using `next` as default:
   ```bash
   gh pr view --json baseRefName --jq '.baseRefName' 2>/dev/null || echo "next"
   ```

2. Analyze the changes in this branch compared to the base branch:
   - Run `git diff <base>..HEAD --stat` to see changed files
   - Run `git diff <base>..HEAD` to see the actual changes
   - Run `git log <base>..HEAD --oneline` to see commit messages

3. Read the PR template at `.github/PULL_REQUEST_TEMPLATE.md`

4. Generate a PR description following the template structure:
   - **Issue:** Link related issues or write "N/A" with context
   - **What I did:** Summarize the changes with bullet points for specific modifications
   - **How to test:** Provide clear steps to verify the changes work
   - Answer the template questions about examples and documentation

5. Check if a PR exists for this branch:
   ```bash
   gh pr view --json number 2>/dev/null
   ```

6. If a PR exists, ask the user if they want to update it with the generated description using `gh pr edit`.

## Guidelines

- Be specific about version changes (e.g., "1.0.0 → 2.0.0")
- Highlight breaking changes prominently
- Group related changes together
- Keep the description concise but informative
- Use code blocks for commands in "How to test"
