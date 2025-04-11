library(plumber)

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
  required_fields <- c("firstName", "lastName", "gender")
  missing_fields <- required_fields[!required_fields %in% names(customer)]

  if (length(missing_fields) > 0) {
    return(list(
      error = paste("Campos obligatorios faltantes:", paste(missing_fields, collapse = ", ")) # nolint
    ))
  }

  result <- list(
    message = paste0(customer$firstName, " ", customer$lastName, " is a ",
      ifelse(customer$gender == "M", "male", "female"), ".") # nolint
  )
  result
}