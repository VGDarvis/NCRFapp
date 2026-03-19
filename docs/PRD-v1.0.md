# NCRF College Expo App -- Product Requirements Document (PRD) v1.0

**Organization:** National College Resources Foundation (NCRF)
**Domain:** expo.collegeexpoapp.org
**Last Updated:** March 19, 2026

---

## 1. Product Overview

The NCRF College Expo App is a full-stack web application (React + Supabase) that serves as the digital platform for the National College Resources Foundation's college expo events across the United States. It provides a public-facing attendee experience, guest QR-code access, event management admin tools, and multiple program dashboards.

---

## 2. System Architecture

**Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
**Backend:** Supabase (PostgreSQL, Auth, Edge Functions, Realtime, Storage)
**State Management:** TanStack React Query
**Maps:** Mapbox GL
**Custom Domain:** expo.collegeexpoapp.org
**85+ database migrations, 7 Edge Functions, 50+ database tables**

---

## 3. User Roles & Access

| Role            | Access                                                     | Auth Method                              |
| --------------- | ---------------------------------------------------------- | ---------------------------------------- |
| Guest           | College Expo dashboard via QR code (`/guest/college-expo`) | No login required; session tracked       |
| Registered User | Full program dashboards, profile                           | Supabase Auth (email)                    |
| Admin           | Full admin dashboard (`/admin/dashboard`)                  | Supabase Auth + `user_roles` table check |

---

## 4. Core Systems

### 4.1 Landing Page (`/`)

- Animated NCRF logo selection hub with particle background
- Rotating logo circle linking to 5 program dashboards
- Navigation to Admin and Shop

### 4.2 Program Dashboards (`/dashboard`, `/auth/:program`)

Five distinct program dashboards, each with unique tabs:

| Program          | Dashboard Component    | Key Tabs                                               |
| ---------------- | ---------------------- | ------------------------------------------------------ |
| **College Expo** | `CollegeExpoDashboard` | Home, Maps, Schedule, Colleges (Vendors), Donors       |
| **STEAM**        | `SteamDashboard`       | Home, Learning, Labs, Projects, Community              |
| **Athlete**      | `AthleteDashboard`     | Home, Sports, Recruitment, Workshops, Stats, Community |
| **Movement**     | `MovementDashboard`    | Home, Programs, Mentors, Progress, Reviews, Community  |
| **Internships**  | `InternshipsDashboard` | Home, Jobs, Resume, Networking, Career Prep, Resources |

### 4.3 College Expo Guest Experience (`/guest/college-expo`)

- QR code scanned entry (tracked via `guest_sessions` table)
- Welcome tab with featured event hero, expo flyers gallery, scholarship booklets
- Interactive maps (Mapbox) with booth markers and venue location
- Schedule with seminar sessions, calendar/timeline views
- Vendors/Colleges directory with filtering
- Floor plan viewer with booth detail drawers and favorites
- Donor information display
- Real-time event updates via Supabase Realtime

### 4.4 Admin Dashboard (`/admin/dashboard`)

Protected by role-based access control (`user_roles` table). Modules:

- **Dashboard Home:** Metrics grid (Total App Users, QR Scans Today, Active Now, Popular Booths), Event Management panel, Quick Actions
- **Analytics:** Dashboard tab, Program analytics, CRM analytics, HR analytics, Event engagement, QR analytics, AI search panel
- **Expos:** Booth editor, floor plan editor/uploader, zone manager, booth grid positioning, CSV importers (Houston, Dallas, Seattle exhibitors)
- **Seminars:** Seminar session management, stage performances, room assignments
- **Exhibitors:** Exhibitor directory, CSV importers, exhibitor cards
- **Settings:** QR code generator (entrance, booth, promotional codes)

Session management with timeout warnings (`useSessionManager`).

### 4.5 Event Registration (`/join-college-expo`, `/college-expo`)

- Registration form with first/last name, email, phone, school, grade level
- QR code generation per registration
- Confirmation email via Edge Function (`send-registration-confirmation`)
- Check-in tracking with timestamps

### 4.6 Shop System (`/shop`)

- Product catalog from `shop_items` table
- Category browsing, product detail pages with image galleries
- Color and size selectors
- Cart system (`cart_items` table)
- Checkout flow with orders and order items
- Currently shows "Coming Soon" toast

### 4.7 School Finder (`/school-finder`)

- Search across `school_database` table (high schools, HBCUs)
- Filter panel, county suggestions
- AI-powered school enrichment via Edge Function
- Web scraping for school data

---

## 5. Database Tables (50+ tables, grouped by domain)

### Core / Auth

`profiles`, `user_roles`, `admin_preferences`, `admin_sessions`, `admin_audit_logs`, `activity_logs`, `system_settings`

### Events & Expos

`events`, `expo_events`, `event_tags`, `event_attendance`, `saved_events`, `registrations`, `venues`, `floor_plans`, `booths`, `booth_check_ins`, `booth_presets`, `seminar_rooms`, `seminar_sessions`, `exhibitors`, `donor_information`, `sponsors`, `advertisements`

### Guest & Analytics

`guest_sessions`, `guest_analytics`, `analytics_summary`, `ai_search_queries`, `performance_metrics`, `import_jobs`

### CRM & Messaging

`crm_contacts`, `crm_interactions`, `crm_organizations`, `crm_tags`, `messages`, `message_templates`, `bulk_campaigns`

### HR

`employees`, `departments`, `employee_documents`, `hr_onboarding`

### Education & Outreach

`school_database`, `counties`, `college_prep_resources`, `outreach_search_lists`, `beta_interest`

### Scholarships

`scholarship_opportunities`, `scholarship_applications`, `scholarship_booklets`, `booklet_scholarships`, `booklet_downloads`, `scholarship_tips`

### Esports / Gaming

`teams`, `team_members`, `team_invites`, `team_chat_messages`, `team_notes`, `tournaments`, `match_results`, `practice_sessions`, `player_achievements`, `seasonal_passes`, `payouts`, `disputes`

### Athlete Program

`athlete_profiles`, `athletic_achievements`, `coach_applications`, `college_connections`, `recruitment_events`, `skills_assessments`

### Career / Internships

`career_profiles`, `career_resources`, `job_applications`

### Movement Program

`movement_tutors`, `mentor_connections`

### Shop

`shop_items`, `cart_items`, `orders`, `order_items`

---

## 6. Edge Functions

| Function                         | Purpose                           | JWT      |
| -------------------------------- | --------------------------------- | -------- |
| `create-admin-user`              | Provisions admin accounts         | No       |
| `ai-search`                      | AI-powered search across data     | No       |
| `web-scrape-schools`             | Scrapes school websites for data  | No       |
| `ai-enrich-school`               | AI enrichment of school records   | No       |
| `get-mapbox-token`               | Returns Mapbox token securely     | No       |
| `scan-event-flyer`               | OCR/AI scan of event flyer images | Yes      |
| `send-registration-confirmation` | Sends confirmation emails         | Implicit |

---

## 7. Current State & Known Items

### Active / Working

- Landing page with program selection
- Guest college expo dashboard with QR session tracking
- Admin dashboard with metrics (mock data offset: +1000 users, +75 scans)
- Floor plan viewer and booth management
- Seminar session management
- Event registration with QR codes
- Exhibitor management with CSV importers
- Analytics dashboards

### Placeholder / Coming Soon

- Shop system (toast says "Coming Soon")
- Some quick actions show "coming in Phase 3-5"
- Several program dashboards have UI but limited real data

### Technical Notes

- Mock data config in `useExpoStats.ts` (toggle via `MOCK_DATA_CONFIG.enabled`)
- Favicon updated to NCRF branding (`icon-192x192.png`)
- Custom domain configured: `expo.collegeexpoapp.org`
- PWA manifest configured with NCRF icons
- Real-time subscriptions on events, floor plans, and seminars

---

## 8. Multi-Event Support

Events tracked across multiple cities with dedicated assets:
Houston, Dallas-Fort Worth, Seattle, Fresno, Los Angeles, Oakland, Atlanta, Miami, North Carolina, San Diego

Each event has: flyers, floor plans, booth data, exhibitor lists, seminar schedules.

---

## 9. Key Integrations

- **Supabase:** Auth, Database, Realtime, Edge Functions, Storage
- **Mapbox:** Interactive venue/event maps
- **QR Codes:** Registration check-in, booth tracking, guest access
- **Email:** Registration confirmation via Edge Function

---

## 10. Security

- Admin access: server-side role check via `user_roles` table (not client-side)
- Session management with timeout and warning dialogs
- Admin audit logging (`admin_audit_logs`)
- Activity logging (`activity_logs`)
- RLS enabled on tables

---

This PRD serves as the living baseline document. As we test and perfect each system, we will update the relevant sections with status changes, bug fixes, recommended actions, and new requirements.
