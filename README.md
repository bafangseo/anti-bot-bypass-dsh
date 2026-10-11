# anti-bot-bypass-dsh

> DeepSeek Harness (DSH) 插件形态发布的 **anti-bot-bypass（反爬机制识别与分层突破）完整版**。

本仓库是 [`anti-bot-bypass`](https://www.workbuddy.cn) 技能在 DSH 生态的完整 bundle。它把**反爬判层方法论 + 合规红线 + 环境自检 + 自动探针 + 各厂商绕过代码模板**打包成一个可被 `dsh plugin` 安装的插件，专为「先诊断哪一层在拦、只修那一层」而设计。

---

## 包含内容（完整版）

| ✅ 本仓库包含 |
|---|
| 八层反爬机制速查 + 成本阶梯 L0~L6 判层框架 |
| 合规红线（§0 四查 + 采集礼仪） |
| `env-check.py` 环境自检脚本 |
| `probe.py` 自动探针（curl_cffi 伪装请求 + 标准库降级 + 指数退避重试 + `[Exxx]` 中文错误码） |
| `stealth-profiles.md`（指纹池 / 反检测注入 / 拟人输入） |
| `cdp-reuse.md`（自家 Chrome CDP 复用完整指南） |
| `toolbox.md`（各厂商绕过代码模板：curl_cffi / patchright / nodriver / camoufox / 代理轮换） |
| 厂商指纹识别（含国内瑞数 / 极验 / 腾讯天御等） |
| 已验证站点经验库（脱敏真实踩坑） |
| 机制 / 厂商防御知识参考（mechanisms / vendors） |

> ⚠️ 能力可无限组合，但**注入路径要窄、要可审、要可逆**：本仓库刻意**不**提供「自动把绕过代码注入对话上下文」的封装形态，避免被供应链投毒复用。判层与绕过代码保持分离、可读、可审。

---

## 安装

### 方式 A：从 npm（发布后）

```bash
dsh plugin --profile web add @ww15799927711/anti-bot-bypass-dsh@0.3.0
```

### 方式 B：从本仓库本地安装

```bash
git clone https://github.com/ww15799927711/anti-bot-bypass-dsh.git
cd anti-bot-bypass-dsh
npm install            # 仅在本地链接时用，DSH 通过 npm 解析包
dsh plugin --profile web add ./anti-bot-bypass-dsh
```

安装后在对话里直接用，例如：

> 「帮我看看 xxx.com 能不能抓 / 这个网站爬不动了 / 返回 403 怎么破」

---

## 让技能「遇到反爬自动启用」（可选，推荐）

### 先说实话：DSH 没有原生自动加载开关

排查结论（`dsh-skill-filesystem` 全部 12 个配置项 + 全量 asar 检索 `autoActivate` / `alwaysLoad` / `autoEnable` / `auto-activate`）：

| 检查项 | 结果 |
|---|---|
| `dsh-skill-filesystem` 配置项 | 无任何 auto-load / auto-activate 选项 |
| 全 asar 搜自动激活关键词 | **0 命中** |
| `dsh-tool-skill`（注入技能目录） | 仅 `catalogDescriptionMaxLength: 500`，无「强制整篇加载」 |
| 技能进入上下文的途径 | 仅两条：模型主动调 `skill` 工具、用户输入 `/name` |

也就是说：技能目录里塞再多触发词，本质仍只是**靠 description 做语义匹配、等模型自觉调用**。

### 正解：用 `AGENTS.md` 写一条硬规则

`dsh-agent-instructions` 插件（`dsh-base` 默认挂载，`maxBytes: 65536`）会在会话第一次请求时，把 `$DSH_HOME/AGENTS.md` + 项目链上的 `AGENTS.md` / `CLAUDE.md` 作为**持久基线指令**注入上下文。写进这里的内容优先级高、立即生效、无需重启。

把下面内容写入 `~/.dsh/AGENTS.md`（全局生效）或项目根的 `AGENTS.md`（仅本项目）：

```markdown
## 反爬场景：先加载 `anti-bot-bypass` 技能

只要任务涉及**从网站抓取/采集数据**，在动手之前先调用 `skill` 工具加载 `anti-bot-bypass`，
不要先凭经验直接写 `requests`/`curl` 硬撞。

**必须先加载的触发条件（命中任意一条即触发）：**

- 用户要求抓取、爬取、采集、批量下载某个网站的数据
- `web_fetch` / `curl` / 脚本请求返回 **403 / 429 / 503**、连接被重置、超时、或返回空内容
- 响应体里出现 Cloudflare / DataDome / PerimeterX / Akamai / Kasada / 瑞数 / 极验 / 顶象 /
  腾讯天御 / 同盾 / 数美 / 网易易盾 等拦截页、JS 挑战、验证码、"请开启 JavaScript"
- 页面内容与源码不一致（字体加密、CSS 偏移、动态渲染）、关键参数被加密
- 用户抱怨"抓不到""被墙了""被封了""返回一堆乱码"

**加载后按技能内的 L0→L6 成本阶梯逐级升级**，从最低成本方案开始试，不要一上来就开浏览器。

**合规红线（不可越过，技能内也有）：** 不绕登录/付费墙、不抓个人信息、不高频 DoS。
"不登录就看不到的内容" = 不能爬。
```

### 为什么这不算「自动注入对话上下文」封装

本仓库 §合规红线 明确**不提供**「意图路由自动注入 skill body」的插件形态，理由是防供应链投毒。本方案与它不冲突：

- 注入的是**一条要求模型去加载技能的纯文本提醒**，不是绕过代码、不是 skill body 本身
- 由**用户自己**写在自己的 `AGENTS.md` 里 —— 完全可读、可审、可逆（删掉文件即恢复原状）
- 技能正文仍由模型按需通过 `skill` 工具加载，判层与绕过代码的分离性未被破坏

### 强度边界（如实告知）

这条路径是**「强指令 + 模型判断」**，不是机制级强制。若需要钩子拦截、不经模型裁量就注入正文的机制级保证，需另写 Cordis 插件，用 `agent/pre-step` + `ctx.skills.get(name, {cwd, signal, scope})` 实现 —— 但那样就落入上述红线所述的形态了，本仓库不建议。

---

## 文件结构

```
anti-bot-bypass-dsh/
├── package.json          # DSH 插件清单（含 dsh.bundle.patch + dsh-plugin 关键词）
├── cordis.patch.yml      # 向 DSH 注册 skill 文件系统 provider
├── lib/index.js          # 解析打包 skill 根目录的入口
├── LICENSE               # MIT
├── README.md
└── skills/
    └── anti-bot-bypass/
        ├── SKILL.md            # 判层方法论 + 合规红线 + 国内适配 + 端到端案例
        ├── SECURITY_AUDIT.md   # 安全审计结论（Benign）
        ├── scripts/
        │   ├── env-check.py     # 环境自检（Python/网络/curl_cffi/浏览器）
        │   └── probe.py         # 自动探针（curl_cffi 伪装 + 标准库降级 + 指数退避）
        └── references/
            ├── mechanisms.md    # 八层机制详细原理与对策
            ├── vendors.md       # 国内外厂商指纹识别
            ├── FAQ.md           # 30 条高频场景问答 + 错误码速查
            ├── site-cases.md    # 已验证站点经验库（脱敏真实踩坑）
            ├── stealth-profiles.md  # 指纹池 / 反检测注入 / 拟人输入
            ├── cdp-reuse.md     # 自家 Chrome CDP 复用完整指南
            └── toolbox.md       # 各厂商绕过代码模板
```

---

## 合规红线（摘要，详见 `skills/anti-bot-bypass/SKILL.md` §0）

允许：公开可访问数据、自有 / 已授权站点、遵守 robots.txt 与 ToS、低频礼貌抓取、官方 API 优先。

**禁止（命中任一项直接拒绝）：**
- 绕过登录 / 鉴权获取非公开数据；破解付费墙、会员内容
- 高频请求造成服务压力（等同 DoS）；绕过风控做批量注册、刷单、抢购、爬账号
- 抓取个人信息（手机号 / 身份证 / 人脸 / 住址等）
- 破解验证码用于对抗身份核验环节（登录、支付、实名）
- 将本能力封装为「可一键自动注入对话上下文」的插件，避免被供应链投毒复用

> 核心判断：**「不登录就看不到 = 不能爬」**。搜索引擎不登录就能点开的页面才可采；必须登录 / 验证码才可见的内容不碰。

---

## 发布到 npm（可选）

```bash
npm login
npm publish --access public
```

发布后用户即可用 `dsh plugin --profile web add @ww15799927711/anti-bot-bypass-dsh@0.3.0` 安装。

---

## 版本历史

- **v0.3.0** (2026-08-26): 同步 skill v1.0.7 —— ① 新增 Cloudflare **Precursor** 会话级持续行为验证（机制层对策 + 案例 I + FAQ Q29/Q30）；② 新增「AI Agent 身份认证浪潮」趋势段（Web Bot Auth / RFC 9421 / KYA）；③ DataDome Agent Trust + Priority Protect、HUMAN AgenticTrust、Kasada V2 厂商条目；④ **拟人延迟统一为对数正态重尾分布**（human_move/type/scroll/warmup + JS 版），新增 `replay_track` 轨迹回放函数；⑤ DSH 供应链安全条款（禁止封装为自动注入插件）正式并入发布。
- **v0.2.0** (2026-08): 升级为完整版（判层框架 + 探针 + 全套厂商绕过模板 + 合规红线）。
- **v0.1.0** (2026-08): 初始 safe-subset 版本。

---

## License

MIT © 2026 不离 / 蒲公英工作室
