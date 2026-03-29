const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3077;
const rootDir = path.resolve(__dirname, "..");
const ideaPath = path.join(rootDir, "IDEA.md");
const taskPath = path.join(rootDir, ".agent", "TASK.md");

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const IDEA_FIELDS = [
  { key: "goal", prefix: "- 当前目标描述：" },
  { key: "githubUrl", prefix: "- 当前项目 GitHub 链接（可选）：" },
  { key: "workstream", prefix: "- 主工作流（例如：`research`、`model`、`experiment`、`writing`）：" },
  { key: "allowAutoFix", prefix: "- 本次是否允许自动创建 `Fix` 任务：" },
  { key: "registerBugFirst", prefix: "- 若发现 Bug，是否必须先登记再修复：" },
  { key: "continuousExecution", prefix: "- 是否持续执行完整的任务，一直执行、一直到验收，不需要中途提问我：" },
  { key: "autoCommit", prefix: "- 单次执行完成后自动 commit：" },
  { key: "autoPush", prefix: "- 单次执行完成后自动 push：" },
  { key: "riskLevel", prefix: "- 风险等级：" },
  { key: "planDepth", prefix: "- 规划详细程度：" },
  { key: "targetLanguage", prefix: "- 目标语言：" }
];

const IDEA_BLOCKS = [
  {
    key: "backgroundInfoNotes",
    start: "<<<BACKGROUND_INFO_START>>>",
    end: "<<<BACKGROUND_INFO_END>>>"
  },
  {
    key: "expectedOutputNotes",
    start: "<<<EXPECTED_OUTPUT_START>>>",
    end: "<<<EXPECTED_OUTPUT_END>>>"
  }
];

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function parseIdea(rawText) {
  const result = {};
  const lines = rawText.split(/\r?\n/);

  for (const field of IDEA_FIELDS) {
    const line = lines.find((entry) => entry.trimStart().startsWith(field.prefix));

    if (!line) {
      result[field.key] = "";
      continue;
    }

    const idx = line.indexOf(field.prefix);
    result[field.key] = line.slice(idx + field.prefix.length).trim();
  }

  for (const block of IDEA_BLOCKS) {
    result[block.key] = extractBlock(rawText, block.start, block.end);
  }

  return result;
}

function extractBlock(text, startMarker, endMarker) {
  const startIdx = text.indexOf(startMarker);
  const endIdx = text.indexOf(endMarker);

  if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) {
    return "";
  }

  const contentStart = startIdx + startMarker.length;
  return text
    .slice(contentStart, endIdx)
    .replace(/^\s*\r?\n/, "")
    .replace(/\r?\n\s*$/, "")
    .trim();
}

function writeBlock(text, startMarker, endMarker, blockValue) {
  const startIdx = text.indexOf(startMarker);
  const endIdx = text.indexOf(endMarker);

  if (startIdx < 0 || endIdx < 0 || endIdx <= startIdx) {
    return text;
  }

  const contentStart = startIdx + startMarker.length;
  const normalized = String(blockValue || "").replace(/\r\n/g, "\n");
  const inner = `\n${normalized}\n`;
  return `${text.slice(0, contentStart)}${inner}${text.slice(endIdx)}`;
}

function updateIdea(rawText, updates) {
  const lines = rawText.split(/\r?\n/);

  for (const field of IDEA_FIELDS) {
    if (!(field.key in updates)) {
      continue;
    }

    const targetIndex = lines.findIndex((entry) =>
      entry.trimStart().startsWith(field.prefix)
    );

    if (targetIndex >= 0) {
      const indent = lines[targetIndex].match(/^\s*/)[0];
      lines[targetIndex] = `${indent}${field.prefix}${String(updates[field.key] || "").trim()}`;
    }
  }

  let output = lines.join("\n");

  for (const block of IDEA_BLOCKS) {
    if (Object.prototype.hasOwnProperty.call(updates, block.key)) {
      output = writeBlock(output, block.start, block.end, updates[block.key]);
    }
  }

  return output;
}

function parseTaskTable(rawText) {
  const lines = rawText.split(/\r?\n/);
  const headerIdx = lines.findIndex((line) => line.startsWith("| ID |"));
  if (headerIdx < 0 || headerIdx + 2 >= lines.length) {
    return [];
  }

  const tasks = [];
  for (let i = headerIdx + 2; i < lines.length; i += 1) {
    const row = lines[i].trim();
    if (!row.startsWith("|")) {
      break;
    }

    const cells = row
      .split("|")
      .map((v) => v.trim())
      .filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1);

    if (cells.length < 14) {
      continue;
    }

    tasks.push({
      id: cells[0],
      workstream: cells[1],
      type: cells[2],
      title: cells[3],
      status: cells[4],
      priority: cells[5],
      risk: cells[6],
      owner: cells[7],
      dependsOn: cells[8]
    });
  }

  return tasks;
}

app.get("/api/idea", (req, res) => {
  try {
    const text = readText(ideaPath);
    res.json({
      ok: true,
      fields: parseIdea(text),
      raw: text
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
});

app.post("/api/idea", (req, res) => {
  try {
    const updates = req.body && req.body.fields ? req.body.fields : {};
    const current = readText(ideaPath);
    const next = updateIdea(current, updates);
    writeText(ideaPath, next);

    res.json({ ok: true, fields: parseIdea(next) });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
});

app.get("/api/tasks", (req, res) => {
  try {
    const text = readText(taskPath);
    const tasks = parseTaskTable(text);
    res.json({ ok: true, tasks });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
});

app.listen(port, () => {
  console.log(`MiniAgent dashboard running at http://localhost:${port}`);
});