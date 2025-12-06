---
description: "Perform thorough code review of pending changes"
allowed-tools: ["Bash", "Read", "Grep"]
model: "sonnet"
---

Review all staged changes for:
1. Code quality and best practices
2. TypeScript type safety
3. Security vulnerabilities (SQL injection, XSS, command injection, etc.)
4. Performance implications
5. Test coverage
6. Documentation completeness

Provide specific, actionable feedback with line numbers.

Steps:
1. Run `git diff --staged` to see all staged changes
2. Review each file thoroughly
3. Check for common issues in Next.js/React applications
4. Verify TypeScript types are properly defined
5. Look for potential security issues
6. Suggest improvements if any
