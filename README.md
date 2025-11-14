# test-laravel-12

How to setup project
- composer install
- rm package-lock.json
- npm install
- cp .env.example .env
- php artisan key:generate
- php artisan migrate
- composer run dev

- command pull branch in githug is:
    - git branch -a
    - git checkout your branch name

- Seed roles and permissions
    - php artisan db:seed --class=RolesAndPermissionsSeeder
    - php artisan db:seed --class=TypeSeeder
    - php artisan db:seed --class=UserSeeder
# Laravel12
# Laravel12

- npm i --legacy-peer-deps# Laravel12-ATA
# Laravel12-PGMarket

# Update DB
ALTER TABLE `queue_jobs` ADD `order_id` BIGINT UNSIGNED NULL DEFAULT NULL AFTER `job_type`;
ALTER TABLE `queue_jobs` ADD `respone_log` TEXT NULL DEFAULT NULL AFTER `note`;
# Laravel12-TFL-New-New
