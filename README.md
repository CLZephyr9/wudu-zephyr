# 无渡 / Zephyr

面向手机的个人资料网站，包含开场、落水互动、资料主页及五个附属板块、开放式结尾。

## 预览与更新

本项目为静态网站，无需安装前端依赖。使用 Python 3：

```sh
python build.py
python -m http.server 8080
```

打开 `http://localhost:8080/`。修改后运行 `python build.py` 并提交更新，GitHub Pages 会重新发布。

- 正文与页面组件在 `source/` 中；须知为 `source/notice-content.json`，随笔为 `source/essay-content.json`。
- 话术、板评的图片顺序和路径位于 `source/asset-map.json` 对应的图片列表中；图片文件位于 `assets/`。
- 音量位于 `source/second-page.js`（水声 0.5）及 `source/profile-music.js`（《幻昼》0.35）。
- 访客称呼仅保存在当前页面的内存中；不会提交服务器或写入浏览器存储。
- 页面加载后，首次操作启动音频。部分手机浏览器会限制网页自动关闭，届时提供手动关闭提示。

GitHub Pages 发布来源为 `main` 分支的根目录。已保留可重建源码，后续可继续修改内容和样式。
