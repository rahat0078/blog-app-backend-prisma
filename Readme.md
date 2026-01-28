# BlogSphere – Prisma blog app (Backend)

## Overview

The **BlogSphere** is a practice project that demonstrates a secure, role-based blogging platform built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**. The system uses **Better Auth** for modern authentication and authorization, including role-based access control at the API level.

This backend focuses on clean architecture, scalability, and maintainability, following real-world backend development practices.

---

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Authentication:** Better Auth
* **ORM:** Prisma
* **Database:** PostgreSQL
* **Language:** TypeScript

---

## Core Features

### Authentication & Authorization

* Authentication handled entirely by **Better Auth**
* Supports session-based authentication
* Role-based access control enforced at route level
* Supported roles:

  * `USER`
  * `ADMIN`

---

## Database Design

### Tables

#### User (Managed by Better Auth)

* id
* name
* email
* image
* emailVerified
* role (`USER | ADMIN`)
* createdAt

#### Post

* id
* title
* content
* thumbnail
* isFeatured
* tags
* views
* authorId (User)
* createdAt
* updatedAt

#### Comment

* id
* content
* postId
* authorId (User)
* parentId
* replies
* status (`APPROVED | REJECTED`)
* createdAt

---

## API Architecture

### App Initialization (`app.ts`)

```ts
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(notFound);
app.use(errorHandler);
```

---

## Post Routes

Base URL: `/posts`

| Method | Endpoint    | Access      | Description                            |
| ------ | ----------- | ----------- | -------------------------------------- |
| GET    | `/`         | Public      | Get all published posts                |
| GET    | `/stats`    | Public      | Get post statistics                    |
| GET    | `/my-posts` | USER, ADMIN | Get posts created by logged-in user    |
| GET    | `/:postId`  | Public      | Get single post by ID                  |
| POST   | `/`         | USER, ADMIN | Create a new post                      |
| PATCH  | `/:postId`  | USER, ADMIN | Update own post (Admin can update any) |
| DELETE | `/:postId`  | USER, ADMIN | Delete own post (Admin can delete any) |

---

## Comment Routes

Base URL: `/comments`

| Method | Endpoint               | Access      | Description               |
| ------ | ---------------------- | ----------- | ------------------------- |
| GET    | `/author/:authorId`    | Public      | Get comments by author    |
| GET    | `/:commentId`          | Public      | Get comment by ID         |
| POST   | `/`                    | USER, ADMIN | Create a comment          |
| PATCH  | `/:commentId`          | USER, ADMIN | Update own comment        |
| DELETE | `/:commentId`          | USER, ADMIN | Delete own comment        |
| PATCH  | `/moderate/:commentId` | ADMIN       | Approve or reject comment |

---

## Comment Moderation

* All comments are created with status `APPROVED`
* Admins can approve or reject comments
* Only approved comments are publicly visible

---

## Security

* Secure authentication via Better Auth
* API-level authorization
* Users can only manage their own resources
* Admins have full moderation access

---

## Performance & Scalability

* Pagination supported for posts
* Optimized Prisma relations
* Scalable relational schema

---

## ERD Diagram

The Entity Relationship Diagram (ERD) below represents the overall database structure of the application, including **Better Auth managed User tables**, **Posts**, and **Comments**, along with their relationships.

🔗 **ERD Diagram (Google Drive):**
[https://drive.google.com/file/d/1QJj6JnIa349KPVYOGX5EahRTXOInWxON/view?usp=sharing](https://drive.google.com/file/d/1QJj6JnIa349KPVYOGX5EahRTXOInWxON/view?usp=sharing)

This diagram helps visualize:

* One-to-many relationship between **User → Posts**
* One-to-many relationship between **User → Comments**
* One-to-many relationship between **Post → Comments**
* Role-based ownership and moderation flow

---

## Project Purpose

This project was built as a **practice backend application** to improve skills in:

* Prisma ORM
* Role-based authorization
* Secure API development
* Authentication with Better Auth

---

## Future Improvements

* Draft & publish states for posts
* Comment pagination
* Rate limiting
* Swagger API documentation
* Automated testing

---

## 🚀 How to Run the Project Locally

### Prerequisites

Ensure the following are installed on your system:

* **Node.js** (v18 or later recommended)
* **PostgreSQL**
* **npm** or **yarn**

---

### 1. Clone the Repository

```bash
git clone https://github.com/rahat0078/blog-app-backend-prisma.git
cd blog-app-backend-prisma
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Environment Variables Setup

Create a `.env` file in the root directory and configure the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/blogspheere"
PORT=5000
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="http://localhost:5000"
APP_USER=app user
APP_PASS=app password
GOOGLE_CLIENT_ID="google client id"
GOOGLE_CLIENT_SECRET=google client secret
ADMIN_EMAIL=admin-blogSphere@gmail.com
ADMIN_PASSWORD=admin1234@

```
> Replace database credentials with your local PostgreSQL configuration.

---

### 4. Prisma Setup

Run Prisma migrations and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```
(Optional) Open Prisma Studio:

```bash
npx prisma studio
```

---

### 5. Start the Development Server

```bash
npm run dev
```

The server will start at:

```
http://localhost:5000
```
