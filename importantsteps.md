To avoid repeating big setup prompts, I added a one-step scaffold command and updated the prompt kit so every run starts from the right files automatically:

Run npm run scaffold:feature <feature-slug> [ticket]. It copies the plan/contract templates and creates the status docs (Plan.md, <feature>-api.md, <feature>-questions.md, <feature>-daily.md, <feature>-issues.md, <feature>-integration-report.md). Script lives in scripts/scaffold-feature.js and is wired through package.json.
After scaffolding, open docs/agents/PROMPT-KIT.md. Each role’s prompt is ready to copy; just replace <feature> (and paste your brief or extra links). Because the files already exist, you don’t need to describe the setup—just attach the plan/contract when you invoke the Plan agent or any follow-up agent.

For new features, the routine is simply:
npm run scaffold:feature analytics-dashboard
Copy the “Plan Agent Prompt” block from the kit, fill in placeholders, attach the newly created docs/plans/analytics-dashboard/Plan.md, and run it.

To resume work in a fresh session, copy the recap prompt you prefer (e.g., point the assistant at the plan, contract, and status files), then pick the next role prompt from the kit.