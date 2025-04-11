library(plumber)
library(proxy)
library(cluster)

# Load the PAM model
pam_model <- readRDS("scripts/R/pam_model.rds")

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

#* Classify a customer
#* @param customer The customer data
#* @post /classify
function(customer) {
  required_fields <- c(
    "firstName", "lastName", "gender", "maritalStatus",
    "age", "yearlyIncome", "avgMonthSpend",
    "numberCarsOwned", "numberChildrenAtHome"
  )
  missing_fields <- required_fields[!required_fields %in% names(customer)]

  if (length(missing_fields) > 0) {
    return(list(
      error = paste("Missing required fields:", paste(missing_fields, collapse = ", ")) # nolint
    ))
  }

  # Extract medoids from the PAM model
  medoids_indices <- pam_model$medoids
  medoids_data <- pam_model$data[medoids_indices, ]

  # Prepare customer data in the same format as the training data
  new_customer <- list(
    CountryRegionName = "",
    Education = "",
    Occupation = "",
    Gender = customer$gender,
    MaritalStatus = customer$maritalStatus,
    HomeOwnerFlag = 1,
    NumberCarsOwned = as.integer(customer$numberCarsOwned),
    NumberChildrenAtHome = as.integer(customer$numberChildrenAtHome),
    TotalChildren = as.integer(customer$numberChildrenAtHome),
    YearlyIncome = as.numeric(customer$yearlyIncome),
    Age = as.integer(customer$age)
  )

  # Convert to data frame
  new_customer_df <- as.data.frame(new_customer, stringsAsFactors = TRUE)

  # Calculate Gower distance to each medoid
  gower_dist <- proxy::dist(new_customer_df, medoids_data, method = "gower")

  # Find the closest medoid
  cluster_assignment <- which.min(as.matrix(gower_dist)[1,])

  result <- list(
    message = paste0(customer$firstName, " ", customer$lastName, " has been classified to cluster ", cluster_assignment),
    cluster = as.integer(cluster_assignment),
    clusterProbability = list(
      cluster1 = round(1 - (as.matrix(gower_dist)[1,1] / sum(as.matrix(gower_dist)[1,])), 2),
      cluster2 = round(1 - (as.matrix(gower_dist)[1,2] / sum(as.matrix(gower_dist)[1,])), 2),
      cluster3 = round(1 - (as.matrix(gower_dist)[1,3] / sum(as.matrix(gower_dist)[1,])), 2)
    ),
    bikeBuyerProbability = ifelse(cluster_assignment == 3, "High", ifelse(cluster_assignment == 1, "Medium", "Low"))
  )
  result
}