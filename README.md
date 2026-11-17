# freemind.bithack for Hugo

A dark, terminal-style blog theme — a Hugo port of [hexo-theme-freemind.bithack](https://github.com/Ares-X/hexo-theme-freemind.bithack). Same look, no Node and no jQuery: just the Hugo binary (≥ 0.146, standard edition is enough) and one small script.

**Demo:** https://zzxzzk115.github.io/hugo-theme-freemind-bithack/ (built from [exampleSite](exampleSite) by GitHub Actions)

![screenshot](images/screenshot.png)

**Features**: multilingual with language switcher · instant search (`/` or Ctrl+K) · RSS, Atom and JSON Feed with full text · build-time KaTeX math (MathML) · Mermaid · Chart.js charts · code blocks via Prism.js (line numbers, language label, copy) · reader mode (R) · CJK pixel font · heading anchors · sticky TOC with scroll spy · reading time, word count, reading progress · series navigation · related posts · prev/next with titles · breadcrumbs · image captions and lightbox · GitHub-style alerts · tabs / alert / badge / icon / video / pdf / bilibili / gallery / friend / embed shortcodes · giscus comments · page views · share buttons · analytics (GA, Umami, Plausible, GoatCounter, Cloudflare, Baidu) · Open Graph, Twitter cards, JSON-LD, hreflang · author card · year timeline · pinned posts · dropdown menus · print styles · web manifest.

Dark only, on purpose — it is the theme's identity.

## Quick start

```bash
git submodule add https://github.com/zzxzzk115/hugo-theme-freemind-bithack.git themes/freemind-bithack
```

Set `theme = "freemind-bithack"` and copy `[outputs]`, `[pagination]`, `[related]` and `[markup]` from [exampleSite/hugo.toml](exampleSite/hugo.toml) into your site config (Hugo does not merge those from themes). Every theme option is documented in [hugo.toml](hugo.toml).

Run the demo locally:

```bash
hugo server -s exampleSite --themesDir ../..
```

Sites served from a subdirectory (e.g. `baseURL = "https://you.github.io/blog/"`) work as-is: root-relative paths in content such as `/img/a.png` get the base path automatically.

## License

[MIT](LICENSE). Based on hexo-theme-freemind.bithack (© 2015 blackshow, MIT) and hexo-theme-freemind (© 2013 Joseph Pan, MIT). Bundled assets keep their own licenses (see LICENSE).

---

## 中文说明

[hexo-theme-freemind.bithack](https://github.com/Ares-X/hexo-theme-freemind.bithack) 的 Hugo 移植版：外观保持原样（暗色终端风、像素字体），构建只要 Hugo 单文件，不需要 Node；前端不依赖 jQuery / Bootstrap JS，只有一个约 9 KB 的 `theme.js`。

只提供暗色，这是主题本身的风格。

### 功能

| 类别 | 功能 | 用法 / 配置 |
| --- | --- | --- |
| 列表 | 首页分页、摘要、置顶 | `<!--more-->` 或自动摘要（`autoExcerpt`）；`sticky: true` |
| | 归档、分类、标签、时间线 | `/archives/`（`layout: archives`）；侧边栏 `timeline` 挂件 |
| | 栏目页、面包屑 | 目录的 `_index.md`；`breadcrumbs` |
| 阅读 | 目录（默认开启，滚动高亮，桌面端吸附） | `tocDefault`；单篇 `toc: false` |
| | 标题锚点 | `headingAnchors` |
| | 代码块：[Prism.js](https://prismjs.com) 官方插件（行号、语言标签、复制、行高亮）；单行不显示行号；只在有代码的页面加载 | `prismCDN`；单块 ```` ```go {linenos=false hl_lines="2-3"} ```` |
| | 纯享阅读：单栏、易读字体、柔和配色（按 R 切换，Esc 退出，记住选择） | 文章页右下角按钮 |
| | 字数、阅读时间、更新日期、原创标记、阅读进度条 | `lastmod`、`original: true` |
| | 系列导航（同一子目录下的文章） | `seriesNav`；单篇 `series: false` |
| | 上一篇 / 下一篇（显示标题，全站按时间） | |
| | 相关文章（各语言结果一致：按标签/分类的统一键计分） | `relatedPosts`；跨语言的标签对应写在站点 `data/terms.toml` |
| | 图片注释（单独成段的图片用 title / alt 作 figcaption）、灯箱 | `imageCaptions` |
| | 在 GitHub 上编辑 | `editURL` |
| Markdown | 数学公式（构建时 KaTeX → MathML） | `math: true` 或 `math = "always"` |
| | Mermaid、Chart.js 图表 | ` ```mermaid `、` ```chart `（Chart.js JSON 配置） |
| | 提示框 `> [!TIP]`、`==标记==`、`H~2~O`、`x^2^`、脚注、emoji | 见 exampleSite 的 markup 配置 |
| 导航 | 即时搜索（`/` 或 Ctrl+K，方向键选择，关键词高亮） | 输出 `search.json` |
| | 下拉菜单、多语言切换 | 菜单项 `parent`；有译文跳译文 |
| | 作者卡片（头像、简介、统计、社交图标，微信号点击复制） | `authorCard`、`[[social]]`（`copy = "…"`） |
| 互动 | giscus / Valine 评论（文章和普通页面都有，页面可 `comments: false` 关闭） | `[comments]`、`onPages` |
| | 阅读量（不蒜子 / Vercount） | `[pageviews] provider` |
| | 分享（X、LinkedIn、Reddit、Telegram、微博、邮件、复制链接） | `share` |
| | 统计（GA、Umami、Plausible、GoatCounter、Cloudflare、百度） | `[analytics]`，仅生产构建 |
| SEO / 订阅 | canonical、hreflang、Open Graph、Twitter Card、JSON-LD、sitemap、robots | 自动 |
| | RSS、Atom、JSON Feed（默认全文） | `[feed] fullText`、`limit` |
| | AI 翻译提示（链接到原文） | `aiTranslated: true` |
| 其他 | 打印样式、web manifest、移动端适配、长链接自动换行；子目录部署时 `/img/a.png` 这类根路径自动补上 baseURL 路径 | 自动 |
| 字体 | Fixedsys（拉丁）+ [Fusion Pixel 12px](https://github.com/TakWolf/fusion-pixel-font)（中日韩，OFL，按 unicode-range 只在有中文时加载） | |

### 跨语言的标签 / 分类

同一个标签在不同语言里写法不同时（`Algorithms` / `算法`），在站点 `data/terms.toml` 里登记对应关系，文章本身不用改：

```toml
[tags."Algorithms"]
zh = "算法"
[categories."Programming Languages"]
zh = "编程语言"
```

相关文章会把它们视为同一个标签，标签/分类页的语言切换也会跳到对应的页面。

### 归档分时期

在站点 `data/eras.toml` 里按日期划分时期，归档页会先按时期、再按年份分组（没有这个文件就只按年份）：

```toml
[[eras]]
from = "2022-11-01"            # 不写 to 表示至今
title = { en = "Work & PhD", zh = "工作与读博" }
note = { en = "VuePress Theme Hope", zh = "VuePress Theme Hope 时期" }

[[eras]]
from = "2020-10-01"
to = "2022-10-31"
title = { en = "Growing Up", zh = "日渐成熟" }
```

### 短代码

- `{{< alert type="warning" title="注意" >}}**Markdown**{{< /alert >}}`：提示框
- `{{< tabs >}}{{< tab "macOS" >}}…{{< /tab >}}{{< tab "Linux" >}}…{{< /tab >}}{{< /tabs >}}`：标签页
- `{{< badge "New" "tip" >}}`：徽章
- `{{< icon folder >}}`：行内 Font Awesome 4 图标
- `{{< video src="/a.mp4" poster="/a.jpg" >}}`、`{{< pdf "/paper.pdf" >}}`、`{{< bilibili BV1554y1D7a1 >}}`、Hugo 自带的 `{{< youtube id >}}`
- `{{< embed src="/GameSrc/CatMarioGB/" ratio="4:3" >}}`：iframe，可嵌网页游戏
- `{{< gallery >}}` 每行一个图片路径 `{{< /gallery >}}`：轮播图
- `{{< friend name="…" url="…" desc="…" avatar="…" tags="标签1, 标签2" >}}`：友链卡片（连续的卡片排成等大的两列网格，`tags` 为逗号分隔的标签）

### 扩展

所有扩展都放在**站点**目录里，不需要改主题：

- **短代码**：`layouts/_shortcodes/xxx.html`，同名覆盖主题自带的。
- **侧边栏挂件**：`layouts/_partials/widgets/<name>.html`，再把 `<name>` 加进 `params.widgets`。
- **渲染钩子**：`layouts/_markup/render-{link,image,heading,blockquote,passthrough,codeblock,codeblock-<lang>}.html`。
- **插入点**：`layouts/_partials/hooks/{head-end,footer-end,body-end}.html`。
- **样式**：`assets/css/custom.css` 自动打包进样式表末尾。
- **脚本**：`theme.js` 初始化后会在 `document` 上派发 `theme:ready` 事件。

### 依赖

| 依赖 | 版本 | 说明 |
| --- | --- | --- |
| Font Awesome | 4.7.0 | 只保留 woff2 / woff |
| Bootstrap CSS | 3.x（原主题定制版） | 只用样式；Bootstrap JS 已移除 |
| jQuery、fancyBox、imagesLoaded | 已移除 | 由 `theme.js` 替代 |
| Prism.js / Mermaid / Chart.js / KaTeX CSS | 1.30.0 / 11.4.1 / 4.4.1 / 0.16.22 | CDN，仅在用到的页面加载 |
| Fusion Pixel Font | 2026.11.10（12px proportional zh_hans） | 随主题分发，SIL OFL 1.1 |
