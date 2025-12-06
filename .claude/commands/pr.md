---
description: "Create a well-formatted pull request"
allowed-tools: ["Bash", "Read"]
model: "sonnet"
---

Create a comprehensive pull request with professional formatting.

Target branch: $1 (defaults to main if not specified)

Steps:
1. Review all commits since branching from target branch
2. Analyze the full diff to understand all changes
3. Generate a comprehensive PR summary including:
   - **Summary**: Brief overview of what changed and why
   - **Changes Made**: Bulleted list of key changes
   - **Breaking Changes**: Any breaking changes (if applicable)
   - **Testing**: How the changes were tested
   - **Screenshots**: Note if UI changes require screenshots
4. Use `gh pr create` to create the pull request with proper title and body
5. Return the PR URL

Format the PR body professionally:
```markdown
## Summary
[Brief description of changes]

## Changes Made
- Change 1
- Change 2
- Change 3

## Breaking Changes
- [List any breaking changes or write "None"]

## Testing
- [x] Tested locally
- [x] Types pass
- [ ] Unit tests added/updated
- [ ] Manual testing completed

## Screenshots
[If UI changes, note where screenshots should be added]
```

Use heredoc format for the gh pr create command to ensure proper formatting.
