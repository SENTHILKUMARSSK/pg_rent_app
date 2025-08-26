# Stage 1: PHP + Composer
FROM php:8.2-fpm as php

RUN apt-get update && apt-get install -y \
    git unzip zip libzip-dev libpng-dev libonig-dev libxml2-dev curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy Laravel code
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Stage 2: Nginx + PHP-FPM
FROM nginx:alpine

# Install bash (optional, for debugging)
RUN apk add --no-cache bash

# Copy Laravel app from PHP stage
COPY --from=php /var/www/html /var/www/html

# Copy nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/www/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
