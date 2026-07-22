# 🤖 AI-Driven Client Intake & Intelligent Routing System

An automated, AI-powered client intake and ticket routing architecture built to streamline lead qualification, reduce operational friction, and ensure zero missed high-priority inquiries for **B Maluleka Attorneys**.

---

## 📌 Project Overview

Traditional legal client intake processes often suffer from manual bottlenecks, slow response times for routine inquiries, and delayed escalation for urgent legal matters. 

This workflow automates the full lifecycle of client intake:
1. Capturing client inquiries from a live web application in real time via webhooks.
2. Validating incoming request methods (`POST Filter`) and data payloads before downstream processing.
3. Automatically logging all client details (Name, Email, Contact Info, and Inquiry) to a central **Google Sheets Database** prior to AI evaluation.
4. Leveraging an **AI Agent with a RAG (Retrieval-Augmented Generation) Knowledge Base** to evaluate intent and complexity.
5. Dynamically routing inquiries between automated instant resolution (for standard FAQs) and immediate human escalation (for complex legal matters).

---

## 🏗️ System Architecture & Data Flow

```
┌────────────────────────┐
│  Client Intake Form    │ (Netlify Application / Frontend)
└───────────┬────────────┘
            │ HTTP POST Payload
            ▼
┌────────────────────────┐
│   Make.com Webhook     │ (Trigger)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│      POST Filter       │ [ HTTP Method & Method Validation ]
│  (Request Gatekeeper)  │ (Blocks GET pings / Postman GET tests)
└───────────┬────────────┘
            │ Valid POST Payloads
            ▼
┌────────────────────────┐
│   Validation Filter    │ [ Validate Message Exists ]
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│     Google Sheets      │ [ Add a Row Module ]
│  (Central Database)    │ (Logs: Name, Email, Contact, Message, Timestamp)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Make AI Agent        │ ◄───► [ Knowledge Base / RAG Module ]
└───────────┬────────────┘       (Domain Knowledge & Context)
            │ Evaluates Intent & Categorization
            ▼
┌────────────────────────┐
│   Logical Router       │
└─────┬────────────┬─────┘
      │            │
      │ Is FAQ     │ Needs Human Attention
      ▼            ▼
┌───────────┐  ┌─────────────────────────────────┐
│ Gmail     │  │ Gmail                           │
│ (Instant  │  │ (Priority Escalation to Firm   │
│ Client    │  │  Director/Legal Team)           │
│ Reply)    │  └─────────────────────────────────┘
└───────────┘
```

---

## ⚡ Detailed Workflow Breakdown

### 1. Webhook Entry Point (`Webhooks`)
* **Module:** Custom Webhook Trigger
* **Function:** Listens continuously for HTTP POST payload submissions from the frontend client intake form hosted on Netlify.
* **Payload Structure:** Extracts key parameters including client name, contact details, subject, and detailed message body.

### 2. Request Validation Gatekeeper (`POST Filter`)
* **Type:** Entry-Gate Filter
* **Placement:** Positioned immediately after the initial Webhook trigger module.
* **Filter Name:** `POST Filter`
* **Function:** Inspects request metadata to verify that the HTTP request method is strictly `POST` and/or contains required POST body attributes.
* **Business Impact:** Filters out non-actionable traffic such as preliminary `GET` requests from browser visits, automated service pings, or GET request executions during testing in Postman. Prevents wasted Make.com operational credits and eliminates error logs caused by processing empty `GET` requests through downstream database and AI modules.

### 3. Quality Control & Field Validation (`Validate Message Exists`)
* **Type:** Inline Filter
* **Rule:** Checks whether `Message` and `Contact Information` exist and are non-empty.
* **Purpose:** Prevents downstream database clutter and AI processing charges on corrupted, incomplete, or spam submissions.

### 4. Centralized Database Logging (`Google Sheets: Add a Row`)
* **Module:** Google Sheets (`Add a Row`)
* **Function:** Immediately records every valid client intake payload into the `B Maluleka Client Intake Log` master spreadsheet.
* **Recorded Parameters:** `Timestamp`, `Full Name`, `Email`, `Phone / Contact Information`, and `Message Body`.
* **Reliability Architecture:** Positioned **before** the AI processing step to guarantee zero data loss in the event of downstream API limits or third-party outages.

### 5. AI Processing & Knowledge Integration (`Make AI Agent + Knowledge Base`)
* **Module:** Make AI Agent connected to a specialized Knowledge Base (RAG).
* **Function:** Analyzes the sentiment, urgency, and technical domain of the client's request. Cross-references the request against legal service guidelines, consultation fee rules, and operational boundaries defined in the Knowledge Base.
* **Output:** Categorizes the inquiry status (e.g., `FAQ_ROUTINE` vs. `REQUIRES_HUMAN_ATTENTION`) and generates an appropriate response draft.

### 6. Decision Engine (`Router`)
* **Module:** Multi-Branch Router
* **Path A: `Is FAQ` Branch**
  * **Trigger Condition:** AI Confidence score high for routine inquiries (e.g., business hours, fee schedules, consultation processes).
  * **Action:** Fires a personalized, instant **Gmail** response to the client containing accurate answers sourced directly from the Knowledge Base.
* **Path B: `Needs Human Attention` Branch**
  * **Trigger Condition:** High-stakes, complex legal matters, custom case evaluations, or sensitive escalations.
  * **Action:** Triggers an immediate high-priority **Gmail** notification sent directly to the Director/Senior Attorney with a summary of the client's problem, risk level, and full contact history.

---

## 🛠️ Technology Stack

| Domain | Technology / Tool |
| :--- | :--- |
| **Automation Platform** | Make.com |
| **Validation & Filtering** | `POST Filter` (Method Isolation), Data Integrity Filters |
| **Database & Persistence** | Google Sheets API (`Add a Row`) |
| **AI & LLM Integration** | Make AI Agent, Knowledge Base (RAG), Custom System Prompts |
| **Frontend Integration** | HTML5, CSS3, JavaScript (Fetch API), Netlify Hosting |
| **Integrations** | Custom Webhooks, Gmail API |
| **Testing & Verification** | Playwright (E2E), Postman (API/Webhook & HTTP Method Validation) |

---

## 🧪 Quality Assurance & Testing Rigor

In alignment with **ISTQB** and **IREB** standards, this workflow was validated through a multi-tiered QA testing strategy:

1. **HTTP Method & Webhook Validation (Postman):**
   * Validated scenario behavior when sending `GET` vs `POST` requests. Confirmed that `GET` requests (e.g., accidental GET executions during testing) are cleanly stopped at the `POST Filter` step without triggering Google Sheets or AI modules.
   * Validated payload structures, HTTP status codes (`200 OK`, `400 Bad Request`), header content-types, and edge-case handling for missing fields.
2. **Database & Data Integrity Testing:**
   * Verified row creation, column mapping accuracy, date-time formatting, and handling of special characters/multiline string payloads in Google Sheets.
3. **End-to-End UI Testing (Playwright):**
   * Automated cross-browser test scripts ensuring form submission integrity, DOM element validation, and success notification feedback across desktop and mobile viewports.
4. **AI Logic & Edge Case Evaluation:**
   * Executed test matrix scenarios covering ambiguous prompts, multi-part inquiries, and deliberate prompt injection attempts to ensure robust routing logic.

---



---

## 👨‍💻 Author & Maintainer

**Sbonelesihle Romeo Khumalo**  
*AI Workflow Specialist | QA Engineer | Technical Business Analyst*  
* **Certifications:** ISTQB® Foundation Level, IREB® CPRE, Certified Make.com Architect  
* **GitHub:** [romeombulazi-source](https://github.com/romeombulazi-source)  
* **LinkedIn:** [Sbonelesihle Khumalo](https://linkedin.com/in/sbonelesihle-khumalo-a55b64164)
