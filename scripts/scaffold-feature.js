#!/usr/bin/env node

/**
 * Scaffold plan, contract, and status docs for a new feature.
 * Usage: npm run scaffold:feature <feature-slug> [ticket]
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs/promises");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const [, , featureArg, ticketArg] = process.argv;

if (!featureArg) {
  console.error("⚠️  Usage: npm run scaffold:feature <feature-slug> [ticket]");
  process.exit(1);
}

const repoRoot = process.cwd();
const feature = featureArg.replace(/\s+/g, "-").toLowerCase();
const ticket = ticketArg ? ticketArg.toUpperCase() : null;

const templates = {
  plan: "docs/agents/FEATURE-PLAN_TEMPLATE.md",
  contract: "docs/contracts/API-CONTRACT_TEMPLATE.md",
};

const targets = {
  plan: `docs/plans/${feature}/Plan.md`,
  contract: `docs/contracts/${feature}-api.md`,
  questions: `docs/status/${feature}-questions.md`,
  daily: `docs/status/${feature}-daily.md`,
  issues: `docs/status/${feature}-issues.md`,
  integration: `docs/status/${feature}-integration-report.md`,
};

async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(path.join(repoRoot, dir), { recursive: true });
}

async function copyTemplate(templatePath, targetPath, header) {
  const source = path.join(repoRoot, templatePath);
  const destination = path.join(repoRoot, targetPath);

  await ensureDir(destination);

  try {
    await fs.access(destination);
    console.log(`ℹ️  Skipping existing file ${targetPath}`);
    return;
  } catch {
    // continue and create file
  }

  const contents = await fs.readFile(source, "utf8");
  const ticketLine = ticket ? `\n- Ticket: ${ticket}\n` : "";
  const preamble = header ? `## ${header}\n${ticketLine}\n` : "";
  await fs.writeFile(destination, preamble + contents);
  console.log(`✅ Created ${targetPath}`);
}

async function touchFile(targetPath, heading) {
  const destination = path.join(repoRoot, targetPath);
  await ensureDir(destination);

  try {
    await fs.access(destination);
    console.log(`ℹ️  Skipping existing file ${targetPath}`);
    return;
  } catch {
    // create new file
  }

  const ticketLine = ticket ? `\nTicket: ${ticket}\n` : "";
  const headingLine = heading ? `# ${heading}\n` : "";
  await fs.writeFile(destination, `${headingLine}${ticketLine}`);
  console.log(`✅ Created ${targetPath}`);
}

async function main() {
  await copyTemplate(templates.plan, targets.plan, `${feature} Feature Plan`);
  await copyTemplate(templates.contract, targets.contract, `${feature} Contract`);

  await touchFile(targets.questions, `${feature} – Open Questions`);
  await touchFile(targets.daily, `${feature} – Daily Log`);
  await touchFile(targets.issues, `${feature} – Issues & TODOs`);
  await touchFile(targets.integration, `${feature} – Integration Report`);

  console.log("\n🎉 Feature scaffolding complete.");
  console.log("Next steps:");
  console.log(`- Review docs/plans/${feature}/Plan.md`);
  console.log(`- Populate docs/contracts/${feature}-api.md`);
  console.log("- Use docs/agents/PROMPT-KIT.md to launch the Plan Agent.");
}

main().catch((err) => {
  console.error("❌ Failed to scaffold feature:", err);
  process.exit(1);
});

