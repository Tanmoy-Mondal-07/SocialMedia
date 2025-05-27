<div align="left" style="position: relative;">
<h1>SOCIALMEDIA</h1>
	Welcome to the Dante, a full-featured social media platform built with modern web development tools and designed for experimentation, learning, and showcasing social networking functionalities. This project is suitable for developers who want to understand how social platforms operate, from user authentication to real-time chat systems.
<img src="./SocialMedia/src/assets/text.svg" align="right" width="30%" style="margin: -20px 0 0 20px;">
<p align="left">
	<img src="https://img.shields.io/github/license/Tanmoy-Mondal-07/SocialMedia?style=flat-square&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/Tanmoy-Mondal-07/SocialMedia?style=flat-square&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Tanmoy-Mondal-07/SocialMedia?style=flat-square&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Tanmoy-Mondal-07/SocialMedia?style=flat-square&color=0080ff" alt="repo-language-count">
</p>
<p align="left">Built with the tools and technologies:</p>
<p align="left">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat-square&logo=react&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat-square&logo=vite&logoColor=white" alt="Vite">
	<img src="https://img.shields.io/badge/TailwindCSS-06B6D4.svg?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
	<img src="https://img.shields.io/badge/Redux-593D88.svg?style=flat-square&logo=redux&logoColor=white" alt="Redux">
	<img src="https://img.shields.io/badge/Appwrite-F02E65.svg?style=flat-square&logo=appwrite&logoColor=white" alt="Appwrite">
	<img src="https://img.shields.io/badge/IDB-003B57.svg?style=flat-square&logo=IndexedDB&logoColor=white" alt="IndexedDB">
	<img src="https://img.shields.io/badge/React%20Router-CA4245.svg?style=flat-square&logo=react-router&logoColor=white" alt="React Router">
	<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat-square&logo=eslint&logoColor=white" alt="ESLint">
	<img src="https://img.shields.io/badge/NPM-CB3837.svg?style=flat-square&logo=npm&logoColor=white" alt="npm">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
</p>
</div>
<br clear="right">

## 🔗 Table of Contents

- [🌐 Live Demo](#-live-demo)
- [📱 Overview](#-overview)
- [✨ Features](#-features)
- [🚀 Tech Stack](#-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [🗄️ Database Structure](#-database-structure)
- [⚙️ Installation & Setup](#-installation-&-setup)
  - [☑️ Prerequisites](#-prerequisites)
  - [⚙️ Installation](#-installation)
- [📌 Project Roadmap](#-project-roadmap)
- [🔰 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Author](#-author)

---

## 🌐 Live Demo

Check out the live demo of this project here:
👉 [dantetestserver.pages.dev](https://dantetestserver.pages.dev)

---

## 📱 Overview

<img src="./Dantethumbnail.png" align="center">

---

## ✨ Features

* User Authentication (Login/Signup)
* Profile Creation & Editing
* Post Creation, Editing, and Deletion
* Like and Comment Functionality
* Real-Time Chat System
* Notifications (Locally cached using IndexedDB)
* Responsive Design for Mobile and Desktop
* Custom React Hooks and Redux Toolkit for state management

---

## 🚀 Tech Stack

* **Frontend:** React.js, Redux Toolkit, Tailwind CSS
* **Backend & Database:** Appwrite (self-hosted backend-as-a-service)
* **Realtime Messaging:** Custom Chat Service
* **Data Storage:** IndexedDB for local notifications and data caching
* **Deployment:** Cloudflare Pages

---

## 📁 Folder Structure

```sh
└── SocialMedia/
	├── LICENSE
	├──SocialMedia/
	│	├── public/              # Static assets
	│	├── src/
	│	│   ├── app/             # Redux store and configuration
	│	│   ├── assets/          # Images and icons
	│	│   ├── components/      # Shared components (Navbar, Button, etc.)
	│	│   ├── features/        # Feature-based Redux slices
	│	│   ├── pages/           # Page components (Home, Profile, Chat, etc.)
	│	│   ├── services/        # API and backend interactions
	│	│   ├── utils/           # Utility functions and hooks
	│	│   └── main.jsx         # React DOM root
	│	├── .env                 # Environment variables
	│	├── package.json         # Project metadata and scripts
	│	└── tailwind.config.js   # Tailwind CSS configuration
	└── appwriteFunctions        # Appwrite functions
        ├── commentFunction
        │   └── src
        │       └── main.js      # Appwrite functions for comment system
        └── followFunction
            └── src
                └── main.js      # Appwrite functions for follow unfollow
```

## 🗄️ Database Structure

```sh

```


## ⚙️ Installation & Setup

### ☑️ Prerequisites

Before getting started with SocialMedia, ensure your runtime environment meets the following requirements:

- **Programming Language:** JavaScript
- **Package Manager:** Npm


### ⚙️ Installation

Install SocialMedia using one of the following methods:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Tanmoy-Mondal-07/SocialMedia.git
   cd SocialMedia
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Create a `.env` file in the root directory and add your Appwrite project credentials:

   ```env
	VITE_APPWRITE_URL=
	VITE_APPWRITE_PROJECT_ID=
	VITE_APPWRITE_DATABASE_ID=

	VITE_APPWRITE_USER_PROFILE_COLLECTION_ID=
	VITE_APPWRITE_POST_COLLECTION_ID=
	VITE_APPWRITE_FOLLOW_STATE_COLLECTION_ID=
	VITE_APPWRITE_FOLLOW_EVENT_COLLECTION_ID=
	VITE_APPWRITE_COMMENTS_COLLECTION_ID=
	VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID=
	VITE_APPWRITE_REPORT_COLLECTION_ID=
	VITE_APPWRITE_LIKE_COLLECTION_ID=
	VITE_APPWRITE_INBOX_COLLECTION_ID=

	VITE_APPWRITE_BUCKET_AVATAR_ID=

	VITE_APPWRITE_FOLLOW_FUNCTION_ID=
	VITE_APPWRITE_COMMENT_FUNCTION_ID=
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

5. **Build for Production**

   ```bash
   npm run build
   ```

---
## 📌 Project Roadmap

- [X] **`Task 1`**: <strike>The follow system must be secured using a custom Appwrite function to validate user actions and prevent unauthorized follows.</strike>
- [X] **`Task 2`**: <strike>The comment system must be secured using a custom Appwrite function to ensure only authenticated users can post, edit, or delete comments.</strike>
- [*] **`Task 3`**: The live chat system must be secured using a custom Appwrite function to ensure message integrity and user authentication.
- [*] **`Task 4`**: The like system must be secured using a custom Appwrite function to prevent duplicate likes and ensure actions are tied to authenticated users..

---

## 🔰 Contributing

Contributions are welcome! If you'd like to contribute:

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/Tanmoy-Mondal-07/SocialMedia
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/Tanmoy-Mondal-07/SocialMedia/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Tanmoy-Mondal-07/SocialMedia">
   </a>
</p>
</details>

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Tanmoy Mondal**

GitHub: [@Tanmoy-Mondal-07](https://github.com/Tanmoy-Mondal-07)

---

## ❓ Support

If you find any bugs or issues, please open an issue on GitHub or reach out via the Issues tab.

Happy Coding! ✨