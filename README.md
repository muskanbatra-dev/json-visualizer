# JSON Tree Visualizer

An interactive JSON visualizer built with **React** and **React Flow**. Paste JSON, generate a color-coded graph, search using JSONPath, highlight matches, and export the visualization as an image. Includes light/dark themes, hover insights, and copy-on-click actions.

## Demo Video

If the embedded video doesn’t load, you can [download or view it directly here](./recording.mov).

<video width="640" controls>
  <source src="./recording.mov" type="video/mp4" />
  Your browser does not support HTML video.
</video>

---

## Features

- **JSON Input and Validation**

  - Paste raw JSON and click **Generate Tree** to render instantly.
  - Clear/reset to wipe both input and visualization.
  - Toast notifications for errors and actions.

- **Visual JSON Tree (React Flow)**

  - Root and nested nodes for objects, arrays, and primitives.
  - Color coding:

    - Objects → Purple
    - Arrays → Green
    - Primitives → Orange

  - Includes MiniMap, zoom/pan controls, and grid background.

- **JSONPath Search and Highlight**

  - Enter queries like `$.user.address.city` or `$..items[?(@.price>100)]`.
  - Matches are highlighted and the first match auto-centers.
  - Clear search resets highlights instantly.

- **Node Insights and Quick Actions**

  - Hover a node to see its path and value snapshot.
  - Click a node to copy its JSONPath to the clipboard.

- **Export as Image**

  - One-click **Download Image** saves the current graph as a PNG file.

- **Theme Toggle**

  - Light/Dark mode toggle.
  - Theme preference persisted via `localStorage` (applies to UI and notifications).

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm (bundled with Node) or yarn

### Install

```bash
# Install dependencies
npm install
# or
# yarn
# yarn install
```

### Run the App (development)

```bash
npm run dev
# then open http://localhost:5173 in your browser
```

### Build for production

```bash
npm run build
npm run preview
```

---

## Try With This Dummy JSON

Copy & paste the JSON below into the app input to see the tree visualization in action:

```json
{
  "user": {
    "id": 101,
    "name": "Muskan",
    "isActive": true,
    "address": {
      "city": "Bangalore",
      "country": "India"
    },
    "skills": ["React", "Node.js"],
    "project": {
      "name": "ApiWiz",
      "role": "Frontend Developer"
    }
  }
}
```

---

Example JSONPath Searches

Here are some example queries you can try in the search bar:

Basic Searches
Description JSONPath Expected Match

```json
$.user.name
```

```json
$.user.isActive
```

```json
$.user.address
```
