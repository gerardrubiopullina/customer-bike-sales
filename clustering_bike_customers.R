
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







