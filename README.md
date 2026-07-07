# Zomato Restaurant Analysis

Interactive dashboard for exploring Zomato restaurant data with six analysis views.

## Deploy on Vercel (recommended)

This project uses **Next.js** for Vercel deployment. Streamlit cannot run on Vercel (it needs a persistent Python server with WebSockets).

### Steps

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Keep the framework preset as **Next.js**.
4. Click **Deploy**.

Or use the Vercel CLI:

```bash
npm install
npx vercel
```

### Local development (Next.js)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Run Streamlit locally (optional)

The original Streamlit app is included as `app.py` for local use:

```bash
pip install -r requirements.txt
streamlit run app.py
```

Place `Zomato.csv` in the project root when running Streamlit (copy from `public/Zomato.csv`).

## Analyses included

- Restaurant Type Count
- Votes by Restaurant Type
- Rating Distribution
- Cost Distribution
- Online vs Offline Rating
- Heatmap: Type vs Online Order

## Data

`Zomato.csv` is stored in `public/` for the web app and should be copied to the project root for Streamlit.
