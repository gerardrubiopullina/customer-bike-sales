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
#* @param customer The customer data
#* @post /classify
function(customer) {
  required_fields <- c(
    "firstName", "lastName", "gender", "maritalStatus",
    "age", "yearlyIncome", "occupation", "education", "countryRegion",
    "homeOwnerFlag", "numberCarsOwned", "numberChildrenAtHome", "totalChildren"
  )
  missing_fields <- required_fields[!required_fields %in% names(customer)]

  if (length(missing_fields) > 0) {
    return(list(
      error = paste("Missing required fields:", paste(missing_fields, collapse = ", "))
    ))
  }

  # Extract medoids from the PAM model
  medoids_indices <- pam_model$medoids
  medoids_data <- pam_model$data[medoids_indices, ]
  
  # Prepare customer data - making sure to match the structure with original data
  new_customer <- data.frame(
    CountryRegionName = customer$countryRegion,
    Education = customer$education,
    Occupation = customer$occupation,
    Gender = customer$gender,
    MaritalStatus = customer$maritalStatus,
    HomeOwnerFlag = as.factor(customer$homeOwnerFlag),
    NumberCarsOwned = as.integer(customer$numberCarsOwned),
    NumberChildrenAtHome = as.integer(customer$numberChildrenAtHome),
    TotalChildren = as.integer(customer$totalChildren),
    YearlyIncome = as.numeric(customer$yearlyIncome),
    Age = as.integer(customer$age),
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
  

  # Calculate Gower distance to each medoid
  gower_dist <- proxy::dist(new_customer, medoids_data, method = "gower")
  
  # Convert to matrix
  dist_matrix <- as.matrix(gower_dist)
  
  # Find the closest medoid
  cluster_assignment <- which.min(dist_matrix[1,])
  
  # Calculate probabilities based on inverse distance
  inverse_distances <- 1/dist_matrix[1,]
  probabilities <- inverse_distances / sum(inverse_distances)
  
  # Get buyer probability based on historical analysis
  # These values should match your clustering analysis
  bike_buyer_prob <- c(
    "1" = "Medium (65%)", 
    "2" = "Low (45%)", 
    "3" = "High (85%)"
  )
  
  result <- list(
    message = paste0(customer$firstName, " ", customer$lastName, 
                     " has been classified to cluster ", cluster_assignment),
    cluster = as.integer(cluster_assignment),
    clusterProbabilities = list(
      cluster1 = round(probabilities[1], 2),
      cluster2 = round(probabilities[2], 2),
      cluster3 = round(probabilities[3], 2)
    ),
    bikeBuyerProbability = bike_buyer_prob[as.character(cluster_assignment)]
  )
  
  return(result)
}

