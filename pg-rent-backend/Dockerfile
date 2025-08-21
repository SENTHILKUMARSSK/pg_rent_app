# Use PHP with FPM (production)
FROM php:8.2-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git unzip zip libzip-dev libpng-dev libonig-dev libxml2-dev curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Optimize Laravel
RUN php artisan config:clear && php artisan route:clear && php artisan cache:clear
RUN php artisan key:generate --force || true

# Expose Railway’s dynamic port
EXPOSE 8080

# Run Laravel on Railway’s port (serving public folder)
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
