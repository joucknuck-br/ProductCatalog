#   Project Documentation: Product Catalog Application

###   Overview

The Product Catalog Application is a web-based system that allows users to manage and browse products and categories. It consists of a backend RESTful API built with Spring Boot, a MySQL database for data storage, and a frontend interface developed with React. The application is designed to be containerized and orchestrated using Docker and Docker Compose for easy setup and deployment.

###   Functionality

* **Product Management:** The system supports creating, reading, updating, and deleting products. Products have attributes such as name, description, SKU, price, and stock quantity, and are associated with a specific category.
* **Category Management:** Categories can be organized in a hierarchical structure, allowing for nested categories. The system supports CRUD operations for categories, including the ability to manage category paths.
* **User Authentication:** The backend API is secured with JWT (JSON Web Token) authentication. Users can log in to obtain a token, which is then used to authorize requests to protected API endpoints.
* **Frontend Interface:** The frontend provides a user-friendly interface for browsing products and categories. It interacts with the backend API to display data and perform actions.
* **Data Persistence:** MySQL is used as the database to store product and category data. The database schema is defined in SQL scripts.

###   Technology Stack

* **Backend:** Spring Boot (Java).
* **Database:** MySQL.
* **Frontend:** React, TypeScript.
* **Containerization:** Docker, Docker Compose.
###   Project Structure

The project is organized into the following main directories:

* `backend`: Contains the Spring Boot backend application.
* `product-catalog-frontend`: Contains the React frontend application.
* `docker-compose.yml`: Defines the Docker Compose configuration for running the application.

###   Running the Application with Docker

1.  **Prerequisites:**
    * Docker installed on your machine.
    * Docker Compose installed on your machine.
2.  **Clone the Repository:**
    * `git clone https://github.com/joucknuck-br/ProductCatalog.git`
3.  **Navigate to the Project Root Directory:**
    * `cd ProductCatalog`
4.  **Start the Application:**
    * `docker-compose up --build`
5.  **Access the Application:**
    * Backend API: `http://localhost:8080/api`
    * Frontend: `http://localhost:5173`

###   Docker Compose Configuration

The `docker-compose.yml` file defines the services for the application:

* `db`: MySQL database service.
* `backend`: Spring Boot backend service, which depends on the `db` service.
* `frontend`: React frontend service, which depends on the `backend` service .

The services are configured to link together, with the backend able to access the database and the frontend able to access the backend. The MySQL database is initialized with the schema defined in `backend/DatabaseCreation.sql`