# Deployment Guide for MyApp

Follow these steps to deploy your Backend, Frontend, and Admin panel.

## Prerequisites
- A GitHub account.
- A Render.com account (for Backend).
- A Vercel.com account (for Frontend & Admin).
- A MongoDB Atlas account (for the database).

---

## Step 1: Push Code to GitHub

Since your project is verified as a single folder containing `Backend`, `frontend`, and `Admin`, we will push the entire `MyApp` folder as one repository.

1.  **Initialize Git** (if not done):
    Open your terminal in `/home/saharsh/Desktop/MyApp` and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit for deployment"
    ```

2.  **Create a Repo on GitHub**:
    -   Go to GitHub.com and create a new repository called `MyApp` (or similar).
    -   **Do not** initialize with README, .gitignore, or License (you already have them).

3.  **Push to GitHub**:
    -   Copy the commands provided by GitHub under "…or push an existing repository from the command line". It will look like:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/MyApp.git
    git branch -M main
    git push -u origin main
    ```

---


## Step 2: Deploy Backend (Render)

1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub account and select the `MyApp` repository.
4.  **Configure the Service**:
    -   **Name**: `myapp-backend` (or similar).
    -   **Root Directory**: `Backend` (Important!).
    -   **Runtime**: `Node`.
    -   **Build Command**: `npm install`.
    -   **Start Command**: `npm start` (We added this script for you).
5.  **Environment Variables** (Scroll down to "Environment"):
    Add the following keys (copy values from your local `Backend/.env` file):
    -   `PORT`: `8001` (or leave default, Render sets this automatically usually, but code uses `process.env.PORT`).
    -   `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://...`). **Do not use localhost**.
    -   `JWT_SECRET`: Your secret key.
    -   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Your Cloudinary credentials.
    -   `CLIENT_URL`: Leave this empty for now, we will update it after deploying frontend.
6.  Click **Create Web Service**.
7.  Wait for deployment to finish. **Copy the Backend URL** (e.g., `https://myapp-backend.onrender.com`).

---


## Step 3: Deploy Frontend (Vercel)

1.  Go to [vercel.com](https://vercel.com/) and Log in.
2.  Click **Add New...** -> **Project**.
3.  Import the `MyApp` repository.
4.  **Configure Project**:
    -   **Framework Preset**: Vite.
    -   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    -   Key: `VITE_API_URL`
    -   Value: The **Backend URL** from Step 2 (e.g., `https://myapp-backend.onrender.com`). **No trailing slash**.
6.  Click **Deploy**.
7.  Wait for it to finish. **Copy the Frontend URL** (e.g., `https://myapp-frontend.vercel.app`).

---

## Step 4: Deploy Admin (Vercel)

1.  Go to Vercel Dashboard again.
2.  Click **Add New...** -> **Project**.
3.  Import the same `MyApp` repository *again*.
4.  **Configure Project**:
    -   **Framework Preset**: Vite.
    -   **Root Directory**: Click "Edit" and select `Admin`.
5.  **Environment Variables**:
    -   Key: `VITE_API_URL`
    -   Value: The **Backend URL** from Step 2.
6.  Click **Deploy**.
7.  Wait for it to finish. **Copy the Admin URL** (e.g., `https://myapp-admin.vercel.app`).

---

## Step 5: Final Backend Configuration

1.  Go back to your **Render dashboard** -> **Settings** -> **Environment**.
2.  Edit the `CLIENT_URL` variable.
3.  Set the value to your Frontend and Admin URLs, separated by a comma (no spaces).
    -   Example: `https://myapp-frontend.vercel.app,https://myapp-admin.vercel.app`
4.  **Save Changes**. Render will automatically redeploy the backend.

---

## Done!

Your application should now be live using the steps above.

---

## Option 2: Deploy with Docker (Easiest for Submission)

Recommended if you need to submit a working "local" version or deploy to a VPS.

### Prerequisites
- Docker Desktop installed.

### Steps
1.  **Configure Environment**:
    Create a file named `.env` in the root folder (`/MyApp/.env`) with your secrets:
    ```env
    # Backend Secrets
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_URL=cloudinary://key:secret@name

    # Frontend/Admin API Connection
    # For Local Docker: http://localhost:8001/api
    # For VPS: http://YOUR_SERVER_IP:8001/api
    VITE_API_URL=http://localhost:8001/api

    # CORS Allowed Origins
    CLIENT_URL=http://localhost:5173,http://localhost:5174
    ```

2.  **Run the Project**:
    Open terminal in `MyApp` folder and run:
    ```bash
    docker compose up --build
    ```

3.  **Access the App**:
    -   **Frontend**: [http://localhost:5173](http://localhost:5173)
    -   **Admin**: [http://localhost:5174](http://localhost:5174)
    -   **Backend**: [http://localhost:8001](http://localhost:8001)

### Deploying to a Remote Server (VPS) via Docker

1.  Push your code (including `docker-compose.yml`, `Dockerfile`s) to GitHub.
2.  SSH into your server.
3.  Clone the repository.
4.  Create the `.env` file on the server (copy contents from your local `.env`).
5.  **Important**: Update `VITE_API_URL` in `.env` to `http://YOUR_SERVER_IP:8001/api` (not localhost).
6.  Run `docker compose up --build -d`.
7.  Your app will be accessible at `http://YOUR_SERVER_IP:5173` (Frontend) and `http://YOUR_SERVER_IP:5174` (Admin).





---------------------------------------------------------------last section for deplyment
What I did:
Updated 
docker-compose.yml
: It now properly uses environment variables (like ${MONGODB_URI}) so you can configure everything securely using a 
.env
 file without editing the code.
Created 
.env.example
: A template file in your project root to help you set up your secrets.
Updated 
DEPLOYMENT_GUIDE.md
: Added a complete "Option 2: Deploy with Docker" section to the bottom of the detailed guide.
How to Deploy with Docker (Right Now)
You can find the full instructions in 
DEPLOYMENT_GUIDE.md
, but here is the summary to get it running immediately:

Create your 
.env
 file: Run this command to create your 
.env
 from the example (then edit it with your real secrets):
bash
cp .env.example .env
Open the 
.env
 file and verify your MONGODB_URI and CLOUDINARY_URL are correct.
Run the project:
bash
docker compose up --build
Submit/Verify:
Frontend: http://localhost:5173
Admin: http://localhost:5174
Backend: http://localhost:8001
