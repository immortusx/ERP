# Backend for New Keshav Vehicle CRM

This is the backend for the New Keshav Vehicle CRM system. It manages the database and provides the necessary APIs for the CRM application to function.

## Database

### Setup SQL FILE 
new_keshav_vehicle_crm.sql

### Database Name
- Database Name: new_keshav_vehicle_crm

### Database Static Data

Before you start using the app, you'll need to insert some initial data manually into the following tables:

1. `branches`: Information about different branches.
2. `departments`: Information about various departments.
3. `roles`: Information about super admin and user roles. ---> in roles table first Insert the role as super_admin

## Getting Started

To set up the backend, follow these steps:

1. Clone the repository:

   ```bash
   git clone <vehicle_erp_system>

cd server
npm install

nodemon index.js
npx nodemon index.js