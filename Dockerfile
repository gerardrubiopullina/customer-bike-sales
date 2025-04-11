FROM rocker/r-ver:4.3.1

RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    libicu-dev \
    && install2.r --error plumber proxy cluster

COPY . /app
WORKDIR /app
EXPOSE 8000

CMD ["R", "-e", "pr <- plumber::plumb('scripts/R/new_customer_api.R'); pr$run(host='0.0.0.0', port=8000)"]
