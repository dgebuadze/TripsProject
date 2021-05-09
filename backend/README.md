

## Trips API

Rest API for the Trips project

Instructions to run in local environment:

* Have XAMPP installed
* Have mysql database with name 'trips' (or change database name in .env file)
* Have composer installed

1. rename .env.example to .env
2. run "composer install" //install dependencies
3. run "php artisan key:generate" //generate application key
4. run "php artisan passport:keys" //generate keys for oauth2 server
5. run "php artisan migrate:fresh --seed" //create database tables and seed with generated data
6. run "php artisan serve" //serve the application on local server
7. use Postman test suite and Postman API collection for testing (Run in Postman):

Admin user:
- admin@trips.test
- Trips123

docs:
https://documenter.getpostman.com/view/8647437/TzRPi9Jp
