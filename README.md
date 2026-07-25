# ge-preview

> `ge` 项目的 GitHub Pages 静态预览产物。

本仓库托管 [loveOneBaby/ge](https://github.com/loveOneBaby/ge)（张海云全栈作品集）构建后的静态文件，通过 GitHub Pages 公开访问，用于分享与预览。

## 内容

```text
ge-preview/
├── index.html       # 构建产物入口
├── assets/          # JS / CSS / 媒体资源
├── favicon.svg
└── .nojekyll        # 禁用 Jekyll，保留 assets 目录结构
```

## 更新方式

本仓库不存放源码，产物由 `ge` 构建后推送：

```bash
# 在 ge 仓库中
pnpm build
# 将 dist/ 的内容推送到 ge-preview 仓库（GitHub Pages 来源分支）
```

## 相关仓库

- [ge](https://github.com/loveOneBaby/ge)：源码仓库
- [zhys-space](https://github.com/loveOneBaby/zhys-space)：AI 设计师方向作品集
