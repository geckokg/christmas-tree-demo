# 发光粒子圣诞树（移动预览）

这是一个使用 HTML5 Canvas 实现的移动友好发光粒子圣诞树示例。文件位于 `christmas_tree/` 文件夹下。

文件列表
- `index.html` — 入口页面
- `style.css` — UI 和样式
- `main.js` — Canvas 渲染与粒子系统

本地预览（推荐网络同一局域网手机访问）

1. 打开 PowerShell，进入项目目录：

```powershell
cd d:/code_vs/against_m3f/christmas_tree
```

2. 使用 Python 内置服务器（需要已安装 Python）：

```powershell
python -m http.server 8080
```

在电脑浏览器打开 `http://localhost:8080`，或者在同一局域网手机上访问 `http://<电脑局域网IP>:8080`。

或者使用 `serve`（需要 Node.js）：

```powershell
npx serve -l 8080
```

部署到 GitHub Pages（快速生成可分享链接）

1. 将此文件夹推送到 GitHub 仓库（示例）：

```powershell
git init
git add .
git commit -m "Add christmas tree demo"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

2. 在 GitHub 仓库页面启用 Pages（Settings → Pages），选择 `main` 分支和根目录，保存后会获得 `https://<用户名>.github.io/<仓库名>/` 链接。

触控说明
- 轻触或点击树周围会产生烟花粒子效果。
- 上方按钮可暂停/恢复动画以节省电量。

如果你希望我帮你把这个演示发布并返回一个可访问的链接，我可以指导你完成 GitHub 推送，或者（如果你允许）生成一个 GitHub 仓库并填写部署步骤说明。 
