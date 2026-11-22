# AI-DLC → DeepSeek Harness 移植评估与适配产物

> 目标：评估 [awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows)
> （AI-DLC，AI-Driven Development Life Cycle）能否移植到 DeepSeek Harness（DSH），
> 并尝试把它适配为 DSH 的 skill / agent preset。

## 结论（TL;DR）

**可行，且已产出可用的 DSH skill 形态的适配产物。** 分两层：

1. **方法论层（已移植）**：AI-DLC 的 5 阶段 / 33 关卡、11 个 workflow profile、
   3 档深度、3 档测试策略、14 个 agent、审批门、Plan Approval、问题驱动决策、
   评审循环、learnings/memory 学习闭环、四大原则 —— 这些**全部可以忠实迁移为 DSH 的
   skill（`aidlc`）**，因为 DSH 原生支持「按需加载的可复用任务指令」（skill）与
   「常驻工作区规则」（`AGENTS.md` 自动加载）。

2. **原生引擎层（未移植，属另一量级工程）**：AI-DLC 真正的强项是一个**确定性的
   TypeScript 引擎**（`core/tools/` 里的 `aidlc-*.ts`）+ **17 个 hook** + **134 种
   审计事件** + 原生 `aidlc` CLI。这些在 skill 形态里只能被「agent 自驱动循环 + 状态
   文件」近似，无法做到逐字节确定。要完整复刻，需要按官方的
   [Porting to a New Harness](https://github.com/awslabs/aidlc-workflows/blob/main/docs/harness-engineering/09-porting-to-a-new-harness.md)
   把 DSH 注册为第 8 个 harness（`harness/dsh/` + manifest + hook 适配器），那是另一个
   规模的工程（见下方「路线图」）。

## 原生 AI-DLC 架构 → DSH 能力映射

| AI-DLC 原生机制 | 在 DSH 的落点 | 保真度 |
|---|---|---|
| conductor `SKILL.md`（编排器） | DSH skill `aidlc/SKILL.md` | ✅ 忠实 |
| 阶段/关卡定义（33 个） | `references/phases-and-stages.md` | ✅ 忠实 |
| scope / profile（11 个 + 自适应 composer） | `references/scopes.md` | ✅ 忠实 |
| agent persona（14 个） | `references/roster.md` + DSH `subagent`/`subagent_fork` 分派 | ✅ 忠实（persona 文本 + 子代理） |
| 审批门 / 结构化问题 | DSH `ask_user_question` | ✅ 近似（原生有 AskUserQuestion 绑定） |
| 状态 `aidlc-state.md` + 审计 | 工作区 `aidlc/` 树 + `todo_write` | 🟡 近似（agent 自维护，非确定性） |
| 确定性引擎 + 路由 | 无等价物 → skill 内「循环 + 状态游标」 | ⚠️ 近似 |
| 17 个 hook（PreToolUse/Stop 等拦截） | 无等价物（DSH 有 `dsh-hooks-claude-code` 桥，但那是加载 Claude 的 hook） | ❌ 未移植 |
| `aidlc` CLI / doctor / 原生命令 | 无等价物 | ❌ 未移植 |
| 常驻规则（AGENTS.md/CLAUDE.md） | DSH `dsh-agent-instructions` 自动加载 `AGENTS.md` | ✅ 原生支持 |

关键结论：**skill 是正确且自然的载体**。DSH 的 skill 机制（`SKILL.md` + 前端元数据 +
`references/` 按需加载）与 AI-DLC 的「conductor skill + 按需加载的协议/知识文件」在
形态上几乎一一对应，这也是本次移植能做得忠实的原因。

## 已产出的文件

```
aidlc-dsh-port/
├── REPORT.md                     # 本文档
├── AGENTS.md.snippet             # 常驻规则片段（追加到项目 AGENTS.md）
├── dsh-aidlc                     # macOS / Linux / WSL 命令行入口（dsh-aidlc init）
├── dsh-aidlc.cmd                 # Windows 命令行入口（dsh-aidlc init）
└── skills/aidlc/
    ├── SKILL.md                  # conductor（编排器）：循环、四大原则、语气契约
    └── references/
        ├── phases-and-stages.md  # 5 阶段 / 33 关卡（lead/support/产物/条件）
        ├── scopes.md             # 11 个 profile + 路由矩阵 + 深度/测试策略 + composer
        ├── roster.md             # 14 个 agent + 拓扑 + 评审级别
        └── protocol.md           # 审批门/问题/Plan Approval/评审/learnings/状态与审计
```

## 安装与使用

### 方式 A：项目级（推荐，无需改动 profile）

把 `skills/aidlc/` 整个目录复制到项目内的任一扫描根，skill 即出现在该会话目录：

- `<项目根>/.dsh/skills/aidlc/`（rank 100）
- 或 `<项目根>/.agents/skills/aidlc/`（rank 200）

项目根 = 最近的 `.git` 祖先目录（无 `.git` 时用当前工作目录）。DSH 的
`skill-filesystem` 会扫描这些根并**自动发现**（新 skill 无需重启即可出现在目录里）。

### 方式 B：用户级（对所有项目生效）

复制到 `$DSH_HOME/skills/aidlc/`（rank 400）或 `~/.agents/skills/aidlc/`（rank 500）。

> **一键安装（`dsh-aidlc init`）**：仓库自带跨平台命令行。
> macOS / Linux / WSL：`chmod +x dsh-aidlc` 后 `./dsh-aidlc init`（或加进 PATH 后直接
> `dsh-aidlc init`）；Windows：`dsh-aidlc.cmd init`（或把本目录加进 PATH）。
> 子命令：`init`（安装/重装）、`update`（同 init）、`remove`、`status`、`help`。
> `init` 会把 `skills/aidlc/` 复制到 `$DSH_HOME/skills/aidlc/`
> （未设 `DSH_HOME` 时落到 `~/.dsh/skills/aidlc/`），并做干净重装。

### 方式 C：常驻规则（可选）

把 `AGENTS.md.snippet` 的内容追加到项目根 `AGENTS.md`（DSH 会自动加载 `AGENTS.md`）。
它承载「四大原则」的浓缩版 + 一行提示：当用户要求按 AI-DLC 方式工作时，加载 `aidlc`
skill。

### 使用

在会话中对 agent 说（中文/英文均可）：

- 「用 aidlc 建一个库存管理 REST API」→ 加载 `aidlc` skill，conductor 会提议 profile
  （stage/gate 数量）并等你确认后开始。
- 「aidlc bugfix：导出接口超时」→ 直接以 bugfix profile 开始。

## 已知局限

- **没有确定性引擎**：路由、阶段推进、审计由 agent 按 skill 自维护，同一输入的两次
  运行可能因模型而略有差异（这正是 AI-DLC 用引擎刻意避免的）。
- **没有 hook 拦截**：无法在 PreToolUse/Stop 层硬性阻断；审批门是「对话式」而非
  「钩子强制」的。
- **审计/审计事件**是文件追加的近似，不是 134 种结构化事件。
- **子代理 persona** 依赖 DSH `subagent` 的分派语义，模型路由/工具策略与原生
  `disallowedTools: Task` 等不完全对等。

## 下一步路线图（若要完整移植）

1. 在 `aidlc-workflows` 仓库里新增 `harness/dsh/`（`manifest.ts` + hook 适配器 +
   按官方 porting 指南在 `core/` 补齐 DSH 名字），把 DSH 作为第 8 个官方 harness ——
   这是「真正原生支持」的路径，需改上游仓库。
2. 或在本仓库侧写一个 DSH **bundle/plugin**（`ctx.skills.register(...)` 注册内嵌
   skill + 可选的 persona preset），实现 profile 级一键安装（本包未随附脚手架，因其
   需对 `skill-filesystem` 的 `customSkillDirs`/`bundledSkillDir` 与 Host/preset 挂载位
   置做实测验证，不宜空写）。
3. 若要「hook 级」拦截，评估 DSH 的 `@deepseek-ai/dsh-hooks-claude-code` 桥或
   Cordis 的 `tools/pre-execute` / `agent/pre-step` 瀑布监听，把 AI-DLC 的 6 个
   flow-altering hook 映射过来。

## 许可

上游 [aidlc-workflows](https://github.com/awslabs/aidlc-workflows) 使用
**MIT-0（MIT No Attribution）**。本移植复述了其方法论结构与术语；分发时建议在
`AGENTS.md.snippet` 或项目文档里注明来源（非强制，但属良好实践）。
