# Use official PHP image with Composer and required extensions
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Clear and cache configs
RUN php artisan config:clear && php artisan route:clear && php artisan cache:clear

# Generate app key if not set
RUN php artisan key:generate --force || true

# Expose port (Railway injects $PORT automatically)
EXPOSE 8080

# Run PHP's built-in server on /public
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t public"]
