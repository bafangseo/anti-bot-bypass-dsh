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
