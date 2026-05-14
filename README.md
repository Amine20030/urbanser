# UrbanOps — Smart City Incident Management Platform

## Overview

UrbanOps is a full-stack smart city platform designed to modernize the management of urban incidents and municipal services.

The application allows citizens to report incidents such as:

* Road damage
* Garbage issues
* Water leaks
* Street light failures
* Traffic problems

The platform provides:

* Incident reporting
* Interactive map visualization
* AI-assisted analysis
* Administrative dashboard
* Alerts and notifications
* JWT authentication and role management

---

# Tech Stack

## Frontend

* Next.js 14
* React
* TypeScript
* Tailwind CSS
* Axios
* Leaflet
* Recharts
* Framer Motion

## Backend

* Spring Boot 3.2.5
* Java 17
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* PostgreSQL
* Swagger / OpenAPI
* Maven

## Database

* PostgreSQL 16

---

# Architecture

```text
Frontend (Next.js)
        ↓
REST API Controllers
        ↓
Service Layer
        ↓
Repository Layer (JPA)
        ↓
PostgreSQL Database
```

Backend follows a layered Spring Boot architecture:

```text
controller/
service/
repository/
entity/
dto/
security/
config/
```

---

# Features

## Authentication & Security

* JWT authentication
* Role-based authorization
* Spring Security integration
* BCrypt password hashing

## Incident Management

* Create incidents
* Upload incident photos
* Filter incidents
* Incident tracking
* Status updates
* Incident categorization

## Dashboard & Analytics

* Real-time statistics
* Interactive charts
* Map visualization
* Recent incidents

## AI Integration

* Gemini AI integration
* Automatic incident analysis
* Smart categorization support

## Notifications

* Email alerts
* Authority notification system

---

# Installation

## Prerequisites

Install:

* Java 17
* Node.js 18+
* PostgreSQL 16
* Maven
* Git

---

# Clone Repository

```bash
git clone https://github.com/realkhalil/SmartCity.git
cd SmartCity
```

---

# Database Setup

Open PostgreSQL and create database:

```sql
CREATE DATABASE urbanops_db;
```

Update backend configuration:

```properties
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/urbanops_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

---

# Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8081/api
```

Swagger UI:

```text
http://localhost:8081/api/swagger-ui.html
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# API Documentation

Swagger/OpenAPI is available at:

```text
http://localhost:8081/api/swagger-ui.html
```

Main endpoints:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/incidents
POST /api/incidents
GET  /api/stats/dashboard
GET  /api/categories
GET  /api/sectors
```

---

# JWT Authentication Flow

```text
User Login
→ Spring Security Authentication
→ JWT Token Generation
→ Frontend stores token
→ Protected API requests use Bearer Token
```

---

# Testing

Backend testing tools:

* JUnit 5
* Mockito
* JaCoCo
* SonarQube

Run tests:

```bash
mvn test
```

---

# Project Goals

The objective of UrbanOps is to provide:

* Faster urban incident response
* Better communication between citizens and authorities
* Data-driven smart city monitoring
* Modern digital municipal services

---

# Authors

Developed as a Smart City academic project using Spring Boot and Next.js.

Repository:

```text
https://github.com/realkhalil/SmartCity
```
