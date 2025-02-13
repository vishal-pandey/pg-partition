# ITSM Incident Dashboard

This project demonstrates the importance of partitioning in PostgreSQL for optimizing query performance. It includes an Express.js backend and a simple frontend to display incidents from an ITSM (IT Service Management) system.

## Features

- Partitioned and non-partitioned tables for incidents
- Pagination and page size options
- Query response time display
- Toggle between partitioned and non-partitioned tables

## Prerequisites

- Docker
- Docker Compose

## Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/vishal-pandey/pg-partition.git
    cd itsm-incident-dashboard
    ```

2. Build and run the application using Docker Compose:

    ```sh
    docker-compose up --build
    ```

3. Open your browser and navigate to `http://localhost:5001`.

## Project Structure

- `backend/`: Contains the Express.js backend code.
- `backend/public/`: Contains the frontend code (HTML, CSS, JavaScript).
- `postgres/`: Contains the custom PostgreSQL Dockerfile.
- `init.sql`: SQL script to set up the database schema and generate fake data.
- `docker-compose.yml`: Docker Compose configuration file.

## How It Works

### Partitioned vs. Non-Partitioned Tables

The application uses two tables to store incidents:

1. `incidents`: A partitioned table.
2. `incident_og`: A non-partitioned table.

The `init.sql` script creates these tables and generates 1 million fake incidents in both tables. The partitioned table is divided into monthly partitions, while the non-partitioned table stores all incidents in a single table.

### Query Performance

The frontend allows you to toggle between fetching incidents from the partitioned and non-partitioned tables. It displays the query response time for each query, demonstrating the performance benefits of partitioning.

### Frontend Features

- **Load All Incidents (Partitioned)**: Fetches incidents from the partitioned table.
- **Load Open Incidents (Partitioned)**: Fetches open incidents from the partitioned table.
- **Load All Incidents (Original)**: Fetches incidents from the non-partitioned table.
- **Load Open Incidents (Original)**: Fetches open incidents from the non-partitioned table.
- **Pagination**: Navigate through pages of incidents.
- **Page Size**: Change the number of incidents displayed per page.
- **Go to Page**: Directly navigate to a specific page.

## Conclusion

This project demonstrates the importance of partitioning in PostgreSQL for optimizing query performance. By comparing the query response times for partitioned and non-partitioned tables, you can see the significant performance improvements that partitioning can provide.

Feel free to explore the code and experiment with different configurations to further understand the benefits of partitioning.