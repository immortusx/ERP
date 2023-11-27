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
4. `distributionType`
5. `district`
6. `enquiry_fields`
7. `enquiry_lost_reasons`
8. `enquiry_primary_sources`
9. `enquiry_sources`
10. `features`
11. `leave_type`
12. `role_features`
13. `state`
14. `taluka`
15. `task_status`
16. `task_types`
17. `tasks`
18. `tasktime_period`
19. `tax_details`
20. `taxes`
21. `user_types`
22. `versions`
23. `village`

## Getting Started

To set up the backend, follow these steps:

1. Clone the repository:

   ```bash
   git clone <vehicle_erp_system>

cd server
npm install

nodemon index.js
npx nodemon index.js