---
title: Component showcase
date: 2026-11-17T10:00:00
categories: [Docs]
tags: [Shortcodes, Markdown]
toc: true
math: true
sticky: true
---

Everything the theme can render, on one page.

<!--more-->

## Alerts

> [!TIP]
> GitHub-style alerts become Bootstrap alerts.

> [!WARNING] Custom title
> Works with `NOTE`, `TIP`, `IMPORTANT`, `WARNING` and `CAUTION`.

{{< alert type="info" title="Shortcode version" >}}
The `alert` shortcode takes **Markdown** and code:

```bash
hugo server
```
{{< /alert >}}

## Tabs

{{< tabs >}}
{{< tab "macOS" >}}
```bash
brew install hugo
```
{{< /tab >}}
{{< tab "Windows" >}}
```powershell
winget install Hugo.Hugo.Extended
```
{{< /tab >}}
{{< /tabs >}}

## Icons

- {{< icon folder >}} `content/`
- {{< icon "fa fa-github" >}} GitHub

## Math

Inline $e^{i\pi} + 1 = 0$, and a block:

$$
f(n) = g(n) + h(n)
$$

## Mermaid

```mermaid
graph LR
  Markdown --> Hugo --> HTML
```

## Code

```csharp
public static T Add<T>(T a, T b) where T : INumber<T> => a + b;
```

## Inline extras

==Marked==, ++inserted++, H~2~O, x^2^, a badge {{< badge "New" "tip" >}}, an emoji :rocket:, and a footnote.[^1]

[^1]: Footnotes work out of the box.

## Chart

```chart
{ "type": "bar",
  "data": { "labels": ["2020", "2021", "2022"],
            "datasets": [{ "label": "Posts", "data": [21, 16, 17], "backgroundColor": "#2bbc8a" }] } }
```

## Long code (line numbers, copy button)

```text
line 1
line 2
line 3
line 4
line 5
line 6
line 7
line 8
line 9
line 10
line 11
line 12
line 13
line 14
line 15
line 16
line 17
line 18
line 19
line 20
line 21
line 22
line 23
line 24
line 25
line 26
line 27
line 28
line 29
line 30
line 31
line 32
```

## Images

A standalone image becomes a figure; the caption comes from its title or alt text. Click to open the lightbox.

![A pixel heart](/images/heart.png "Standalone images get a caption")

## Friend links

{{< friend name="Hugo" url="https://gohugo.io/" desc="The world's fastest framework for building websites" tags="Go, SSG" >}}
{{< friend name="Prism" url="https://prismjs.com/" desc="Lightweight syntax highlighting" tags="JavaScript" >}}

Consecutive cards form an equal-size, two-column grid; `tags` is a comma-separated list.

## Collapsible block

{{< details "Click to expand" >}}
The inside is regular Markdown: **bold**, `code`, lists and other shortcodes all work.

- one
- two
{{< /details >}}

## Music player

Embed a NetEase Cloud Music song, album or playlist (artist pages can't be embedded):

```text
{{</* netease 1234567890 */>}}
{{</* netease id="1234567" type="album" */>}}
```

## Music player (APlayer)

A playlist of NetEase Cloud Music songs, streamed from NetEase's own outer link; titles and covers come from
`data/music.toml`. The cover turns like a record while a song plays.

```text
{{</* music ids="1402719608, 1431168150" */>}}
{{</* music src="/audio/song.mp3" title="Song" artist="Me" cover="/img/cover.jpg" */>}}
```

{{< music ids="1402719608, 1431168150, 1402843948, 1847289377" >}}

## itch.io game card

Same size and layout as itch.io's embed widget, drawn by the theme from `data/itch.toml`, so the page makes no
requests to itch.io:

```text
{{</* itch url="https://lazy-v.itch.io/catmario-gb" */>}}
```

{{< itch url="https://lazy-v.itch.io/catmario-gb" >}}

## Link card

```text
{{</* linkcard url="https://gohugo.io/" title="Hugo" desc="The world's fastest framework for building websites." */>}}
```

{{< linkcard url="https://gohugo.io/" title="Hugo" desc="The world's fastest framework for building websites." >}}

## Task list

- [x] Port the theme to Hugo
- [x] Pixel fonts for code too
- [ ] Write more posts
