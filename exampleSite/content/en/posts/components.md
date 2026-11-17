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

## Friend links

{{< friend name="Hugo" url="https://gohugo.io/" desc="The world's fastest framework for building websites" >}}
