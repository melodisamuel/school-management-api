School Management System API
A robust RESTful API built with the Axion framework, designed to manage school profiles, classrooms, and student enrollments with strict Role-Based Access Control (RBAC).

Features
Hierarchical RBAC:

Superadmins: Full system oversight and school creation.

School Admins: Management of classrooms and students limited to their specific school.

Classroom Management: Capacity tracking and resource allocation.

Student Lifecycle: Enrollment and transfer capabilities between classrooms within the same school.

Security: Integrated API Rate Limiting via Redis and JWT-based authentication.

Validation: Comprehensive input validation for every endpoint.

🛠️ Tech Stack
Runtime: Node.js

Framework: Axion (Cortex-based)

Database: MongoDB (Mongoose)

Cache/Rate Limiting: Redis

Documentation: Postman

Installation & Setup
Clone the repository:

Bash
git clone <https://github.com/melodisamuel/school-management-api.git>
cd axion
Install dependencies:

Bash
npm install
Environment Variables:
Create a .env file (or update config/):

Code snippet
MONGO_URI=mongodb://localhost:27017/school_management
REDIS_URL=redis://127.0.0.1:6379
PREFIX=axion
Run the application:

Bash
npm start
Testing with Postman
Import the collection and environment found in /tests/School_Management.postman_collection.json.

Register/Login to receive your JWT Bearer Token.

Use the Token in the Authorization tab for all School/Classroom/Student requests.

Project Structure
managers/entities: Core business logic for Schools, Classrooms, and Students.

managers/middlewares: RBAC and Rate Limiting logic.

loaders/MongoLoader.js: Automatic Mongoose model registration.
## Database Schema Design
- [cite_start]**Schools**: Managed by Superadmins (Full CRUD)[cite: 16, 17, 18].
- [cite_start]**Classrooms**: Tied to School ID; handles capacity and resources[cite: 22, 24, 25].
- [cite_start]**Students**: Tied to School/Classroom; supports enrollment and transfers[cite: 26, 28].

## Deployment Instructions
- [cite_start]**Local**: Use `docker-compose up` for MongoDB and Redis[cite: 69].
- [cite_start]**Production**: Hosted on Render with MongoDB Atlas and Upstash Redis[cite: 67].
