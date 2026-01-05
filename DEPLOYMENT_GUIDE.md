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

Your application should now be live.
-   **Frontend**: Visit your Vercel Frontend URL.
-   **Admin**: Visit your Vercel Admin URL.
