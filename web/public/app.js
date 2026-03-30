const form = document.getElementById("ideaForm");
const saveStatus = document.getElementById("saveStatus");
const reloadBtn = document.getElementById("reloadBtn");
const pickBackgroundFolderBtn = document.getElementById("pickBackgroundFolderBtn");
const pickBackgroundFolderInput = document.getElementById("pickBackgroundFolderInput");
const pickOutputFolderBtn = document.getElementById("pickOutputFolderBtn");
const pickOutputFolderInput = document.getElementById("pickOutputFolderInput");
const gitOpsFieldset = document.getElementById("gitOpsFieldset");
const gitOpsNotice = document.getElementById("gitOpsNotice");
const viewButtons = Array.from(document.querySelectorAll(".view-btn"));
const viewMap = {
  settings: document.getElementById("viewSettings"),
  monitor: document.getElementById("viewMonitor")
};

function setStatus(text, isError = false) {
  saveStatus.textContent = text;
  saveStatus.style.color = isError ? "#f85149" : "#8b949e";
}

function collectFormValues() {
  const payload = {};
  const fd = new FormData(form);
  for (const [key, value] of fd.entries()) {
    payload[key] = String(value || "").trim();
  }
  return payload;
}

function fillForm(fields) {
  Object.entries(fields || {}).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = value || "";
    }
  });

  refreshGitOptionState();
}

function refreshGitOptionState() {
  const githubUrl = String(form.elements.githubUrl?.value || "").trim();
  const enabled = Boolean(githubUrl);

  if (gitOpsFieldset) {
    gitOpsFieldset.disabled = !enabled;
    gitOpsFieldset.classList.toggle("is-disabled", !enabled);
  }

  if (gitOpsNotice) {
    gitOpsNotice.textContent = enabled
      ? "已启用 Git 自动提交流程设置。"
      : "填写 GitHub 链接后可设置自动 commit / push。";
  }

  if (!enabled) {
    form.elements.autoCommit.value = "";
    form.elements.autoPush.value = "";
  }
}

function switchView(nextView) {
  Object.entries(viewMap).forEach(([name, host]) => {
    if (!host) {
      return;
    }
    host.classList.toggle("is-active", name === nextView);
  });

  viewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === nextView);
  });
}

function extractFolderLabel(fileInput) {
  const list = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
  if (!list.length) {
    return "";
  }

  const rel = list[0].webkitRelativePath || list[0].name || "";
  const topDir = rel.split("/")[0] || rel;
  return topDir ? `./${topDir}` : "";
}

function appendFolderToTextarea(textareaName, folderLabel) {
  if (!folderLabel) {
    return;
  }

  const target = form.elements[textareaName];
  if (!target) {
    return;
  }

  const current = String(target.value || "").trimEnd();
  target.value = current ? `${current}\n${folderLabel}` : folderLabel;
}

async function loadIdea() {
  const res = await fetch("/api/idea");
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.error || "Failed to load IDEA");
  }
  fillForm(data.fields);
}

function cardHtml(task) {
  const safe = (v) => String(v ?? "");
  return `<article class="card" data-status="${safe(task.status)}">
    <strong>${safe(task.id)} · ${safe(task.title)}</strong>
    <div class="meta">${safe(task.workstream)} | ${safe(task.type)} | ${safe(task.priority)} | risk=${safe(task.risk)}</div>
  </article>`;
}

function renderLane(id, tasks) {
  const host = document.getElementById(id);
  host.innerHTML = tasks.length ? tasks.map(cardHtml).join("") : "<p class=\"meta\">暂无任务</p>";
}

async function loadTasks() {
  const res = await fetch("/api/tasks");
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.error || "Failed to load tasks");
  }

  const tasks = Array.isArray(data.tasks) ? data.tasks : [];
  renderLane(
    "laneInProgress",
    tasks.filter((t) => t.status === "InProgress")
  );
  renderLane(
    "laneTodo",
    tasks.filter((t) => t.status === "Todo")
  );
  renderLane(
    "laneBlocked",
    tasks.filter((t) => t.status === "Blocked")
  );
  renderLane(
    "laneDone",
    tasks.filter((t) => t.status === "Done")
  );
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  refreshGitOptionState();
  setStatus("保存中...");

  try {
    const res = await fetch("/api/idea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: collectFormValues() })
    });
    const data = await res.json();
    if (!data.ok) {
      throw new Error(data.error || "Failed to save IDEA");
    }

    fillForm(data.fields);
    setStatus("已写入 IDEA.md");
  } catch (err) {
    setStatus(`保存失败: ${err.message}`, true);
  }
});

reloadBtn.addEventListener("click", async () => {
  try {
    await loadIdea();
    await loadTasks();
    setStatus("已重新加载");
  } catch (err) {
    setStatus(`加载失败: ${err.message}`, true);
  }
});

pickBackgroundFolderBtn.addEventListener("click", () => {
  pickBackgroundFolderInput.click();
});

pickBackgroundFolderInput.addEventListener("change", () => {
  const label = extractFolderLabel(pickBackgroundFolderInput);
  appendFolderToTextarea("backgroundInfoNotes", label);
  if (label) {
    setStatus(`已插入路径: ${label}`);
  }
});

pickOutputFolderBtn.addEventListener("click", () => {
  pickOutputFolderInput.click();
});

pickOutputFolderInput.addEventListener("change", () => {
  const label = extractFolderLabel(pickOutputFolderInput);
  appendFolderToTextarea("expectedOutputNotes", label);
  if (label) {
    setStatus(`已插入路径: ${label}`);
  }
});

form.elements.githubUrl.addEventListener("input", () => {
  refreshGitOptionState();
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    switchView(button.dataset.viewTarget);
  });
});

(async function boot() {
  try {
    await loadIdea();
    await loadTasks();
    switchView("settings");
    setStatus("初始化完成");
  } catch (err) {
    setStatus(`初始化失败: ${err.message}`, true);
  }

  setInterval(async () => {
    try {
      await loadTasks();
    } catch (_) {
      // Keep silent during periodic refresh.
    }
  }, 3000);
})();