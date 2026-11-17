---
title: "Pixel Art 1: Setting Up the Canvas"
date: 2026-10-01T10:00:00
categories: [Art]
tags: [Pixel Art, Tutorial]
---

Start small: a 14×10 canvas is enough for a classic invader.

<!--more-->

## Pick a size

Small canvases force you to decide what each pixel means. Draw the outline first, then fill.

![A 14×10 invader, scaled up 16×](/images/invader.png)

## Export at an integer scale

Always scale by whole numbers (2×, 4×, 16×) so pixels stay square:

```python
from PIL import Image

img = Image.open("invader.png")
img.resize((img.width * 16, img.height * 16), Image.NEAREST).save("invader@16x.png")
```

Next: [choosing a palette](02-palette.md).
