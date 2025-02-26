
# CUSTOMER BIKE SALES ANALYSIS

# Customer analysis and clusterization based on sales and demographics
# Identify the ones that are most likely to buy the main product (bikes)

library(tidyverse)
library(cluster)
library(Rtsne)
library(ggpubr)

# Merge datasets

customers <- read.csv("AWCustomers.csv")
sales <- read.csv("AWSales.csv")

df <- merge(customers, sales, by = "CustomerID", all = TRUE)

#### Initial analysis ####

# Create age column
# Age will be a fixed date fro analytical purposes
df$BirthDate <- as.Date(df$BirthDate)
todays_date <- as.Date("2025-02-23")

df$Age <- as.numeric(floor((todays_date - df$BirthDate) / 365.25))

print(paste("The average age of our customers is", 
            round(mean(df$Age, na.rm = TRUE),2), "years"))

# Bike buyers analysis
buyers <- df %>%
  group_by(BikeBuyer) %>%
  summarise(UniqueCustomers = n_distinct(CustomerID))

print(buyers)

# Out of 18355 customers, 10127 are bike buyers (55.17%)

# Customer variables
age <- df %>%
  ggplot(aes(Age))+
  geom_bar(fill="#ff7f0e")+
  labs(y="", x="Age")

country <- df %>%
  ggplot(aes(CountryRegionName))+
  geom_bar(fill="#ff7f0e")+
  labs(y="", x="Country")

education <- df %>%
  ggplot(aes(Education))+
  geom_bar(fill="#ff7f0e")+
  labs(y="", x="Education")+
  coord_flip()

occupation <- df %>%
  ggplot(aes(Occupation))+
  geom_bar(fill="#ff7f0e")+
  labs(y="", x="Ocupation")

marital <- df %>%
  ggplot(aes(MaritalStatus))+
  geom_bar(fill="#ff7f0e")+
  labs(y="", x="Marital Status")

owner <- df %>%
  ggplot(aes(HomeOwnerFlag))+
  geom_bar(fill="#ff7f0e")+
  labs(y="", x="Home Owner Flag")

cars <- df %>%
  ggplot(aes(NumberCarsOwned))+
  geom_bar(fill="#ff7f0e")+
  labs(y="", x="Number Cars Owned")

childrenhome <- df %>%
  ggplot(aes(NumberChildrenAtHome))+
  geom_bar(fill="#ff7f0e")+
  labs(y="", x="Number Children At Home")

childrentotal <- df %>%
  ggplot(aes(TotalChildren))+
  geom_bar(fill="#ff7f0e")+
  labs(y="", x="Total Children")

# Panel: Initial customer analysis
ggarrange(age, country, education, occupation, marital, owner, cars, 
          childrenhome, childrentotal, 
          labels = c(""),
          ncol = 3,
          nrow = 3)

####
#### Clustering algorithm ####

# In the initial notebooks this was made with a 1000 rows sample
# For the final project, the sample will be 5000
data <- df[1:5000,]

# Select variables to use
df_clean <- data %>%
  select(CountryRegionName, Education, Occupation, Gender, MaritalStatus, 
         HomeOwnerFlag, NumberCarsOwned, NumberChildrenAtHome, TotalChildren, 
         YearlyIncome, Age)

# Use the qualitative variables as a factor
df_clean$CountryRegionName <- as.factor(df_clean$CountryRegionName)
df_clean$Education <- as.factor(df_clean$Education)
df_clean$Gender <- as.factor(df_clean$Gender)
df_clean$Occupation <- as.factor(df_clean$Occupation)
df_clean$MaritalStatus <- as.factor(df_clean$MaritalStatus)
df_clean$HomeOwnerFlag <- as.factor(df_clean$HomeOwnerFlag)

# Gower distance calculation
gower_df <- daisy(df_clean, metric = "gower")
summary(gower_df)

# There are customers with a very small gower distance
# They can be grouped based on their characteristics

# Silhouette to determine k number of clusters
silhouette <- c()
silhouette = c(silhouette, NA)

for (i in 2:10) {
  pam_clusters = pam(as.matrix(gower_df),
                     diss = TRUE, k = i)
  silhouette = c(silhouette, pam_clusters$silinfo$avg.width)
}

silplot <- data.frame(silhouette)
silplot$n <- c(1,2,3,4,5,6,7,8,9,10)

silplot[1,1] <- 0

sil <- ggplot(silplot, aes(x = n, y = silhouette)) +
  geom_line(color="#1f618d")+
  geom_point(color="#1f618d")+
  scale_x_continuous(breaks = seq(1, 10, by = 1))+
  theme_classic()+
  labs(y="Average silhouette width", 
       x = "Number of clusters k", 
       title="Optimal number of cluster")

sil

# The optimal would be k=2, but for analytical purposes and as we are working
# with customer data, k=3 will be used as it can reveal other patterns

# Partitioning Around Medoids (PAM): Clustering algorithm




####



