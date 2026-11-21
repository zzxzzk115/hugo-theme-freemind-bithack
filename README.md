# freemind.bithack for Hugo

A dark, terminal-style blog theme — a Hugo port of [hexo-theme-freemind.bithack](https://github.com/Ares-X/hexo-theme-freemind.bithack), recreating the author's own modified version of it (red accents, a Chinese pixel font, icon font). No Node and no jQuery: just the Hugo binary (≥ 0.156, standard edition is enough) and one small script.

**Demo:** https://zzxzzk115.github.io/hugo-theme-freemind-bithack/ (built from [exampleSite](exampleSite) by GitHub Actions)

![screenshot](images/screenshot.png)

**Features**: multilingual with language switcher and a browser-language prompt · instant search in a navbar dialog (`/` or Ctrl+K; digital-rain backdrop and typed prompt) · RSS, Atom and JSON Feed with full text · build-time KaTeX math (MathML) · Mermaid · Chart.js charts · code blocks via Prism.js (line numbers, language label, copy) · pixel-font code (inline and blocks) · pixel task-list checkboxes · reader mode (R) · CJK pixel font · optional site-wide pixel font (params.bodyFont) · read on your phone (QR code of the page, at the section you are reading) · heading anchors · sticky TOC with scroll spy · reading time, word count, reading progress · series navigation · related posts · prev/next with titles · breadcrumbs · image captions and a pixel-style image viewer (PhotoSwipe: pinch / double-tap zoom, swipe, Back to close) · in-page PDF reader (PDF.js: loads only the pages being read, page links, full screen, selectable text) · GitHub-style alerts · tabs / alert / badge / icon / video / pdf / bilibili / music (APlayer, spinning record cover) / netease / itch (itch.io game card, drawn locally) / linkcard / details / gallery / friend / embed shortcodes · giscus comments with a matching pixel theme · page views · share buttons (device share menu on phones, QQ Zone, and WeChat via QR code) · analytics (GA, Umami, Plausible, GoatCounter, Cloudflare, Baidu) · Open Graph, Twitter cards, JSON-LD, hreflang · author card · year timeline · pinned posts · dropdown menus with foldable nested groups · 404 page that finds the same page in the other language · print styles · web manifest.

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

[hexo-theme-freemind.bithack](https://github.com/Ares-X/hexo-theme-freemind.bithack) 的 Hugo 移植版，复刻的是作者当年魔改过的版本（在原版黑底绿链接上加了红色点缀、中文像素字体和图标字体），构建只要 Hugo 单文件，不需要 Node；前端不依赖 jQuery / Bootstrap JS，只有一个约 9 KB 的 `theme.js`。

只提供暗色，这是主题本身的风格。

### 功能

| 类别 | 功能 | 用法 / 配置 |
| --- | --- | --- |
| 列表 | 首页分页、摘要、置顶 | `<!--more-->` 或自动摘要（`autoExcerpt`）；`sticky: true` |
| | 归档、分类、标签、时间线 | `/archives/`（`layout: archives`）；侧边栏 `timeline` 挂件 |
| | 栏目页、面包屑 | 目录的 `_index.md`；`breadcrumbs` |
| 多语言 | 浏览器语言与页面不同时，左下角像素风提示切换（有译文跳译文，否则跳该语言首页；记住选择，不自动跳转） | `langPrompt = false` 关闭；文案在 `data/langprompt.toml`，站点可覆盖 |
| 阅读 | 目录（默认开启，滚动高亮，桌面端吸附） | `tocDefault`；单篇 `toc: false` |
| | 标题锚点 | `headingAnchors` |
| | 代码块：[Prism.js](https://prismjs.com) 官方插件（行号、语言标签、复制、行高亮）；单行不显示行号；只在有代码的页面加载 | `prismCDN`；单块 ```` ```go {linenos=false hl_lines="2-3"} ```` |
| | 纯享阅读：单栏、易读字体、柔和配色（按 R 切换，Esc 退出，记住选择） | 文章页右下角按钮 |
| | 代码字体：行内代码和代码块都用像素字体，与正文一致；纯享阅读时切回 Fira Code | |
| | 手机阅读：右下角按钮弹出本页二维码（宽屏显示），扫码后跳到正在读的小节 | `qrCode = false` 关闭；`qrCDN` |
| | 字数、阅读时间、更新日期、原创标记、阅读进度条 | `lastmod`、`original: true` |
| | 摘要说明：`description` 用于 meta 标签和链接提示，默认不在正文显示（文章开头通常就是同一句话） | 单篇 `showDescription: true` 在正文顶部显示为提示框 |
| | 系列导航（同一子目录下的文章） | `seriesNav`；单篇 `series: false` |
| | 上一篇 / 下一篇（显示标题，全站按时间） | |
| | 相关文章（各语言结果一致：按标签/分类的统一键计分） | `relatedPosts`；跨语言的标签对应写在站点 `data/terms.toml` |
| | 图片注释（单独成段的图片用 title / alt 作 figcaption）、图片查看器（[PhotoSwipe](https://photoswipe.com) 5，MIT，随主题附带在 `assets/js/vendor/`，点图时才加载；像素风按钮与图标，双指 / 双击放大、左右滑切换、下滑或返回键关闭） | `imageCaptions`；单张不要注释：图片下一行写 `{.no-caption}` |
| | 在 GitHub 上编辑 | `editURL` |
| Markdown | 数学公式（构建时 KaTeX → MathML） | `math: true` 或 `math = "always"` |
| | Mermaid、Chart.js 图表 | ` ```mermaid `、` ```chart `（Chart.js JSON 配置） |
| | 提示框 `> [!TIP]`、`==标记==`、`H~2~O`、`x^2^`、脚注、emoji | 见 exampleSite 的 markup 配置 |
| | 任务列表 `- [ ]` / `- [x]`：像素方框代替项目符号，勾选为绿底黑勾 | |
| 导航 | 即时搜索：顶栏按钮弹出对话框（`/` 或 Ctrl+K；背景虚化 + 数字雨、打字提示，方向键选择，关键词高亮；系统开启“减少动态效果”时只显示静态一帧） | 输出 `search.json`；`searchEffects = "always"` 无视减少动态效果设置（同样作用于音乐播放器的旋转唱片封面） |
| | 下拉菜单（可多层嵌套：二级分组默认展开、三级及以下默认折叠；点右侧三角折叠/展开）、多语言切换 | 菜单项 `parent`（子项的 `parent` 指向二级项的 `identifier` 即为折叠分组；二级分组加 `params.folded = true` 则默认折叠）；有译文跳译文 |
| | 作者卡片（头像、简介、统计、社交图标，微信号点击复制）。像素画头像设 `pixels = 32`（网格边长），按屏幕物理像素取整数倍显示，150% 缩放下也不糊不歪 | `authorCard`（`pixels`）、`[[social]]`（`copy = "…"`） |
| 互动 | giscus / Valine 评论（文章和普通页面都有，页面可 `comments: false` 关闭）。giscus 默认用主题自带的像素主题（像素字体、直角、绿色按钮）；它只能从公网 https 地址加载，所以 `hugo server` 本地预览时用 giscus 自带的暗色主题 | `[comments]`、`[comments.giscus] theme`（默认 `"pixel"`，也可填 giscus 主题名或 CSS 地址）、`onPages` |
| | 阅读量（不蒜子 / Vercount） | `[pageviews] provider` |
| | 分享（系统分享菜单、X、LinkedIn、Reddit、Telegram、微博、QQ空间、微信、邮件、复制链接）。「分享…」调起设备自带的分享菜单（Web Share API，只在支持它的触屏设备上出现），手机上分享栏随之精简为 分享… / 复制链接（微信、QQ 等都在系统菜单里）。微信没有网页分享接口：宽屏弹出本页二维码，微信扫码后点「···」分享到朋友圈；手机上复制链接 | `share`（`"native"` 即「分享…」） |
| | 统计（GA、Umami、Plausible、GoatCounter、Cloudflare、百度） | `[analytics]`，仅生产构建 |
| SEO / 订阅 | canonical、hreflang、Open Graph、Twitter Card、JSON-LD、sitemap、robots | 自动 |
| | RSS、Atom、JSON Feed（默认全文） | `[feed] fullText`、`limit` |
| | AI 翻译提示（链接到原文） | `aiTranslated: true` |
| 其他 | 404 页：同路径在另一种语言存在时自动跳过去（适合只写了一种语言的文章）。打印样式、web manifest、移动端适配、长链接自动换行；子目录部署时 `/img/a.png` 这类根路径自动补上 baseURL 路径 | 自动 |
| 字体 | Fixedsys（拉丁）+ [Fusion Pixel 12px](https://github.com/TakWolf/fusion-pixel-font)（中日韩，OFL；按字频拆成三片 woff2，按 unicode-range 只下载页面用到的分片，常用字约 100 KB，见 `tools/split_fusion_pixel.py`） | |
| | 站点像素字体（可选）：设置后全站文字（正文、标题、导航、侧栏、代码块）都换成指定的像素字体；字号保持主题原有比例，整体按正文字号等比缩放（默认正文 16px，主题原本是 18px）。版面各块会微移不到一个设备像素，让文字起点落在整像素上（居中布局、奇数窗口宽度、125%/150% 缩放时都更清晰）。字体文件放在站点自己的 `static/` 里，主题不附带。纯享阅读模式不受影响 | `[params.bodyFont] family = "…" src = "fonts/x.woff2" sizes = { text = 16 }` |

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
- `{{< pdf src="/paper.pdf" title="论文" id="paper" height="720px" >}}`：页内 PDF 阅读器（[PDF.js](https://mozilla.github.io/pdf.js/)，Apache-2.0，只在有阅读器的页面从 CDN 加载，`params.pdfjsCDN` 可改）。用范围请求按需下载：阅读器滚到眼前才开始加载，只下载正在看的那几页，大文件也能马上打开（服务器要支持 Range；跨站文件还要在 CORS 里暴露 `Accept-Ranges`，否则会整份下载）。工具栏：翻页、页码、缩放 / 适合宽度、全屏（Esc 退出）、复制本页链接（`#<id>-p<页码>`，打开即跳到那一页）、下载；文字可选中
- `{{< video src="/a.mp4" poster="/a.jpg" >}}`、`{{< bilibili BV1554y1D7a1 >}}`、Hugo 自带的 `{{< youtube id >}}`
- `{{< music ids="1402719608, 1847289377" >}}`：APlayer 音乐播放器（像素绿皮肤、播放列表、LRC 歌词），只在用到的页面加载。网易云歌曲走网易云官方外链音频（仅限可免费播放的歌），标题、歌手、封面、歌词读 `data/music.toml`；也可以放自己的音频：`{{< music src="/audio/a.mp3" title="…" artist="…" cover="…" lrc="/audio/a.lrc" >}}`。选项 `fold="true"` 折叠列表，`order="random"` 随机，`loop="none|one|all"`
  `data/music.toml` 的格式（每首一节，按歌曲 ID）：`["1402719608"]` 下写 `title`、`artist`、`album`、`cover`、`lrc`（可选）。网易云封面面向圆形唱片显示，播放时顺时针转动、暂停时停住；系统开启“减少动态效果”时不转（`searchEffects = "always"` 例外）
- `{{< projects featured="6" >}}` / `{{< projects filter="true" >}}` / `{{< projects group="porting" >}}` / `{{< projects ids="a, b" >}}`：项目卡片网格（图片、类别与标签、GitHub 像素星标与 star 数、标题、简介、状态、链接按钮，GitHub 链接带图标）。`featured` 取前 N 个精选项目，`filter` 显示全部并带类别筛选按钮，`group` 只列 `groups` 含该值的项目、按 `groupOrder` 排序（可与前两者组合），`ids` 按给定顺序列出指定项目。数据默认来自 `data/projects.json`，也可以在站点里覆盖 `_partials/func/projects-data.html`，从别处（如项目 catalog）生成同样结构的卡片、译文和 star 数（数组：`id title desc category tags status order featured image imageFit page repo links[{label href}] groups groupOrder`），译文在 `data/projects_<语言>.(json|toml|yaml)`（`<id>: {title desc status page hrefs}`，`hrefs` 按链接顺序给出该语言的地址；`labels` 译链接文字），类别名用 i18n 键 `project_cat_<category>`；star 数在 `data/github_stars.json`（`{"owner/repo": n}`），仓库取 `repo`，否则取 `Source` 链接；`page`/`href` 可写内容路径（如 `/posts/my-post`），自动链到当前语言的那篇；没有 `image` 的项目显示像素风占位，`imageFit = "pixel"` 按像素画放大
- `{{< pagelist "/posts/a, /posts/b" >}}`：按内容路径列出几篇文章（日期 + 当前语言的标题），适合「相关文章」
- `{{< itch url="https://user.itch.io/game" >}}`：itch.io 游戏卡片，和 itch 官方嵌入挂件同尺寸（552×167）同布局，但由主题绘制，页面不请求 itch.io（官方挂件会被 itch 限流成空白）。资料写在 `data/itch.toml`：`["https://user.itch.io/game"]` 下写 `title`、`author`、`desc`、`cover`（站内图片路径）、`pixel = true`（像素封面不模糊）；单篇可用 `desc="…"` 等参数覆盖（比如中文译文）
- `{{< netease 1847289377 >}}`：网易云音乐外链播放器（`type="album"` / `"playlist"` 播放专辑、歌单；歌手页不能外链，有版权限制的歌曲在外链里放不了）
- `{{< details "标题" >}} …Markdown… {{< /details >}}`：可折叠区块（`open="true"` 默认展开）
- `{{< linkcard url="…" title="…" desc="…" image="/img/…" >}}`：链接卡片（类似 Notion / FlowUs 的书签），左边标题、描述和站点，右边图片，整张卡片可点击；只有 `url` 是必填
- `{{< gallery grid >}}` 每行一张图（可写 `路径 | 说明`）：缩略图网格，点开进灯箱；`{{< gallery grid pixel >}}` 适合像素图；不带 `grid` 则是原来的幻灯片
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
