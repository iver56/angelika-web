angelika-web
============

Frontend for project Angelika - health tracking.  
The backend is in a [separate repository](https://github.com/sigurdsa/angelika-api)

# Getting started

* Copy js/static.js.example to js/static.js
* If you don't have npm, install it.
* `npm install http-server -g`
* If you don't have make, install it

# Serve the application

Dev server for backend:
* Open a terminal
* Navigate to angelika-api
* Activate your virtual environment (use alias `A` for convenience)
* `make run`

Dev server for frontend:
* Open a terminal
* Navigate to angelika-web
* `make run`

You should now have two dev servers up and running:
* Frontend at localhost:8080
* Backend (API) at localhost:8000
