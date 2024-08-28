import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import streamlit as st
import io

# Load the data
dataframe = pd.read_csv("Zomato.csv")

# Convert the data type of column - rate
def handleRate(value):
    if isinstance(value, str):
        value = value.split('/')
        value = value[0]
    try:
        return float(value)
    except ValueError:
        return np.nan

dataframe["rate"] = dataframe["rate"].apply(handleRate)

# Functions for each analysis
def restaurant_type_count():
    plt.figure(figsize=(10, 6))
    sns.countplot(x=dataframe['listed_in(type)'], palette='viridis')
    plt.xlabel('Type of Restaurant')
    plt.title('Count of Restaurant Types')
    plt.xticks(rotation=45)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()
    return buf

def votes_by_type():
    grouped_data = dataframe.groupby('listed_in(type)')['votes'].sum()
    result = pd.DataFrame({'votes': grouped_data})
    plt.figure(figsize=(10, 6))
    plt.plot(result.index, result['votes'], c="green", marker="o")
    plt.xlabel("Type of Restaurant", c='red', size=12)
    plt.ylabel("Votes", c='red', size=12)
    plt.title("Votes by Restaurant Type")
    plt.xticks(rotation=45)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()
    return buf

def rating_distribution():
    plt.figure(figsize=(10, 6))
    plt.hist(dataframe['rate'].dropna(), bins=20)
    plt.title("Distribution of Ratings")
    plt.xlabel("Rating")
    plt.ylabel("Frequency")
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()
    return buf

def cost_distribution():
    plt.figure(figsize=(10, 6))
    sns.countplot(x=dataframe['approx_cost(for two people)'], palette='viridis')
    plt.title("Distribution of Approximate Cost for Two People")
    plt.xlabel("Cost")
    plt.ylabel("Count")
    plt.xticks(rotation=90)
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()
    return buf

def online_vs_offline_rating():
    plt.figure(figsize=(10, 6))
    sns.boxplot(x='online_order', y='rate', data=dataframe, palette='viridis')
    plt.title("Online vs Offline Order Ratings")
    plt.xlabel("Online Order")
    plt.ylabel("Rating")
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()
    return buf

def heatmap_type_online():
    pivot_table = dataframe.pivot_table(index='listed_in(type)', columns='online_order', values='rate', aggfunc='mean', fill_value=0)
    plt.figure(figsize=(10, 8))
    sns.heatmap(pivot_table, annot=True, cmap="YlGnBu", fmt='.2f')
    plt.title("Average Rating by Restaurant Type and Online Order Availability")
    plt.xlabel("Online Order")
    plt.ylabel("Listed in (Type)")
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()
    return buf

# Streamlit interface
st.title("Zomato Restaurant Analysis")
st.write("Select an analysis type to visualize Zomato restaurant data")

analysis_type = st.selectbox(
    "Select Analysis Type",
    ["Restaurant Type Count", "Votes by Restaurant Type", "Rating Distribution", 
     "Cost Distribution", "Online vs Offline Rating", "Heatmap: Type vs Online Order"]
)

# Render the selected analysis
if analysis_type == "Restaurant Type Count":
    st.image(restaurant_type_count(), use_column_width=True)
elif analysis_type == "Votes by Restaurant Type":
    st.image(votes_by_type(), use_column_width=True)
elif analysis_type == "Rating Distribution":
    st.image(rating_distribution(), use_column_width=True)
elif analysis_type == "Cost Distribution":
    st.image(cost_distribution(), use_column_width=True)
elif analysis_type == "Online vs Offline Rating":
    st.image(online_vs_offline_rating(), use_column_width=True)
elif analysis_type == "Heatmap: Type vs Online Order":
    st.image(heatmap_type_online(), use_column_width=True)
