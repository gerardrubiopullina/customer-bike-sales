library(plumber)
library(cluster)
library(jsonlite)

#* @apiTitle Customer Classification API

# Load the PAM model
pam_model <- readRDS("pam_model.rds")

# Load the original data separately as there is no data in the pam model
df_clean <- read.csv("df_clean.csv", stringsAsFactors = TRUE)

# Extract the medoids
medoid_indices <- pam_model$id.med
medoids <- df_clean[medoid_indices, ]

#* Enable CORS
#* @filter cors
function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type")
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  plumber::forward()
}

#* Prepare customer data for clustering
#* @param countryRegionName Customer's country/region
#* @param education Customer's education level
#* @param occupation Customer's occupation
#* @param gender Customer's gender (M/F)
#* @param maritalStatus Customer's marital status (S/M)
#* @param homeOwnerFlag Whether the customer owns a home (0/1)
#* @param numberCarsOwned Number of cars owned
#* @param numberChildrenAtHome Number of children at home
#* @param totalChildren Total number of children
#* @param yearlyIncome Yearly income
#* @param age Customer's age
#* @get /predict
function(countryRegionName, education, occupation, gender, maritalStatus,
         homeOwnerFlag, numberCarsOwned, numberChildrenAtHome, totalChildren,
         yearlyIncome, age) {
  
  # Log received parameters for debugging
  message("Parameters received:")
  message(paste("countryRegionName:", countryRegionName))
  message(paste("education:", education))
  
  tryCatch({
    # Create a data frame for the new customer
    new_customer <- data.frame(
      CountryRegionName = countryRegionName,
      Education = education,
      Occupation = occupation,
      Gender = gender,
      MaritalStatus = maritalStatus,
      HomeOwnerFlag = as.factor(homeOwnerFlag),
      NumberCarsOwned = as.numeric(numberCarsOwned),
      NumberChildrenAtHome = as.numeric(numberChildrenAtHome),
      TotalChildren = as.numeric(totalChildren),
      YearlyIncome = as.numeric(yearlyIncome),
      Age = as.numeric(age),
      stringsAsFactors = FALSE
    )
    
    # Convert string columns to factors with the same levels as in df_clean
    if (!is.null(df_clean)) {
      for (col in colnames(new_customer)) {
        if (col %in% colnames(df_clean) && is.factor(df_clean[[col]])) {
          # Make sure the levels match those in the original data
          new_customer[[col]] <- factor(new_customer[[col]], 
                                        levels = levels(df_clean[[col]]))
        }
      }
    }
    
    # Calculate Gower distance directly to each medoid
    distances <- numeric(nrow(medoids))
    
    for (i in 1:nrow(medoids)) {
      # Calculate distance between new customer and this medoid
      gower_dist <- daisy(
        rbind(new_customer, medoids[i,]),
        metric = "gower"
      )
      distances[i] <- as.numeric(gower_dist)
    }
    
    # Find the closest medoid
    closest_medoid <- which.min(distances)
    
    # Calculate confidence score
    max_dist <- max(distances)
    relative_distances <- max_dist - distances
    confidence <- relative_distances[closest_medoid] / sum(relative_distances)
    
    # Return the prediction
    result <- list(
      cluster = as.integer(closest_medoid),
      distances = as.list(distances),
      confidence = confidence
    )
    
    return(result)
    
  }, error = function(e) {
    # Handle errors gracefully
    error_msg <- paste("Error during prediction:", e$message)
    message(error_msg)
    return(list(
      error = TRUE,
      message = error_msg,
      status = "error"
    ))
  })
}

#* Get medoid information
#* @get /medoids
function() {
  if (is.null(medoids)) {
    return(list(
      error = TRUE,
      message = "Medoids data not available"
    ))
  }
  
  # Return information about the medoids
  medoid_list <- lapply(1:nrow(medoids), function(i) {
    as.list(medoids[i,])
  })
  
  return(list(
    count = nrow(medoids),
    indices = pam_model$id.med,
    medoids = medoid_list
  ))
}