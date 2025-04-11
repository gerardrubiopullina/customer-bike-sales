FROM rocker/plumber
COPY . /app
WORKDIR /app
EXPOSE 8000
CMD ["R", "-e", "pr <- plumber::plumb('scripts/R/new_customer_api.R'); pr$run(host='0.0.0.0', port=8000)"]
