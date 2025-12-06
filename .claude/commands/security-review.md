---
description: "Security audit of pending changes"
allowed-tools: ["Bash", "Read", "Grep"]
model: "sonnet"
---

Perform comprehensive security audit focusing on:

## OWASP Top 10 Vulnerabilities
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Insecure Authentication
- Security Misconfiguration
- Sensitive Data Exposure
- Broken Access Control
- Using Components with Known Vulnerabilities
- Insufficient Logging & Monitoring

## Specific Checks
- **Input Validation**: All user inputs properly sanitized
- **Authentication/Authorization**: Proper session handling, token validation
- **Secrets Management**: No hardcoded credentials, API keys, tokens
- **Dependency Vulnerabilities**: Check for outdated or vulnerable packages
- **API Security**: Proper rate limiting, authentication, input validation
- **Database Security**: Parameterized queries, no raw SQL with user input
- **File Operations**: No path traversal vulnerabilities
- **Server Actions**: Proper validation and authorization

Steps:
1. Run `git diff --staged` to see pending changes
2. Analyze each file for security issues
3. Report findings with severity (Critical, High, Medium, Low)
4. Provide remediation suggestions with code examples
