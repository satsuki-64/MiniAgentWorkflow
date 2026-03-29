const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const rootDir = path.resolve(__dirname, "..", "..");
const ideaPath = path.join(rootDir, "IDEA.md");
const githubPrefix = "- 当前项目 GitHub 链接（可选）：";

function run(cmd, options = {}) {
  return cp.execSync(cmd, {
    cwd: rootDir,
    stdio: options.stdio || "pipe",
    encoding: "utf8"
  });
}

function parseArgs(argv) {
  const args = {
    task: "",
    step: "",
    message: "",
    push: false,
    help: false
  };

  for (let i = 2; i < argv.length; i += 1) {
    const cur = argv[i];
    if (cur === "--task") {
      args.task = String(argv[i + 1] || "").trim();
      i += 1;
      continue;
    }
    if (cur === "--step") {
      args.step = String(argv[i + 1] || "").trim();
      i += 1;
      continue;
    }
    if (cur === "--message") {
      args.message = String(argv[i + 1] || "").trim();
      i += 1;
      continue;
    }
    if (cur === "--push") {
      args.push = true;
      continue;
    }
    if (cur === "--help" || cur === "-h") {
      args.help = true;
      continue;
    }
  }

  return args;
}

function printHelp() {
  console.log([
    "Usage:",
    "  node scripts/git-backup.js --task T0002 --step S2 --message \"update parser\" [--push]",
    "",
    "Behavior:",
    "  1) Stage all tracked/untracked changes",
    "  2) Create backup commit when there are changes",
    "  3) Optionally push to origin when --push is provided"
  ].join("\n"));
}

function readGithubUrlFromIdea() {
  if (!fs.existsSync(ideaPath)) {
    return "";
  }

  const text = fs.readFileSync(ideaPath, "utf8");
  const line = text.split(/\r?\n/).find((x) => x.trimStart().startsWith(githubPrefix));
  if (!line) {
    return "";
  }

  return line.slice(line.indexOf(githubPrefix) + githubPrefix.length).trim();
}

function ensureRemoteFromIdea(githubUrl) {
  if (!githubUrl) {
    return;
  }

  let hasOrigin = true;
  try {
    run("git remote get-url origin");
  } catch (_) {
    hasOrigin = false;
  }

  if (!hasOrigin) {
    run(`git remote add origin ${githubUrl}`);
    return;
  }

  const current = run("git remote get-url origin").trim();
  if (current !== githubUrl) {
    run(`git remote set-url origin ${githubUrl}`);
  }
}

function hasChanges() {
  const out = run("git status --porcelain").trim();
  return out.length > 0;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }

  const taskLabel = args.task || "TASK";
  const stepLabel = args.step || "STEP";
  const detail = args.message || "checkpoint";
  const commitMsg = `backup(${taskLabel}): ${stepLabel} ${detail}`;

  if (!hasChanges()) {
    console.log("No changes detected, skip backup commit.");
    return;
  }

  run("git add -A", { stdio: "inherit" });
  run(`git commit -m \"${commitMsg.replace(/\"/g, "'")}\"`, { stdio: "inherit" });

  if (!args.push) {
    console.log("Backup commit created locally.");
    return;
  }

  const githubUrl = readGithubUrlFromIdea();
  ensureRemoteFromIdea(githubUrl);

  run("git push origin HEAD", { stdio: "inherit" });
  console.log("Backup commit pushed to origin.");
}

main();