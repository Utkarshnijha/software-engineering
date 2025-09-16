# Temp Repo Navi
[Docker Compose](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/docker-compose)

[Model Backend](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/model-backend)

[Project Management](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/project-management)

[Web Backend](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/web-backend)

[Web Frontend](https://mygit.th-deg.de/schober-teaching/student-projects/ain-23-software-engineering/ss-25/7up/web-frontend)

# student-repo
 
This repository was created for you as part of a course project. You are required to use this project for any course work and contact 
the lecturer in case you encounter any problems with the settings and configuration of the project.

Any code or related work done in other, self-created Gitlab projects is **not considered for grading**.


## Web Frontend

- The frontend shall work in the following browser versions:
  - Chrome >= 119
  - Firefox >= 122
  - Safari >= 16.1

- The frontend can be created in **JavaScript** or **TypeScript**, using **HTML** and **CSS** as appropriate.

- The source code for the frontend shall be written as a **Single Page Application (SPA)** using either **React** or **Vue**.

- The frontend shall be optimized for **mobile screens**.

- **Unit and Integration tests** for all JavaScript/TypeScript code shall be written using the respective test frameworks for Vue or React.

- All functional requirements for the web app shall be verified in terms of **End-to-End (E2E) tests**.

- **E2E tests** shall be written using **Cypress** or **Playwright**.

- The **reverse proxy** shall be part of the web frontend service.

- The reverse proxy shall:
  - Route all external traffic to the respective internal service.
  - Serve the static files for the web frontend.

## Running the Project

1. **Navigate to the vite-project folder**

   ```bash
   cd web-frontend/vite-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the app**

   Visit `http://localhost:5173/` in your browser to see the project running. This should be the default, but it could be different.
