---
title: 组件示例
date: 2026-11-17T10:00:00
categories: [文档]
tags: [短代码]
math: true
---

与英文版同路径，所以两篇互为翻译，导航栏的语言切换会直接跳到对方。

<!--more-->

> [!TIP]
> 提示框、标签页、数学公式等写法与英文版相同。

$$
E = mc^2
$$

{{< details "点击展开" >}}
折叠区块里可以写任意 Markdown，也可以放其他短代码。
{{< /details >}}

{{< friend name="Hugo" url="https://gohugo.io/" desc="静态网站生成器" tags="Go, SSG" >}}
{{< friend name="Prism" url="https://prismjs.com/" desc="代码高亮" tags="JavaScript" >}}

## 音乐播放器（APlayer）

网易云歌曲组成的播放列表，音频走网易云官方外链，标题和封面读 `data/music.toml`。播放时封面像唱片一样转动。

```text
{{</* music ids="1402719608, 1431168150" */>}}
{{</* music src="/audio/song.mp3" title="歌名" artist="我" cover="/img/cover.jpg" */>}}
```

{{< music ids="1402719608, 1431168150, 1402843948, 1847289377" >}}

## itch.io 游戏卡片

和 itch.io 官方嵌入挂件同尺寸、同布局，由主题根据 `data/itch.toml` 绘制，页面不请求 itch.io：

```text
{{</* itch url="https://lazy-v.itch.io/catmario-gb" desc="猫里奥的 Game Boy 版。" */>}}
```

{{< itch url="https://lazy-v.itch.io/catmario-gb" desc="猫里奥的 Game Boy 版。" >}}

## 链接卡片

{{< linkcard url="https://gohugo.io/" title="Hugo" desc="最快的静态网站生成框架之一。" >}}

## 任务列表

- [x] 把主题移植到 Hugo
- [x] 代码也用像素字体
- [ ] 多写点文章
