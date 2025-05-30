# Identity-Reconciliation-
Bitespeed Backend Task


# 🧠 Bitespeed Backend Task - Identity Reconciliation

Welcome to the Identity Reconciliation service for Bitespeed! This backend service is designed to unify customer identities based on contact information, even when users like the eccentric **Doc Brown** place orders using multiple emails and phone numbers.

## 🚀 Live Demo

👉 Hosted on: [https://your-app-url.com](https://your-app-url.com)  
👉 Endpoint: `POST /identify`

## 🧩 Problem Statement

**FluxKart.com** collects customer data through Bitespeed to deliver personalized experiences. However, to maintain privacy, customers sometimes use different contact details for each transaction. This service identifies and links such multiple entries to a unified user identity using a relational model.

## 📊 Database Schema

The service uses a `Contact` table with the following structure:

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
