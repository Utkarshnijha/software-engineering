# Titanic Survival Predictor – Docker Compose Stack

Welcome to the **7‑Up** team’s unified *docker‑compose* repository. This stack wires together every service required to build, run, and test the Titanic Survival Predictor web application described in the *Software Engineering PrA (SS 2025)* brief.

---

## 1. What’s inside?

| Folder / Submodule   | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `web-frontend`       | React (Vite) SPA that users interact with                |
| `web-backend`        | FastAPI service for auth, persistence & REST API         |
| `model-backend`      | FastAPI service that loads & serves ML models            |
| `compose.yaml`       | Single source of truth for the multi‑container stack     |

All code‑centred repositories are included as **git submodules** so that one `git clone` is enough.

---

## 2. Prerequisites

* **Docker** ≥ 24.0 (engine & CLI)
* **docker‑compose plugin** ≥ 2.27

  ```bash
  docker compose version
  ```
* **Git** ≥ 2.45, with submodule support
* 4 GB of free RAM and \~3 GB of disk space for images & volumes

---

## 3. Quick start

```bash
# 1. Grab everything (including submodules)
$ git clone --recurse-submodules git@gitlab.com:…/docker-compose.git
$ cd docker-compose

# 2. (Optional) pull latest commits in nested repos
$ git submodule update --remote --merge --init

# 3. Build images and start the stack
$ docker compose up --build
```

When the build completes, open **[http://localhost:8080](http://localhost:8080)** in your browser.
The reverse proxy (Caddy) will serve the SPA and route API traffic internally.

> **Admin seed account**
> E‑mail `admin@titanic.com`  |  Account needs to be registered

## 4. Project‑level workflows

### 4.1 Updating submodules

Sub‐projects evolve independently. To fast‑forward their pointers in this repo:

```bash
cd docker-compose
git submodule update --remote --merge --init
# review & commit
git add web-backend model-backend web-frontend
git commit -m "Update submodule pointers to latest commits"
git push origin <branch>
```

### 4.2 Running unit & integration tests

Each service has its own test suite. Example (web‑backend):

```bash
# Run Python tests inside container
$ docker compose run --rm web-backend pytest -q
```

---

## 5. Services & ports

| Service       | Container / Image Tag | Published Port | Internal Port | Notes                                |
| ------------- | --------------------- | -------------- | ------------- | ------------------------------------ |
| Reverse Proxy | `caddy:2-alpine`      | 8080           | 80            | Serves SPA & proxies API calls       |
| Web Frontend  | `web-frontend:<sha>`  | —              | 4173          | Built static files served by proxy   |
| Web Backend   | `web-backend:<sha>`   | —              | 8000          | Auth, business logic (FastAPI)       |
| Model Backend | `model-backend:<sha>` | —              | 8001          | ML inference (FastAPI, scikit‑learn) |
| PostgreSQL    | `postgres:16-alpine`  | —              | 5432          | Data volume `pgdata`                 |

*All intra‑service traffic is isolated in the Docker network; only port 8080 is exposed to the host.*

---

## 6. Configuration & environment

| Variable            | Default     | Where used  | Comment              |
| ------------------- | ----------- | ----------- | -------------------- |
| `POSTGRES_USER`     | `titanic`   | database    |                      |
| `POSTGRES_PASSWORD` | `titanic`   | database    | update in production |
| `POSTGRES_DB`       | `titanic`   | database    |                      |
| `JWT_SECRET_KEY`    | `devsecret` | web-backend | 32+ chars in prod    |

For additional variables, see the `.env.example` files in each sub‑project.

---

## 7. CI/CD Pipeline


* **GitLab CI** definitions live alongside each sub‑project (monorepo‑friendly).
* Images are pushed to the **GitLab Container Registry** under your team group.

---

## 8. Cleaning up

```bash
# Stop the stack
$ docker compose down

# Remove volumes & images (DANGER!)
$ docker compose down --volumes --rmi all
```

---

## 9. Troubleshooting

| Symptom                       | Possible Cause                    | Fix                                                    |
| ----------------------------- | --------------------------------- | ------------------------------------------------------ |
| `web-backend` cannot reach DB | DB container took longer to start | `docker compose up web-backend -d` after DB is healthy |
| `502 Bad Gateway` from proxy  | backend container crashed         | `docker compose logs -f web-backend`                   |
| Models retrained every start  | volume not mounted                | ensure `models:/app/models` volume declared            |

---

## 10. Contributing

1. Create a feature branch in the respective sub‑project.
2. Write tests & ensure `docker compose up --build` still works.
3. Open a merge request; the pipeline must pass before review.

---

*Happy coding & may all your passengers survive!*
