# Zomato Restaurant Analysis

Interactive dashboard for exploring Zomato restaurant data with charts, business analysis, and restaurant listings.

## Project goals

This project analyzes Zomato customer and restaurant data to answer:

1. What type of restaurant do the majority of customers order from?
2. How many votes has each type of restaurant received from customers?
3. What are the ratings that the majority of restaurants have received?
4. Most couples order food online — what is their average spending on each order?
5. Which mode (online or offline) has received the maximum rating?
6. Which type of restaurant received more offline orders (for targeted offers)?

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

Open [http://localhost:3001](http://localhost:3001).

## Run Streamlit locally (optional)

The original Streamlit app is included as `app.py` for local use:

```bash
pip install -r requirements.txt
streamlit run app.py
```

Place `Zomato.csv` in the project root when running Streamlit (copy from `public/Zomato.csv`).

## Features

- Animated charts: bar, pie, line, area, scatter, box plot, heatmap
- Dark / light mode
- Business Analysis tab with all 6 key questions
- Restaurant selector and listings

## Data

`Zomato.csv` is stored in `public/` for the web app and should be copied to the project root for Streamlit.
