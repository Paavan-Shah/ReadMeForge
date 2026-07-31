## 🌟 Overview

**README Forge** is a production-grade, offline-first web application designed to help developers create stunning, professional GitHub `README.md` files in minutes. 

Tired of manually formatting Markdown tables, searching for shield badges, and keeping track of Markdown syntax? README Forge offers a three-pane intuitive layout with drag-and-drop section sorting, 20+ dynamic component builders, and a live GitHub-flavoured preview that updates in real-time as you type.

Best of all? **It requires zero internet connection or backend database.** All of your projects are safely autosaved locally to your browser.

## ✨ Features

- **🛡️ 20+ Dynamic Sections:** Includes generators for Title, Logo/Banner, Badges, Features, Installation, API Reference, Environment Variables, Folder Structure, FAQ, and many more.
- **⚡ Fully Offline Architecture:** No server required. Your projects are automatically saved to your browser's IndexedDB.
- **🎨 6 Professional Themes:** Toggle between beautifully crafted CSS themes like GitHub Light/Dark, VS Code Dark, Dracula, Nord, and Solarized.
- **📐 Quick-Start Templates:** Start fresh, or select from 8 pre-built templates (React App, Python Library, API, CLI Tool, Portfolio, etc.).
- **🖱️ Drag and Drop:** Reorder your README sections effortlessly with robust `@dnd-kit` integration.
- **🔄 Undo / Redo:** A powerful state history stack lets you safely undo mistakes.
- **👀 Live Dual-Pane Preview:** View your README exactly as it will look on GitHub, or switch to the raw Markdown code tab.
- **📦 Import / Export:** Easily backup your projects to JSON files or download the finalized `.md` file directly to your machine.

## 🛠 Tech Stack

README Forge is built with modern, high-performance web technologies:

- **[React 18](https://react.dev/)**: For building a highly interactive, component-driven User Interface.
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling for instantaneous hot module replacement (HMR) and optimized builds.
- **[TypeScript](https://www.typescriptlang.org/)**: Strongly typed JavaScript for supreme code quality, minimizing runtime errors.
- **[Zustand](https://github.com/pmndrs/zustand)**: A small, fast, and scalable bearbones state-management solution used as the "global brain" of the app.
- **[dnd-kit](https://dndkit.com/)**: A lightweight, modular, and accessible drag-and-drop toolkit for React.
- **[idb-keyval](https://github.com/jakearchibald/idb-keyval)**: A super simple promise-based keyval store implemented with IndexedDB for local autosaving.
- **[react-markdown](https://github.com/remarkjs/react-markdown)**: Safely parses and renders our generated Markdown string into GitHub-styled HTML.

## 🚀 Getting Started

To run README Forge locally on your machine, follow these simple steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16 or higher) installed on your system.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Paavan-Shah/ReadmeForge.git
   cd readme-forge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the App**
   Open your browser and navigate to the local server URL (usually `http://localhost:5173`).

### Build for Production
To generate a highly optimized, minified production build:
```bash
npm run build
```
The output will be safely stored in the `dist/` directory, ready to be deployed to any static host like GitHub Pages, Vercel, or Netlify.

## 🏗 Architecture & Design

The application follows a clean, data-driven architecture separated into logical concerns:

- `app/components/`: Contains all UI building blocks (Buttons, Modals, Inputs) and complex layout panes (Sidebar, Editor, Preview).
- `app/generators/`: The markdown rendering engine. Contains 20+ pure, isolated TypeScript functions that map JSON state data directly to formatted Markdown strings.
- `app/store/`: Houses the Zustand global store and history stack, managing the entire application's lifecycle and user inputs.
- `app/utils/storage.ts`: The persistence layer responsible for securely pushing/pulling project data to and from IndexedDB.
- `app/data/`: Centralized JSON dictionaries for component definitions, pre-built templates, and badge configurations.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🚀 Future Scope

**ReadMeForge** will continue to evolve with features such as AI-assisted README generation, GitHub repository import, advanced templates, cloud synchronization, collaborative editing, PDF/HTML export, and seamless integrations with popular developer tools.
Also going to add import as .md and .json files.
## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*Forged with ❤️ by a passionate developer.*
