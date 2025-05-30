## Getting Started

### Prerequisites

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Install Node.js (v16+ recommended)

### Running the Application

1. Start containers:
   ```bash
   docker compose up -d
   ```
2. Seed database (after containers are running):

   ```bash
   npm run seed
   ```

   This populates the database with test data from `scripts/b2db-marketplace-seed.json`.

3. Access the application at:

   [http://localhost:3000](http://localhost:3000)

### Stopping the Application

1. Stop and remove containers:
   ```bash
   docker compose down
   ```

I'll update the README with Docker and MongoDB setup details. Here's the new section to add:

## Architecture Overview

### Docker & MongoDB Setup

- Uses Docker containers for MongoDB with persistent storage via named volumes
- Data is stored in `mongodb_data` volume (persists between container restarts)
- MongoDB container exposes port 27017 to the host

### Next.js API Routes

- API routes located in `pages/api/` directory
- Serverless functions handle database operations
- Uses MongoDB Node.js driver for database connectivity

### Key Libraries

- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn**: UI component library
- **Zod**: Schema validation library for API request validation
- **MongoDB Node.js Driver**: Official MongoDB driver for Node.js
