
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

pam = pam(gower_df, diss = TRUE, k = 3)

pam_summary <- df_clean %>%
  mutate(Cluster = pam$clustering) %>%
  group_by(Cluster) %>%
  do(Cluster_summary = summary(.))

table(pam$clustering)

# The cluster 2 is the most common with 2000 customers

pam_summary$Cluster_summary[[2]]

# This cluster has 1245 women (F) and 755 males (M)
# Clear majority of single (S) people
# Their age is around their 30s - 40s
# Average income of 64785$ with a range between 25k and 138k

# Graphical representation of distances with TSNE. Customers dissimilarities
tsne_object <- Rtsne(gower_df, is_distance = TRUE)

tsne_df <- tsne_object$Y %>%
  data.frame() %>%
  setNames(c("X", "Y")) %>%
  mutate(cluster = factor(pam$clustering))

ggplot(aes(x = X, y = Y), data = tsne_df) +
  geom_point(aes(color = cluster)) +
  scale_color_manual(values = c("#008080", "#003366", "#FF7F0E")) +
  theme_minimal() +
  theme(
    legend.title = element_blank(),
    legend.position = "right",
    legend.key = element_blank(),
    panel.grid.major = element_blank(),
    axis.title = element_blank(),
  )

# Bind results with the database sample
df_final <- bind_cols(data, pam['clustering'])
df_final$clustering <- as.factor(df_final$clustering)

prop.table(table(df_final$clustering, df_final$BikeBuyer), 1)

# If we want to run a campaign promoting bike purchases, we should focus on
# cluster 3 and 1 as they have a high percentage of bike buyers

####
#### Customer groups analysis ####

cluster1 <- filter(df_final, clustering==1)
cluster2 <- filter(df_final, clustering==2)
cluster3 <- filter(df_final, clustering==3)

age_clusters <- ggplot(df_final, aes(x=Age, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Age") +
  theme(legend.position = "none")

country_clusters <- ggplot(df_final, aes(x=CountryRegionName, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Country") +
  theme(legend.position = "none")

education_clusters <- ggplot(df_final, aes(x=Education, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Education") +
  coord_flip() +
  theme(legend.position = "none")

occupation_clusters <- ggplot(df_final, aes(x=Occupation, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Occupation") +
  theme(legend.position = "none")

marital_clusters <- ggplot(df_final, aes(x=MaritalStatus, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Marital Status") +
  theme(legend.position = "none")

owner_clusters <- ggplot(df_final, aes(x=HomeOwnerFlag, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Home Owner Flag") +
  theme(legend.position = "none")

cars_clusters <- ggplot(df_final, aes(x=NumberCarsOwned, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Number Cars Owned") +
  theme(legend.position = "none")

childrenhome_clusters <- ggplot(df_final, aes(x=NumberChildrenAtHome, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Number Children At Home") +
  theme(legend.position = "none")

childrentotal_clusters <- ggplot(df_final, aes(x=TotalChildren, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Total Children") +
  theme(legend.position = "none")

# Panel: Customer groups analysis
ggarrange(
  age_clusters, country_clusters, education_clusters, occupation_clusters,
  marital_clusters, owner_clusters, cars_clusters, childrenhome_clusters,
  childrentotal_clusters,
  labels = c(""),
  ncol = 3, nrow = 3,
  common.legend = TRUE, legend = "bottom"
)

####

# The conclusions for this analysis will be showed in the CONCLUSIONS.md

#### Assigning remaining customers ####

library(proxy)
library(jsonlite)

# Extract the medoids (centers in PAM clusters)
medoids <- df_clean[pam$medoids,]

# Remaining customers to assign
remaining_data <- df[5001:18361,]

# Preparation of the data as before
remaining_clean <- remaining_data %>%
  select(CountryRegionName, Education, Occupation, Gender, MaritalStatus, 
         HomeOwnerFlag, NumberCarsOwned, NumberChildrenAtHome, TotalChildren, 
         YearlyIncome, Age)

remaining_clean$CountryRegionName <- as.factor(remaining_clean$CountryRegionName)
remaining_clean$Education <- as.factor(remaining_clean$Education)
remaining_clean$Gender <- as.factor(remaining_clean$Gender)
remaining_clean$Occupation <- as.factor(remaining_clean$Occupation)
remaining_clean$MaritalStatus <- as.factor(remaining_clean$MaritalStatus)
remaining_clean$HomeOwnerFlag <- as.factor(remaining_clean$HomeOwnerFlag)

# Calculation of the distances from each remaining customer to each medoid
# Proxy for efficient distance assignation
gower_dist <- proxy::dist(remaining_clean, medoids, method = "gower")

# Assignation
remaining_clusters <- apply(as.matrix(gower_dist), 1, which.min)
table(remaining_clusters)

# In the remaining data, the most frequent cluster is number 2 too

remaining_data$clustering <- as.factor(remaining_clusters)

# Mergin the two final datasets
results <- rbind(
  select(df_final, names(df_final)), 
  select(remaining_data, names(df_final))
)

table(results$clustering)

# In the full dataset, the third clusters is the less frequent

prop.table(table(results$clustering, results$BikeBuyer), 1)

# The proportion of bike buyers remains similar

# Saving the results as csv and json for the dashboard
write.csv(results, "clustering_results.csv", row.names = FALSE)
write_json(results, "../../public/clustering_results.json", pretty = TRUE)
write.csv(df_clean, "df_clean.csv", row.names = FALSE)

####
#### View full clusters distribution ####

results_cluster1 <- filter(results, clustering==1)
results_cluster2 <- filter(results, clustering==2)
results_cluster3 <- filter(results, clustering==3)

results_age_clusters <- ggplot(results, aes(x=Age, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Age") +
  theme(legend.position = "none")

results_country_clusters <- ggplot(results, aes(x=CountryRegionName, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Country") +
  theme(legend.position = "none")

results_education_clusters <- ggplot(results, aes(x=Education, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Education") +
  coord_flip() +
  theme(legend.position = "none")

results_occupation_clusters <- ggplot(results, aes(x=Occupation, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Occupation") +
  theme(legend.position = "none")

results_marital_clusters <- ggplot(results, aes(x=MaritalStatus, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Marital Status") +
  theme(legend.position = "none")

results_owner_clusters <- ggplot(results, aes(x=HomeOwnerFlag, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Home Owner Flag") +
  theme(legend.position = "none")

results_cars_clusters <- ggplot(results, aes(x=NumberCarsOwned, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Number Cars Owned") +
  theme(legend.position = "none")

results_childrenhome_clusters <- ggplot(results, aes(x=NumberChildrenAtHome, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Number Children At Home") +
  theme(legend.position = "none")

results_childrentotal_clusters <- ggplot(results, aes(x=TotalChildren, fill = clustering)) +
  geom_bar() +
  scale_fill_manual(values=c("#008080", "#003366", "#ff7f0e")) +
  labs(y = "", x = "Total Children") +
  theme(legend.position = "none")

# Panel: Full customer groups analysis
ggarrange(
  results_age_clusters, results_country_clusters, results_education_clusters, 
  results_occupation_clusters, results_marital_clusters, results_owner_clusters, 
  results_cars_clusters, results_childrenhome_clusters, results_childrentotal_clusters,
  labels = c(""),
  ncol = 3, nrow = 3,
  common.legend = TRUE, legend = "bottom"
)

# The conclusions for this analysis will be showed in the CONCLUSIONS.md

# Save medoids for the pam api
saveRDS(pam, "pam_model.rds")

####

