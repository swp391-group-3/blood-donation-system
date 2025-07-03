<div align="center">
  <br />
  <h1>🩸 Blood Donation System</h1>
  <p>
    A modern, open-source platform designed to streamline the blood donation process, connecting donors, recipients, and medical professionals to save lives.
  </p>

  <p>
    <a href="https://github.com/swp391-group-3/blood-donation-system/issues">Report Bug</a>
    ·
    <a href="https://github.com/swp391-group-3/blood-donation-system/issues">Request Feature</a>
  </p>

  <p>
    <img src="https://img.shields.io/github/stars/swp391-group-3/blood-donation-system?style=social" alt="GitHub Stars">
    <img src="https://img.shields.io/github/forks/swp391-group-3/blood-donation-system?style=social" alt="GitHub Forks">
    <img src="https://img.shields.io/github/issues/swp391-group-3/blood-donation-system" alt="GitHub Issues">
    <img src="https://img.shields.io/github/license/swp391-group-3/blood-donation-system" alt="License">
    <img src="https://github.com/swp391-group-3/blood-donation-system/actions/workflows/check.yaml/badge.svg" alt="GitHub Actions">
    <img src="https://github.com/swp391-group-3/blood-donation-system/actions/workflows/deploy.yaml/badge.svg" alt="GitHub Actions">
  </p>
</div>

---

## 📖 Table of Contents

*   [About The Project](#about-the-project)
    *   [Built With](#built-with)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
*   [Usage](#usage)
*   [Roadmap](#roadmap)
*   [Contributing](#contributing)
*   [License](#license)
*   [Contact](#contact)
*   [Show your support](#show-your-support)

---

## About The Project

The Blood Donation System is a comprehensive web application aimed at modernizing and simplifying the process of blood donation. Our mission is to bridge the gap between donors and those in need, creating a seamless and efficient ecosystem for managing appointments, tracking donations, and fulfilling blood requests.

We believe that by using technology to create a more connected and informed community, we can significantly increase the number of voluntary blood donors and save more lives.

### ✨ Features

*   **👤 User Management**: Secure, role-based access (Donor, Staff, Admin) with easy sign-up and login.
*   **🌐 OAuth2 Integration**: Conveniently log in or register using Google and Microsoft accounts.
*   **🗓️ Appointment Scheduling**: Donors can find nearby donation centers and schedule appointments effortlessly.
*   **📈 Donation Tracking**: A personal dashboard for donors to view their donation history and health records.
*   **📦 Inventory Management**: Real-time tracking of blood bags, types, and expiration dates for medical staff.
*   **❤️ Blood Requests**: A streamlined system for hospitals to request blood and for donors to respond to urgent needs.
*   **🤖 AI-Powered Chat**: An intelligent chatbot, powered by RAG, to answer user questions based on our extensive knowledge base.
*   **📚 Community & Knowledge Hub**: A built-in blog to educate and engage the community.

### 🛠️ Built With

This project is built on a modern, robust, and scalable technology stack.

*   **Backend:**
    *   [Rust](https://www.rust-lang.org/)
    *   [Axum](https://github.com/tokio-rs/axum)
    *   [PostgreSQL](https://www.postgresql.org/)
    *   [Redis](https://redis.io/)
    *   [Qdrant](https://qdrant.tech/)
*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (with Turbopack)
    *   [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [Shadcn UI](https://ui.shadcn.com/)
*   **DevOps:**
    *   [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
    *   [GitHub Actions](https://github.com/features/actions) for CI/CD

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the latest versions of Docker and Docker Compose installed on your system.
*   **Docker:** [Get Docker](https://www.docker.com/get-started)
*   **Docker Compose:** [Installation Guide](https://docs.docker.com/compose/install/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/swp391-group-3/blood-donation-system.git
    cd blood-donation-system
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the project root. This file will store all your secret keys and configuration variables. You can copy the example configuration from the backend to get started.
    ```sh
    touch .env
    ```
    Now, open the `.env` file and fill in the required values for your local setup (database credentials, OIDC keys, etc.).

3.  **Launch the Application:**
    We use Docker Compose profiles to give you flexibility in running the services.

    *   To run the **entire stack** (frontend, backend, database, etc.):
        ```sh
        docker compose --profile deploy up --build
        ```
    *   To run only the **backend** and its dependencies:
        ```sh
        docker compose --profile backend up --build
        ```

## Usage

Once the containers are running, you can access the different parts of the system:
*   **🌐 Frontend Application:** `http://localhost:3001`
*   **⚙️ Backend API:** `http://localhost:3000`
*   **🗃️ Database GUI (Cloudbeaver):** `http://localhost:8978`
*   **🧠 Vector DB (Qdrant):** `http://localhost:6333/dashboard`

---

## 🗺️ Roadmap

See the [open issues](https://github.com/swp391-group-3/blood-donation-system/issues) for a full list of proposed features (and known issues).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

We use a conventional commit message format. Please follow it for your commit messages.

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## 📞 Contact

SWP391 Group 3 - [Project Link](https://github.com/swp391-group-3/blood-donation-system)

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!
