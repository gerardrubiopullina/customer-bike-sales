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
  
  # Validar y convertir los datos de entrada
  tryCatch({
    age <- as.integer(age)
    yearlyIncome <- as.numeric(yearlyIncome)
    homeOwnerFlag <- as.integer(homeOwnerFlag)
    numberCarsOwned <- as.integer(numberCarsOwned)
    numberChildrenAtHome <- as.integer(numberChildrenAtHome)
    totalChildren <- as.integer(totalChildren)
    
    # Validar que los valores numéricos sean positivos
    if (age <= 0 || yearlyIncome <= 0 || numberCarsOwned < 0 || 
        numberChildrenAtHome < 0 || totalChildren < 0) {
      return(list(error = "Invalid numeric values"))
    }
    
    # Validar que gender y maritalStatus sean válidos
    if (!gender %in% c("M", "F")) {
      return(list(error = "Invalid gender value"))
    }
    if (!maritalStatus %in% c("M", "S")) {
      return(list(error = "Invalid marital status value"))
    }
    
    # Prepare customer data - making sure to match the structure with original data
    new_customer <- data.frame(
      CountryRegionName = as.character(countryRegion),
      Education = as.character(education),
      Occupation = as.character(occupation),
      Gender = as.character(gender),
      MaritalStatus = as.character(maritalStatus),
      HomeOwnerFlag = factor(homeOwnerFlag, levels = c(0, 1)),
      NumberCarsOwned = numberCarsOwned,
      NumberChildrenAtHome = numberChildrenAtHome,
      TotalChildren = totalChildren,
      YearlyIncome = yearlyIncome,
      Age = age,
      stringsAsFactors = FALSE
    )
    
    # Ensure factor levels match the originals
    for (col in names(new_customer)) {
      if (is.factor(df_clean[[col]])) {
        new_customer[[col]] <- factor(new_customer[[col]], levels = levels(df_clean[[col]]))
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
  }, error = function(e) {
    return(list(error = paste("Error processing request:", e$message)))
  })
}

