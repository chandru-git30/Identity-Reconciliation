# 🧠 Bitespeed Backend Task - Identity Reconciliation
Welcome to the Identity Reconciliation service for Bitespeed! This backend service is designed to unify customer identities based on contact information, even when users like the eccentric Doc Brown place orders using multiple emails and phone numbers.
## 🚀 Live Demo
👉 Hosted on: [https://identity-reconciliation-lqta.onrender.com](https://identity-reconciliation-lqta.onrender.com)  
👉 Endpoint: POST /identify
## 🛠️ API Usage
### Endpoint: /identify
Method: POST  
URL: https://identity-reconciliation.onrender.com/id

## 🧩 Problem Statement
**FluxKart.com** collects customer data through Bitespeed to deliver personalized experiences. However, to maintain privacy, customers sometimes use different contact details for each transaction. This service identifies and links such multiple entries to a unified user identity using a relational model.

## 📌 Features
- Accepts email and/or phone number
- Identifies whether the contact is primary or secondary
- Prevents duplicate users
- Returns consolidated user information
---
## 📦 Tech Stack
- Node.js – Backend runtime
- Express.js – Web framework
- Prisma ORM – Database interaction
- PostgreSQL – Relational database
---
## 🔧 Why Prisma?
- Type-safe and developer-friendly ORM
- Auto-generates models and types
- Easy to manage migrations and relationships
- Clean, readable syntax
---
## 🗃️ Why PostgreSQL?
- Strong relational database support
- Handles linked/related data efficiently
- Reliable and open source
- Works seamlessly with Prisma

  ## 📊 Database Schema
The service uses a Contact` table with the following structure:
```ts
{
  id: number,
  phoneNumber?: string,
  email?: string,
  linkedId?: number,           // references the primary contact
  linkPrecedence: "primary" | "secondary",
  createdAt: Date,
  updatedAt: Date,
  deletedAt?: Date
}

### Request Body:
```json
{
  "email": "john@example.com",
  "phoneNumber": "1234567890"
}
