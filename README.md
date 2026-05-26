# Diamond Track Atlas / 钻石联赛运动员科普网站

Diamond Track Atlas 是一个面向田径爱好者的钻石联赛运动员科普网站。它展示运动员资料、项目科普、最近比赛记录、PB/SB 标记和数据核验状态。

本站不是官方数据源。所有成绩仅用于科普和学习参考，最终请以 Diamond League、World Athletics 等官方发布为准。`verified` 只代表本站人工核验过来源链接，不代表本站具有官方权威。

## 技术栈

- React 18 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Recharts
- Node scripts + tsx
- cheerio 用于 Node 侧公开网页解析

## 项目结构

```text
src/
  app/                  应用入口、路由、providers
  pages/                页面编排
  components/           UI 组件
    athletes/           运动员卡片、详情、成绩表
    compare/            对比面板
    data/               来源链接、核验状态、数据新鲜度
    events/             项目卡片
    layout/             Layout / Navbar / Footer
    ui/                 通用基础组件
  domain/athletics/     类型、常量、纯函数、校验
  data/
    manual/             人工维护的运动员和项目数据
    generated/          脚本生成的比赛结果和数据元信息
    index.ts            前端唯一稳定数据入口
  hooks/
  lib/

scripts/data/           数据同步、导入、校验和生成脚本
data-import/
  raw/                  手动导入源文件
  normalized/           标准化中间数据
  audit/                同步和导入审计报告
.github/workflows/     定时数据更新 PR
```

## 本地运行

```bash
npm install
npm run dev
npm run build
```

常用检查：

```bash
npm run data:validate
npm run check
```

## 数据流说明

前端页面只从 `src/data/index.ts` 读取数据：

```ts
import { athletes, competitionResults, dataMeta } from '../data';
```

最近比赛、PB、SB 不写在页面组件里，也不从运动员资料字段直接展示，而是从 `competitionResults` 通过 `src/domain/athletics/resultUtils.ts` 计算。每条比赛记录都带 `source`，UI 会展示来源链接和核验状态。

## 手动导入数据流程

1. 复制示例文件：

```powershell
Copy-Item data-import/raw/manual-results.example.json data-import/raw/manual-results.json
```

2. 填入比赛成绩。脚本会用 `athleteEnglishName` / `athleteName` 匹配 `athletes.manual.ts` 中的运动员。

3. 运行：

```bash
npm run data:normalize
npm run data:validate
npm run build
```

4. 如有未匹配运动员或缺字段，查看：

```text
data-import/audit/unmatched-athletes.md
data-import/audit/manual-results-missing-fields.md
```

手动导入脚本不会把输入中的 `verified` 自动升级为 `verified`。需要人工核验来源后，再在生成数据或 PR 中明确修改。

## 自动同步数据流程

自动同步只在 Node scripts 或 GitHub Actions 中运行，不会在浏览器前端请求 Diamond League 或 World Athletics 页面。

```bash
npm run data:sync
```

同步脚本会：

- 从 `scripts/data/sources.ts` 读取公开数据源。
- 用 `fetch + cheerio` 尝试解析官方公开页面。
- 成功时写入 `data-import/normalized/results.normalized.json` 和 `src/data/generated/*`。
- 自动同步生成的数据默认 `verified = "pending"`。
- 失败或页面结构不稳定时不猜测、不覆盖旧数据，只生成：
  - `data-import/audit/sync-report.json`
  - `data-import/audit/sync-report.md`

官方网页结构变化、JS 渲染、限流或网络问题都可能导致同步失败。失败时推荐走手动导入流程。

## 数据核验规则

- `pending`：脚本生成或待人工确认的数据。
- `verified`：人工核验过来源链接的数据。
- `unverified`：缺少可靠来源的数据。

PB/SB 只有在比赛记录中带 `recordTags: ["PB"]` 或 `["SB"]` 时才展示，并且仍会显示来源和核验状态。

## GitHub Actions 自动 PR

`.github/workflows/update-results.yml` 每天运行一次，也支持 `workflow_dispatch` 手动触发。

流程：

1. `npm ci`
2. `npm run data:sync`
3. `npm run data:validate`
4. `npm run build`
5. 若 `src/data/generated` 或 `data-import` 有变化，用 `peter-evans/create-pull-request` 创建 PR。

PR 标题：

```text
chore(data): update Diamond League results
```

推荐工作流：

1. GitHub Actions 定时同步。
2. 自动生成 PR。
3. 人工核验来源和 pending 数据。
4. 必要时把已核验记录改为 `verified`。
5. 合并 main。
6. Vercel 自动重新部署。

## 部署到 Vercel

Vercel 使用默认 Vite 构建即可：

```bash
npm run build
```

合并到 main 后由 Vercel 自动部署。前端构建产物不会包含任何官方页面抓取逻辑。

## 常见问题

**为什么自动同步没有生成新数据？**  
脚本只解析稳定的公开 HTML 表格。如果官方页面是 JS 渲染或结构变化，脚本会生成 audit 报告并保留旧数据。

**为什么自动同步的数据都是 pending？**  
自动化只能负责收集和标准化，不能替代人工核验。只有人工确认来源后才允许改为 `verified`。

**以后怎么添加新的比赛？**  
优先更新 `scripts/data/sources.ts`。如果自动解析失败，把成绩填入 `data-import/raw/manual-results.json` 后运行 `npm run data:normalize`。

**前端会不会直接抓官方网页？**  
不会。浏览器端只读取本项目已经生成的数据文件。
