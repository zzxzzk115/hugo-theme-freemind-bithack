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

{{< friend name="Hugo" url="https://gohugo.io/" desc="The world's fastest framework for building websites" >}}
