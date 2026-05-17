AI Use Case Tracker - Submission Notes
======================================

🚀 Completed Work
-----------------

I have extended the base application to include a robust "Stats" feature and improved the overall stability and data integrity of the platform.

-   **Data Integrity Fix:** Converted the `time_saved_minutes` column from `TEXT` to `INTEGER` in the SQLite schema to allow for accurate server-side mathematical aggregations.

-   **Stats API:** Created a new `/api/stats` endpoint using optimised SQL (`SUM` and `GROUP BY`) to calculate total time saved and per-tool breakdowns directly in the database.

-   **Global Error Handling:** Protected API endpoints with `try...catch` blocks. If an unexpected database or server error occurs, it is caught, logged on the server for debugging, and sent back to the frontend as a clean 500 Internal Server Error message. This prevents the backend from crashing and ensures the API always returns predictable JSON.

- **Consistent Data Formats & Validation:** Updated all API endpoints to return data using standard camelCase naming conventions (`aiTool`, `timeSavedMinutes`). This perfectly matches typical JavaScript/TypeScript coding styles and keeps data shapes uniform across the app. Also added validation checks to ensure that text inputs are neatly trimmed and time values are strictly valid, positive numbers.

- **Frontend Error Catching:** Added conditional checks to all frontend data-fetching functions. If the API returns an error (like a `400`, `404`, or `500`), the frontend intercepts it, extracts the error message, and displays a clear fallback message directly in the UI instead of failing silently or freezing the screen.

**Refined Frontend UX:**

-   **Empty States:** Added helpful fallback UI for the List view when no data is present in the database, ensuring a clean experience for first-time users.

-   **Persistent Forms:** Refactored form handlers to use a dedicated on-screen error element. If a validation fails, the user's typed data is preserved in the inputs, allowing them to correct mistakes without losing their progress to a full page reload.

-   **Time Formatting:** Created a shared utility to format large minute counts into a much more readable `Xh Ym` format.

* * * * *

🧪 Testing Strategy
-------------------

I implemented a testing suite using Vitest to ensure the core business logic is reliable and handles edge cases gracefully.

-   **Integration Tests:** Verified the `/api/stats` endpoint against multiple scenarios, including empty tables, single entries, and diverse tool sets.

-   **Unit Tests:** Validated the `formatTime` helper for edge cases (0 minutes, exact hours, and mixed hour/minute outputs).

### 💡 Conscious Omissions

To respect the time constraints of this task, I made the following strategic decisions regarding testing:

-   **UI Rendering Tests:** I prioritised testing data logic over manual DOM manipulation tests as I can manually test that for now.

-   **CRUD Coverage:** Assumed standard `GET` and `POST` behaviour for this prototype, focusing testing efforts on the more complex aggregation logic.

-   **E2E Testing:** Omitted browser-level testing (Cypress/Playwright) in favour of faster, high-confidence unit and integration tests.

* * * * *

🛠️ Future Roadmap & Technical Debt
-----------------------------------

While the current application is a stable prototype, I have identified the following priorities for a production-grade rollout:

### 1\. Architectural Transition (React)

The current Vanilla JS approach is suitable for small projects but becomes difficult to scale. Transitioning to a framework like React would allow for better state management, component reusability, and more predictable UI updates.

### 2\. Schema Validation (Zod)

I would implement Zod as a single source of truth for data models. This would provide end-to-end type safety, automatically validating data on both the frontend (forms) and backend (API requests), and providing more granular error messages to the user.

### 3\. RESTful API Expansion

-   **Targeted Deletion:** Replace the bulk cleanup script with a `DELETE /api/usecases/:id` endpoint for individual record management.

-   **Edit Functionality:** Add a `PATCH` endpoint to allow authors to update and refine existing use cases.

### 4\. Professional UX

-   **Loading States:** Add loading animations or spinners to improve perceived performance on the data-heavy Stats and List views.

### 5\. Ownership & Access Control

To support a multi-user environment, I would implement an Authentication and Authorization system (e.g., JWT or OAuth). By adding a `created_by` user ID to the `usecases` table, we could move away from global deletion to a "User Ownership" model. This ensures that users have the ability to manage their own contributions without the risk of accidentally modifying or deleting a colleague's data.
