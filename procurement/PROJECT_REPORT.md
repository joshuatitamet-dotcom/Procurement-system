# PROCUREMENT MANAGEMENT SYSTEM PROJECT REPORT

## Cover Page

**Project Title:** Procurement Management System  
**System Name:** FlowProcure  
**Prepared By:** ____________________  
**Registration Number:** ____________________  
**Department:** ____________________  
**Institution:** ____________________  
**Supervisor:** ____________________  
**Date:** ____________________

---

## Declaration

I declare that this project report is my own work and has not been submitted to any other institution for academic award. All sources of information used in this report have been acknowledged.

**Student Name:** ____________________  
**Signature:** ____________________  
**Date:** ____________________

---

## Abstract

This project is a Procurement Management System developed to help an organization manage its purchasing activities in a simple and organized way. In many organizations, procurement work is still done manually using paper files, phone calls, spreadsheets, and messages. This can lead to delays, loss of records, poor follow-up, and difficulty in tracking requests and suppliers.

The developed system provides a digital platform where users can register, log in, manage suppliers, create procurement requests, approve requests, create purchase orders, monitor deliveries, follow up invoices, and view reports. The system also includes a dashboard that gives a quick summary of what is happening in the procurement process.

The system was built using Next.js and React for the frontend, Express.js and Node.js for the backend, and MongoDB for database storage. The result is a web-based system that improves record keeping, saves time, reduces confusion, and makes procurement work easier to track.

---

## Acknowledgements

I thank God for the strength and wisdom to complete this project. I also appreciate my supervisor, lecturers, classmates, friends, and family members for their support, advice, and encouragement throughout the development of this work. Their guidance helped me to complete this project successfully.

---

## Table of Contents

1. Chapter One: Introduction  
2. Chapter Two: Literature Review  
3. Chapter Three: Methodology  
4. Chapter Four: Systems Analysis  
5. Chapter Five: Systems Design  
6. Chapter Six: Systems Implementation  
7. Chapter Seven: Conclusion  
8. Appendix A: References and Bibliography  
9. Appendix B: User and Technical Manual  
10. Appendix C: Sample Programs

---

## Chapter One: Introduction

### 1.1 Background of the Study

Procurement is an important activity in every organization because it helps in getting the goods and services needed for daily operations. These goods may include office items, equipment, raw materials, furniture, or maintenance services. When procurement is handled properly, work moves smoothly and resources are used well.

Many small and medium organizations still manage procurement manually. They record supplier details in books or spreadsheets, receive requests through paper forms or messages, and follow approval steps informally. This way of working causes many problems such as missing records, delayed approvals, repeated data entry, and poor communication between departments.

Because of these problems, there is a need for a computerized procurement system that can store records safely and help users monitor the full process from request creation to final order completion.

### 1.2 Problem Statement

The manual procurement process has several weaknesses:

- supplier records can be lost or scattered
- procurement requests can be delayed
- it is difficult to know which requests are pending, approved, or rejected
- purchase orders are not easy to track
- users may not have one central place to monitor procurement activities
- preparing reports takes more time

These problems reduce efficiency and make decision making more difficult.

### 1.3 Aim of the Project

The aim of this project is to design and develop a web-based Procurement Management System that helps users manage suppliers, procurement requests, approvals, purchase orders, and reports in one place.

### 1.4 Objectives of the Project

The objectives of this project are:

- to create a user-friendly procurement system
- to allow users to register and log into the system
- to store supplier details in a central database
- to allow departments to create procurement requests
- to support request approval and follow-up
- to generate purchase orders from approved requests
- to provide a dashboard for monitoring procurement activities
- to improve record keeping and reduce manual work

### 1.5 Significance of the Study

This project is important because it helps organizations improve their procurement process. The system saves time, reduces paperwork, improves tracking, and gives management a better view of procurement activities. It also helps students and developers understand how a real-world business system can be designed and implemented using modern web technologies.

### 1.6 Scope of the Study

This project covers:

- user registration and login
- email verification with OTP
- supplier management
- procurement request management
- approvals monitoring
- purchase order management
- receiving and invoice follow-up
- reports and dashboard summary

The project does not cover advanced finance integration, automatic payment processing, or enterprise-level audit controls.

### 1.7 Limitation of the Study

The following limitations were observed:

- the system depends on internet access
- email verification depends on SMTP service availability
- the system is designed mainly for small to medium use cases
- some advanced procurement policies are not yet automated

---

## Chapter Two: Literature Review

### 2.1 Introduction

This chapter explains ideas and previous knowledge related to procurement systems, web-based information systems, and database-driven applications.

### 2.2 Concept of Procurement

Procurement is the process of identifying needs, requesting items or services, selecting suppliers, placing orders, receiving goods, and confirming that the organization got the right item at the right time.

### 2.3 Manual Procurement Systems

Manual procurement systems are systems where records are kept using paper files, notebooks, spreadsheets, and informal communication. They are easy to start with, but they create many challenges when the amount of work grows.

Problems of manual systems include:

- poor record keeping
- duplication of work
- delay in approvals
- lack of transparency
- difficulty in generating reports

### 2.4 Computerized Procurement Systems

A computerized procurement system is a digital system that stores data electronically and supports the procurement workflow. Such systems help organizations work faster and more accurately. They also make it easier to search records and produce reports.

Benefits include:

- faster access to data
- better organization of supplier records
- easier request and order tracking
- improved accountability
- quicker report generation

### 2.5 Review of Related Technologies

This project uses the following technologies:

- **Next.js and React:** used to build the user interface
- **Node.js and Express.js:** used to build the backend server and API
- **MongoDB:** used to store data such as users, suppliers, requests, and orders
- **Mongoose:** used to define database models and connect the application to MongoDB
- **Nodemailer:** used to send OTP emails for user verification

### 2.6 Summary of Literature Review

From the review, it is clear that digital procurement systems are better than manual methods in speed, organization, and monitoring. This project was therefore developed to provide a simple web-based solution for procurement management.

---

## Chapter Three: Methodology

### 3.1 Introduction

This chapter explains the method used to develop the system.

### 3.2 Development Method Used

The project used an incremental development method. This means the system was built step by step. Each important part was added and improved over time. For example, the authentication module was built first, then supplier management, then requests, orders, dashboard, and reporting.

This method was chosen because:

- it allows testing in stages
- errors can be seen early
- features can be improved gradually
- it is easier to manage during development

### 3.3 Methods of Data Collection

Information for the project was collected through:

- observation of how procurement work is done
- reading books and online materials on procurement systems
- studying similar systems and web applications

### 3.4 Tools Used

The following tools were used during development:

- Visual Studio Code for coding
- Git and GitHub for version control
- Vercel for frontend deployment
- Render for backend deployment
- MongoDB for data storage
- Postman or browser testing for API checks

### 3.5 Why the Method Was Chosen

The method was chosen because it helped in building a working system in parts. It was also useful for testing each module before moving to the next one.

---

## Chapter Four: Systems Analysis

### 4.1 Introduction

System analysis focuses on understanding the existing problem and identifying what the new system should do.

### 4.2 Analysis of the Existing System

In the existing manual process:

- supplier details may be stored in different places
- request approval can be slow
- users may not know the current status of orders
- report preparation may be difficult
- communication may depend too much on phone calls or verbal updates

### 4.3 Problems Identified

The main problems identified are:

- lack of a central database
- poor tracking of procurement activities
- slow decision making
- possible loss of records
- weak reporting process

### 4.4 Analysis of the Proposed System

The proposed Procurement Management System solves the identified problems by providing one online platform where all procurement information can be stored and managed.

The system allows users to:

- create accounts and log in
- manage suppliers
- raise procurement requests
- track request approval status
- create and manage purchase orders
- view progress from dashboard pages
- generate simple reports

### 4.5 Functional Requirements

The system should be able to:

- register users
- verify user email using OTP
- log users in and out
- add, update, view, and delete suppliers
- add, update, view, and delete procurement requests
- create, update, view, and delete purchase orders
- display procurement summaries on the dashboard
- show user and report information

### 4.6 Non-Functional Requirements

The system should:

- be easy to use
- respond within reasonable time
- store records safely
- work on modern web browsers
- allow future improvement and expansion

---

## Chapter Five: Systems Design

### 5.1 Introduction

This chapter explains how the system was structured.

### 5.2 General System Architecture

The system uses a three-part structure:

1. **Frontend:** the part users see and interact with  
2. **Backend:** the part that handles logic and requests  
3. **Database:** the part that stores records permanently

### 5.3 Frontend Design

The frontend was developed with Next.js and React. It contains pages such as:

- home page
- register page
- login page
- dashboard page
- suppliers page
- requests page
- approvals page
- orders page
- receiving page
- invoices page
- reports page
- users page
- audit log page

The pages are designed to help users move through the procurement process easily.

### 5.4 Backend Design

The backend was developed using Express.js and Node.js. It provides API routes for:

- authentication
- suppliers
- procurement requests
- purchase orders
- users

The backend receives requests from the frontend, processes them, interacts with the database, and returns results.

### 5.5 Database Design

MongoDB was used as the database. The main collections include:

- **Users**
- **Suppliers**
- **Procurement Requests**
- **Purchase Orders**

### 5.6 Main Data Fields

Some major data fields in the system are:

- **User:** email, password, role, verification status
- **Supplier:** name, email, phone, status
- **Procurement Request:** item name, quantity, department, status
- **Purchase Order:** request reference, supplier reference, status

### 5.7 Input Design

Users enter data through forms such as:

- registration form
- login form
- supplier form
- request form
- order form
- OTP verification form

### 5.8 Output Design

The system produces outputs such as:

- success or error messages
- supplier lists
- request lists
- order lists
- dashboard summary cards
- report summaries

---

## Chapter Six: Systems Implementation

### 6.1 Introduction

This chapter explains how the system was built and tested.

### 6.2 Programming Languages and Tools Used

The following languages and tools were used:

- JavaScript
- TypeScript in some frontend files
- HTML and CSS through Next.js components and styling
- Node.js runtime
- MongoDB database

### 6.3 Hardware Platform

The system can run on:

- a laptop or desktop computer
- internet-enabled environment
- modern web browser

Minimum requirement:

- at least 4 GB RAM
- stable internet connection
- browser such as Chrome, Edge, or Firefox

### 6.4 Software Platform

The software used includes:

- Windows operating system during development
- Visual Studio Code
- Node.js
- MongoDB
- Git and GitHub
- Vercel
- Render

### 6.5 Implementation Details

The implementation was done in modules:

#### Authentication Module

This module allows users to create accounts, receive OTP email verification codes, verify their email, log in, and log out.

#### Supplier Module

This module allows users to add supplier details, edit supplier information, view suppliers, and delete supplier records.

#### Request Module

This module allows users to create procurement requests by entering the item name, quantity, and department. Requests can also be updated or removed.

#### Approval Module

This module helps users monitor requests that are pending, approved, or rejected. It gives visibility into which requests need action.

#### Purchase Order Module

This module links a request to a supplier and creates a purchase order. It helps the organization track the order from the time it is issued.

#### Dashboard Module

This module shows a summary of procurement activities, such as total suppliers, total requests, pending approvals, and total orders.

#### Reports Module

This module gives a general view of procurement activities and helps users understand what is happening in the system.

### 6.6 Testing

The system was tested by checking whether each module works correctly. The following tests were carried out:

- user registration test
- user login test
- OTP verification test
- supplier creation test
- supplier update and delete test
- request creation test
- order creation test
- dashboard data display test
- report display test

### 6.7 Sample Test Table

| Test Item | Expected Result | Actual Result | Status |
| --- | --- | --- | --- |
| User registration | User account should be created | Account created successfully | Pass |
| Login | User should access dashboard | User logged in | Pass |
| Add supplier | Supplier should be saved | Supplier saved | Pass |
| Create request | Request should be stored | Request stored | Pass |
| Create order | Order should be saved | Order saved | Pass |
| Dashboard view | Summary should appear | Summary displayed | Pass |

### 6.8 Challenges Encountered

Some challenges faced during the project include:

- backend connection timeouts
- email delivery problems during OTP sending
- deployment issues between frontend and backend services
- handling communication between the frontend proxy and backend API

### 6.9 How the Challenges Were Handled

The challenges were handled by:

- checking server configuration
- improving backend request timeout handling
- reviewing deployment settings
- testing API routes carefully
- improving error messages for easier debugging

---

## Chapter Seven: Conclusion

### 7.1 Summary

This project successfully developed a web-based Procurement Management System that helps users manage procurement work in one place. The system supports user authentication, supplier management, request handling, approvals, purchase orders, dashboard monitoring, and reporting.

### 7.2 Achievements

The project achieved the following:

- reduced dependence on manual procurement records
- improved organization of supplier and request data
- provided a simple and modern interface
- created a central system for procurement tracking
- improved access to procurement information

### 7.3 Constraints

The project still has some constraints:

- it depends on internet and server availability
- email verification depends on external mail service
- some advanced procurement and finance features are not yet included

### 7.4 Recommendations

For future improvement, the following can be added:

- role-based access control for different user levels
- automatic email or SMS notifications
- downloadable PDF reports
- inventory integration
- payment and invoice approval workflow
- stronger audit trail and activity history

### 7.5 Conclusion

In conclusion, the Procurement Management System is a useful solution for improving procurement activities in an organization. It reduces manual work, improves tracking, and makes the process easier to manage. The project shows how modern web technologies can be used to solve real business problems in a simple and practical way.

---

## Appendix A: References and Bibliography

1. Next.js Documentation.  
2. React Documentation.  
3. Node.js Documentation.  
4. Express.js Documentation.  
5. MongoDB Documentation.  
6. Mongoose Documentation.  
7. Nodemailer Documentation.  
8. Books and online materials on procurement management and information systems.

---

## Appendix B: User and Technical Manual

### User Manual

#### How to Use the System

1. Open the system in a web browser.  
2. Create an account using the register page.  
3. Verify your email using the OTP sent to your email.  
4. Log in to the system.  
5. Use the dashboard to view procurement activity.  
6. Add suppliers in the suppliers section.  
7. Create procurement requests in the requests section.  
8. Review approvals in the approvals section.  
9. Create and monitor orders in the orders section.  
10. View reports in the reports section.

### Technical Manual

#### Frontend

- Built with Next.js and React
- Contains pages and components for system interface
- Uses API routes to communicate with backend services

#### Backend

- Built with Node.js and Express.js
- Handles authentication, suppliers, requests, orders, and users
- Connects to MongoDB using Mongoose

#### Database

- MongoDB stores the application data
- Main models are Users, Suppliers, Procurement Requests, and Purchase Orders

#### Deployment

- Frontend can be deployed on Vercel
- Backend can be deployed on Render

---

## Appendix C: Sample Programs

### Sample 1: Supplier Model

```js
const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  status: { type: String, default: "Active" }
});
```

### Sample 2: Procurement Request Model

```js
const ProcurementRequestSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  department: { type: String, required: true },
  status: { type: String, default: "Pending" }
});
```

### Sample 3: Purchase Order Model

```js
const PurchaseOrderSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProcurementRequest",
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },
  status: { type: String, default: "Ordered" }
});
```

### Sample 4: Authentication Route

```js
router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
```

---

## Final Note

This report is written in simple language so it can be easy to understand. You can now replace the blank spaces on the cover page and declaration page with your personal school details.
