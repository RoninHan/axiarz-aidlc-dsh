# AI-DLC for DeepSeek Harness

把 AWS 的 AI-DLC（[awslabs/aidlc-workflows](https://github.com/awslabs/aidlc-workflows)）
方法论移植到 DeepSeek Harness（DSH）的 skill：5 阶段 / 33 关卡、11 个 workflow profile、
审批门、14 个 agent、Plan Approval、learnings 学习闭环。

## 一键安装

macOS / Linux / WSL：

```bash
curl -fsSL https://raw.githubusercontent.com/RoninHan/axiarz-aidlc-dsh/main/install.sh | sh
```

Windows PowerShell：

```powershell
irm https://raw.githubusercontent.com/RoninHan/axiarz-aidlc-dsh/main/install.ps1 | iex
```

装好后，在任意 DSH 会话里说「用 aidlc 建一个 …」即可触发。

## 手动安装

```bash
./dsh-aidlc init      # macOS / Linux / WSL
dsh-aidlc.cmd init    # Windows
```

子命令：`init`（安装/重装）、`update`、`remove`、`status`、`help`。

## 文档

- [REPORT.md](REPORT.md) — 移植评估、能力映射、局限与路线图
- [skills/aidlc/SKILL.md](skills/aidlc/SKILL.md) — conductor（编排器）本体
- [AGENTS.md.snippet](AGENTS.md.snippet) — 常驻规则片段（可选）

## 许可

上游 AI-DLC 使用 MIT-0。本移植复述其方法论结构与术语；分发时建议注明来源。
