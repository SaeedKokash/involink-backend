Here's a brief overview of each table and its role in your MVP:

accounts

Financial accounts associated with a store.
Used for tracking payments and transactions.
users

Stores user information.
Users can have roles and permissions.
store

Represents the merchant's store.
Contains store-specific information.
user_stores

Associates users with stores.
Handles many-to-many relationships between users and stores.
permissions

Defines permissions that can be assigned to roles or users.
roles

Defines different user roles (e.g., merchant, admin).
(Assumed to be present due to user_roles and role_permissions tables).
user_roles

Associates users with roles.
Manages many-to-many relationships between users and roles.
user_permissions

Associates users with permissions.
Allows assigning permissions directly to users.
contacts

Stores information about customers or clients.
Used when creating invoices and RTP requests.
items

Products or services offered by the store.
Used in invoices.
taxes

Tax rates applicable to items.
Applied when calculating invoice totals.
invoices

Records invoices created by the merchant.
Contains billing details and status.
invoice_items

Line items associated with each invoice.
References items and includes quantity, price, etc.
invoice_histories

Tracks changes in invoice status.
Useful for auditing and history.
transactions

Records payment transactions.
Updated when an RTP is completed.
request_to_pay

Manages the RTP process for invoices.
Contains details required for RTP initiation.
media

Stores metadata about media files (e.g., PDFs).
Used to store generated invoice PDFs.
mediables

Polymorphic table associating media with other entities.
Links invoice PDFs to invoices.