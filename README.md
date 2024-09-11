# **TravelPulse**

## **Project Description**
**TravelPulse** is a monorepo-based platform designed to offer seamless eSIM solutions for travelers and digital nomads. Built with flexibility in mind, TravelPulse allows users to explore and purchase eSIM plans for various regions, compare options, and manage their eSIM subscriptions, all within a single platform.

The project is structured using **pnpm** for efficient package management, with **Nx** on top to streamline development workflows across multiple applications and libraries within the monorepo.

---

## **Getting Started**

### **System Requirements**
- Node.js (v14.x or higher)
- pnpm (v7.x or higher)
- Nx CLI (v15.x or higher)

### **Installation**

1. **Clone the Repository**
   Begin by cloning the repository to your local machine:

   ```bash
   git clone https://github.com/InnoSoft-Ventures/travel-core.git
   cd travel-core
   ```

2. **Install Dependencies**
   Use **pnpm** to install all necessary dependencies for the project:

   ```bash
   pnpm install
   ```

	 If you haven't installed pnpm yet, install it by running:
	 ```bash
	 npm install -g pnpm
	 ```

### **Running the Application**

*  **Run the web app**
   To start the development server for your application, run the following command:

   ```bash
   pnpm run web:dev
   ```

*  **Run the API server**
   To start the development server, run:

   ```bash
   pnpm run server:dev
   ```

3. **Run Tests**
   Run the unit tests for your application:

   ```bash
   pnpm nx test <app-name>
   ```

4. **Lint the Codebase**
   To check the codebase for linting errors, run:

   ```bash
   pnpm nx lint <app-name>
   ```

---

## **Directory Structure**

- **apps/**:
  Contains the client applications in the monorepo, such as:
  - **web app**: The main web interface for users.
  - **mobile app**: The mobile version of the platform for travelers on the go.

- **services/**:
  Contains the backend applications in the monorepo, such as:
  - **backend**: Handles API requests, business logic, and database interactions.

- **libs/**:
  Shared libraries and utilities used across multiple applications. This may include:
  - Common utilities
  - Data validation
  - Shared models and types

- **tools/**:
  Custom scripts and utilities to support development workflows. Examples include:
  - Build scripts
  - Code formatting tools

