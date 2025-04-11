
library(plumber)

#* Get the sum of two numbers
#* @post /sum
function(x, y) {
  as.numeric(x) + as.numeric(y)
}