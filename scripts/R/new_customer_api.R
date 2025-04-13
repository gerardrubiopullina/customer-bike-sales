library(plumber)
library(proxy)
library(cluster)

# Load the PAM model and clean df
pam_model <- readRDS("pam_model.rds")
df_clean <- read.csv("df_clean.csv")

#* @apiTitle Customer Classification API

#* Enable CORS
#* @filter cors
function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS") # nolint
  res$setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }

  plumber::forward()
}

#* Test endpoint
#* @get /test
function() {
  return(list(status = "API is running"))
}

#* Classify a customer
#* @param firstName First name of the customer
#* @param lastName Last name of the customer
#* @param gender Gender of the customer (M/F)
#* @param maritalStatus Marital status (M/S)
#* @param age Age of the customer
#* @param yearlyIncome Yearly income
#* @param occupation Occupation
#* @param education Education level
#* @param countryRegion Country or region
#* @param homeOwnerFlag Home owner flag (0/1)
#* @param numberCarsOwned Number of cars owned
#* @param numberChildrenAtHome Number of children at home
#* @param totalChildren Total number of children
#* @post /classify
function(firstName, lastName, gender, maritalStatus, age, yearlyIncome, 
         occupation, education, countryRegion, homeOwnerFlag, 
         numberCarsOwned, numberChildrenAtHome, totalChildren) {
  
  # Prepare customer data - making sure to match the structure with original data
  new_customer <- data.frame(
    CountryRegionName = countryRegion,
    Education = education,
    Occupation = occupation,
    Gender = gender,
    MaritalStatus = maritalStatus,
    HomeOwnerFlag = as.factor(homeOwnerFlag),
    NumberCarsOwned = as.integer(numberCarsOwned),
    NumberChildrenAtHome = as.integer(numberChildrenAtHome),
    TotalChildren = as.integer(totalChildren),
    YearlyIncome = as.numeric(yearlyIncome),
    Age = as.integer(age),
    stringsAsFactors = FALSE
  )
  
  # Ensure factor levels match the originals
  for (col in names(new_customer)) {
    if (is.factor(df_clean[[col]])) {
      new_customer[[col]] <- factor(new_customer[[col]], levels = levels(df_clean[[col]]))
    } else if (is.numeric(df_clean[[col]])) {
      new_customer[[col]] <- as.numeric(new_customer[[col]])
    } else {
      new_customer[[col]] <- as.character(new_customer[[col]])
    }
  }
  
  # Extract medoids from the PAM model
  medoids_indices <- pam_model$medoids
  medoids_data <- pam_model$data[medoids_indices, ]
  
  # Calculate Gower distance to each medoid
  gower_dist <- proxy::dist(new_customer, medoids_data, method = "gower")
  
  # Convert to matrix
  dist_matrix <- as.matrix(gower_dist)
  
  # Find the closest medoid
  cluster_assignment <- which.min(dist_matrix[1,])
  
  result <- list(
    message = paste0(firstName, " ", lastName, 
                     " has been classified to cluster ", cluster_assignment),
    cluster = as.integer(cluster_assignment)
  )
  
  return(result)
}

