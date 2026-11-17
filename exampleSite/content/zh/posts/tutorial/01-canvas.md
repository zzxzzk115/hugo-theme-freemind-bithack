---
title: "像素画 1：准备画布"
date: 2026-10-01T10:00:00
categories: [美术]
tags: [像素画, 教程]
---

从小画布开始：14×10 就足够画一个经典的太空侵略者。

<!--more-->

## 选择尺寸

小画布会逼你想清楚每个像素的作用。先画轮廓，再填充。

![14×10 的侵略者，放大 16 倍](/images/invader.png)

## 按整数倍导出

始终按整数倍（2×、4×、16×）放大，像素才能保持方正：

```python
from PIL import Image

img = Image.open("invader.png")
img.resize((img.width * 16, img.height * 16), Image.NEAREST).save("invader@16x.png")
```
