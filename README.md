# Bike Sales Analysis - Interactive Dashboard

A data science and visualization project that explores bicycle sales patterns using the Adventure Works (AW) database. The project combines advanced statistical analysis with interactive visualization to provide valuable insights into sales behavior, focusing on clustering algorithms to understand types of customers groups and which of them will buy the main product.

🖥️ Live Demo: Comming soon!

### FInal Dashboard
![image](https://github.com/user-attachments/assets/dfcda7d0-e777-4767-bf80-f6a181d4a082)

### Analysis and clusterization
**This analysis can be found in my kaggle notebook:** [See notebook](https://www.kaggle.com/code/gerardrubio00/clustering-and-analysis-bike-customers)

![image](https://github.com/user-attachments/assets/117d71dd-f3bb-4df2-98cb-fad109e67f70)
![image](https://github.com/user-attachments/assets/7f0f8b2d-c6c9-4bae-a5ef-49861e995768)


## Project Structure

The project is divided into two main parts:

### 1. Statistical Analysis and clusterization (R)
- Exploratory Data Analysis (EDA)
- Customer Segmentation
- Sales Predictive Modeling
- Demographic analysis
- Advanced Statistical Visualizations

### 2. Interactive Dashboard (Next.js)
- Interactive Data Visualization
- Responsive Charts
- Dynamic Filters in the right sidebar
  
  ![image](https://github.com/user-attachments/assets/f1cbfdd9-d95b-4725-b397-d3274d940048)


## Key Features
- **Deep Analysis**: Detailed insights into sales patterns focusing on cluster results
- **Interactive Visualization**: Dynamic and responsive dashboard
- **Responsive Design**
- **Api call using R and plumber to get the closest medoid for a new customer**: Live on [render.com](https://render.com/)
  
  ![image](https://github.com/user-attachments/assets/1d507b32-d92c-4321-a093-71f4445e3c87)

## Tech Stack
- **Backend & Analysis**:
  - [R](https://cran.rstudio.com/)
  - [Docker](https://www.docker.com/)
  - [Tidyverse](https://www.tidyverse.org/)
  - [cluster](https://cran.r-project.org/web/packages/cluster/index.html)
  - [plumber](https://www.rplumber.io/) - Create R api
  - [Render.com](https://render.com/) - Live server for the api
- **Frontend**:
  - [Next.js](https://nextjs.org/)
  - [Typescript](https://www.typescriptlang.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [recharts](https://recharts.org/en-US/) - Charts visualizations

## Database
This project uses the Adventure Works (AW) sample database, a Microsoft database that simulates a bicycle sales company. Extracted from [kaggle](https://www.kaggle.com/)

💽 Explore the dataset: https://www.kaggle.com/datasets/jahias/microsoft-adventure-works-cycles-customer-data

## Installation and Setup

### Prerequisites
- Next.js
- npm/yarn
- R

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/gerardrubiopullina/customer-bike-sales.git
cd customer-bike-sales
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Usage
1. Access the dashboard at http://localhost:3000
2. Use the filters to select specific data
3. Explore different dashboard sections
4. Explore the data analysis done in R in the /scripts/R folder
5. **Try the clusterization API clicking in the ➕ button next to the first column title in the customers list and filling the form.** Take into account that as a sample project, the server automatically gets in sleep mode after 15 minutes of inactivity, which can make the api response to be a few seconds longer than usual.

## Contact
[Linkedin](https://www.linkedin.com/in/gerard-rubi%C3%B3-pullina-a88992243/)

[Github](https://github.com/gerardrubiopullina)

[Kaggle](https://www.kaggle.com/gerardrubio00)
