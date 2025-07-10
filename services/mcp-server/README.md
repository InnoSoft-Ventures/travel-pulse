# MCP Server (Message Control Protocol)

A lightweight server that provides a secure interface for querying the Travel Pulse database.

## Overview

The MCP server acts as a middleware between clients and the PostgreSQL database, providing a safe way to execute SELECT queries while maintaining security and data integrity.

## Getting Started

### Prerequisites

-   Node.js
-   PostgreSQL database
-   pnpm (package manager)

### Installation

```bash
cd services/mcp-server
pnpm install
```

### Environment Variables

Create a `.env` file with the following variables:

```env
MCP_PORT=3001
POSTGRES_USER=devuser
POSTGRES_HOST=localhost
POSTGRES_DB=travelpulse_db
POSTGRES_PASSWORD=devpass
POSTGRES_PORT=5432
```

### Running the Server

```bash
pnpm run dev
```

## API Endpoints

### Health Check

```bash
GET /health
```

Returns server status.

### Query Endpoint

```bash
POST /query
Content-Type: application/json

{
  "query": "YOUR_SQL_QUERY"
}
```

#### Security Restrictions

-   Only SELECT queries are allowed
-   Queries are executed with proper parameterization
-   Results are returned in JSON format

## Database Structure

The complete database schema can be found in `services/backend/src/db/migrations/`. Key tables include:

-   countries
-   operators
-   providers
-   users

## Example Queries

### Find Country by ISO2

```bash
curl -X POST http://localhost:3001/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM countries WHERE iso2 = '\''ZA'\''"
  }'
```

### Find Operators by Country

```bash
curl -X POST http://localhost:3001/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT o.*, c.name as country_name FROM operators o JOIN countries c ON o.country_id = c.id WHERE c.id = 247"
  }'
```

### List Distinct Providers

```bash
curl -X POST http://localhost:3001/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT DISTINCT provider FROM operators ORDER BY provider"
  }'
```

### Check Table Structure

```bash
curl -X POST http://localhost:3001/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '\''table_name'\''"
  }'
```

## Current State

-   Providers: Airalo and EsimAccess
-   Operators: Various operators linked to countries
-   Users: Currently no users in the database
-   Countries: Comprehensive list of countries with their details

## Security Considerations

1. Only SELECT queries are allowed
2. Queries are executed with proper parameterization
3. Results are returned in JSON format
4. Database credentials are managed through environment variables

## Error Handling

The server returns appropriate error messages for:

-   Invalid queries
-   Database connection issues
-   Security violations
-   Server errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
