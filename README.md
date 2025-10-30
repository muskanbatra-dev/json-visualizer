# 🌳 JSON Tree Visualizer

An **interactive JSON visualizer** built with React and React Flow.  
Paste JSON, generate a color-coded graph, search using JSONPath, highlight matches, and export the visualization as an image.  
Includes **light/dark themes**, hover insights, and copy-on-click actions.

---

![JSON Tree Visualizer Demo](./demo.gif)  
_(Add a short GIF or screenshot showing: paste → generate → search → download)_

---

## 📽️ Demo Video

<video src="./recording.mov" controls width="600">
  Your browser does not support the video tag. [Download here](./recording.mov)
</video>

---

## ✨ Features

✅ **JSON input and validation**

- Paste raw JSON and click **Generate Tree** to render instantly
- Clear/reset to wipe both input and visualization
- Toast notifications for errors and actions

🌿 **Visual JSON Tree (React Flow powered)**

- Root and nested nodes for objects, arrays, and primitives
- Color coding:
  - 🟣 Objects → **Purple**
  - 🟢 Arrays → **Green**
  - 🟠 Primitives → **Orange**
- Includes MiniMap, zoom/pan Controls, and grid Background

🔍 **JSONPath search and highlight**

- Enter queries like:
  - `$.user.address.city`
  - `$..items[?(@.price>100)]`
- Matches are highlighted and the first match auto-centers
- Clear search resets highlights instantly

💡 **Node insights and quick actions**

- Hover a node → see its path and value snapshot
- Click a node → copies the JSONPath to clipboard

🖼️ **Export as Image**

- One-click **Download Image** saves the current graph as PNG

🌓 **Theme toggle**

- Light/Dark mode toggle
- Persisted via `localStorage` (applies to UI + toast notifications)


## 🚀 Getting Started

### Prerequisites

- Node.js **v18+**

### Installation

```bash
npm install

```
