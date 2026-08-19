# anti-bot-bypass-dsh

> DeepSeek Harness (DSH) 插件形态发布的 **anti-bot-bypass（反爬机制识别与分层突破）安全子集**。

本仓库是 [`anti-bot-bypass`](https://www.workbuddy.cn) 技能在 DSH 生态的「Skill-only bundle」。它把**反爬判层方法论 + 合规红线 + 环境自检**打包成一个可被 `dsh plugin` 安装的插件，专为「先诊断哪一层在拦、只修那一层」而设计。

---

## ⚠️ 这是「安全子集」（重要）

为降低公开传播面风险，本公开版**只含方法论与防御知识，不含可运行的绕过实现代码**：

| ✅ 本仓库包含 | 🔒 本仓库不含（仅在 SkillHub 完整版） |
|---|---|
| 八层反爬机制速查 + 成本阶梯 L0~L6 判层框架 | `probe.py` 自动探针（curl_cffi 伪装请求实现） |
| 合规红线（§0 四查）+ 采集礼仪 | `stealth-profiles.md`（指纹池 / 反检测注入） |
| `env-check.py` 环境自检脚本 | `cdp-reuse.md`（自家 Chrome CDP 复用指南） |
| 厂商指纹识别（含国内瑞数/极验/腾讯天御等） | `toolbox.md`（各厂商绕过代码模板） |
| 已验证站点经验库（脱敏真实踩坑） | 各厂商「开箱即爬」的绕过代码 |
| 机制/厂商**防御知识**参考（mechanisms/vendors） | — |

> 判层结论如需自动探针与各厂商绕过模板，请到 **SkillHub** 获取完整版。本仓库刻意保持「判层与绕过代码分离、可读、可审、可逆」，避免被供应链投毒复用。

---

## 安装

### 方式 A：从 npm（发布后）

```bash
# 需要先把本包 publish 到 npm（见下方「发布」）
dsh plugin --profile web add @ww15799927711/anti-bot-bypass-dsh@0.1.0
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
        ├── SKILL.md            # 判层方法论 + 合规红线 + 国内适配
        ├── SECURITY_AUDIT.md   # 安全审计结论（Benign）
        ├── scripts/
        │   └── env-check.py     # 环境自检（Python/网络/curl_cffi/浏览器）
        └── references/
            ├── mechanisms.md    # 八层机制详细原理与对策（防御知识）
            ├── vendors.md       # 国内外厂商指纹识别（防御知识）
            ├── FAQ.md           # 28 条高频场景问答 + 错误码速查
            └── site-cases.md    # 已验证站点经验库（脱敏真实踩坑）
```

---

## 合规红线（摘要，详见 `skills/anti-bot-bypass/SKILL.md` §0）

允许：公开可访问数据、自有/已授权站点、遵守 robots.txt 与 ToS、低频礼貌抓取、官方 API 优先。

**禁止（命中任一项直接拒绝）：**
- 绕过登录/鉴权获取非公开数据；破解付费墙、会员内容
- 高频请求造成服务压力（等同 DoS）；绕过风控做批量注册、刷单、抢购、爬账号
- 抓取个人信息（手机号/身份证/人脸/住址等）
- 破解验证码用于对抗身份核验环节（登录、支付、实名）
- 将本能力封装为「可一键自动注入对话上下文」的插件，避免被供应链投毒复用

> 核心判断：**「不登录就看不到 = 不能爬」**。搜索引擎不登录就能点开的页面才可采；必须登录/验证码才可见的内容不碰。

---

## 发布到 npm（可选）

```bash
npm login
npm publish --access public
```

发布后用户即可用 `dsh plugin --profile web add @ww15799927711/anti-bot-bypass-dsh@0.1.0` 安装。

---

## License

MIT © 2026 不离 / 蒲公英工作室
