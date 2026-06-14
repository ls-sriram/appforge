# Database V2 Schema Target (Pre-Prod Reset)

## Scope
- Single app deployment model (no platform multi-tenant tables in app DB).
- One canonical internal user identity key across all user-owned tables.
- RLS enforced uniformly via `current_setting('app.user_id', true)`.

## Non-Negotiable Standards
1. Canonical user PK: `app_users.id` (`UUID` or `VARCHAR(26)` ULID).
2. External auth id stored once: `app_users.firebase_uid UNIQUE NOT NULL`.
3. User ownership FK name everywhere: `user_id`.
4. All closed states use constrained values (`CHECK` or enums).
5. No table stores transient UI flow state unless explicitly justified.

## Remove From App Schema
- `platform_applications`
- `platform_api_calls`
- `team_id` ownership concepts

## Core Identity
### `app_users`
- `id` PK (internal id)
- `firebase_uid` UNIQUE NOT NULL
- `email` NOT NULL
- `email_normalized` UNIQUE NOT NULL
- `display_name` NULL
- `created_at` NOT NULL
- `last_login_at` NULL

### `profiles`
- `id` PK
- `user_id` UNIQUE NOT NULL REFERENCES `app_users(id)` ON DELETE CASCADE
- `display_name` NULL
- `created_at` NOT NULL
- `updated_at` NOT NULL

Notes:
- Remove profile email duplication. Email source of truth is `app_users`.

## Onboarding (Normalized)
### `onboarding_questions`
- `id` PK
- `step_type` NOT NULL
- `field_key` NOT NULL
- `prompt` NOT NULL
- `question_type` NOT NULL CHECK (`single_select`, `multi_select`, `text`)
- `display_order` NOT NULL
- `is_active` NOT NULL DEFAULT true
- `created_at`, `updated_at`
- UNIQUE (`step_type`, `field_key`)

### `onboarding_question_options`
- `id` PK
- `question_id` NOT NULL FK
- `value_key` NOT NULL
- `label` NOT NULL
- `display_order` NOT NULL
- `is_active` NOT NULL DEFAULT true
- `created_at`, `updated_at`
- UNIQUE (`question_id`, `value_key`)

### `onboarding_state`
- `user_id` PK FK to `app_users(id)`
- `completed` NOT NULL DEFAULT false
- `completed_at` NULL
- `version` NOT NULL DEFAULT 1
- `updated_at` NOT NULL

Notes:
- Drop `current_step` from persisted model.

### `onboarding_responses`
- `id` PK
- `user_id` NOT NULL FK
- `question_id` NOT NULL FK
- `option_id` NULL FK
- `text_value` NULL
- `answered_at` NOT NULL

Constraints:
- CHECK exactly one answer mode:
  - `(option_id IS NOT NULL AND text_value IS NULL)` OR `(option_id IS NULL AND text_value IS NOT NULL)`
- UNIQUE (`user_id`, `question_id`, `option_id`) for option answers
- UNIQUE (`user_id`, `question_id`) where `text_value IS NOT NULL`

## Billing
### `billing_entitlements`
- `user_id` PK FK
- `plan` NOT NULL CHECK (`free`, `pro`, `trial`)
- `status` NOT NULL CHECK (`active`, `cancel_pending`, `canceled`, `past_due`, `trialing`)
- `started_at` NOT NULL
- `expires_at` NULL
- `source` NOT NULL CHECK (`manual`, `trial`, `dodo_payments`)
- `external_customer_id` NULL
- `external_reference_id` NULL
- `billing_type` NULL CHECK (`subscription`, `one_time`)
- `last_payment_amount_cents` NULL
- `last_payment_currency` NULL
- `created_at`, `updated_at`

Notes:
- Replace JSON `features` blob with normalized usage table.

### `billing_feature_usage`
- `user_id` NOT NULL FK
- `feature_key` NOT NULL
- `used` NOT NULL DEFAULT 0
- `limit_value` NULL
- `unlocked` NOT NULL DEFAULT true
- `updated_at` NOT NULL
- PK (`user_id`, `feature_key`)

### `billing_payments`
- `id` PK
- `user_id` NOT NULL FK
- `paid_at` NOT NULL
- `amount_cents` NOT NULL
- `currency` NOT NULL
- `plan_id` NOT NULL
- `email_sent_at` NULL
- `created_at` NOT NULL

### `billing_audit_records`
- `id` PK
- `webhook_id` NULL UNIQUE
- `occurred_at` NOT NULL
- `source` NOT NULL
- `payload` NOT NULL

## Sharing + Reviews + Entities
### `entities`
- PK (`id`, `user_id`)
- `category` NOT NULL
- `data` JSONB NOT NULL
- `created_at`, `updated_at`

### `reviews`
- PK (`id`, `user_id`)
- `entity_id`, `entity_category`, `entity_type` NOT NULL
- `author_role` NOT NULL
- `author_id`, `author_name`, `author_email` NULL
- `content` JSONB NOT NULL
- `created_at` NOT NULL

### `shares`
- `token` PK
- `user_id` NOT NULL FK
- `entity_id`, `entity_category` NOT NULL
- `entity_path` NULL
- `expires_at` NOT NULL
- `revoked_at` NULL
- `created_at` NOT NULL

### `share_slots`
- PK (`user_id`, `entity_key`)
- `token` NOT NULL FK
- `entity_id`, `entity_category` NOT NULL
- `original_user_id` NOT NULL FK
- `expires_at`, `created_at` NOT NULL

## Uploads
### `upload_records`
- `upload_id` PK
- `user_id` NOT NULL FK
- `type` NOT NULL
- `entity_id` NOT NULL
- `bucket` NOT NULL
- `object_name` NOT NULL
- `content_type` NOT NULL
- `size_bytes` NOT NULL
- `status` NOT NULL CHECK (`pending`, `processing`, `completed`, `failed`)
- `created_at` NOT NULL
- `expires_at` NULL

### `upload_processed_events`
- `id` PK (bounded deterministic id; no unbounded 1200-char keys)
- `bucket`, `object_name`, `generation`, `size_bytes` NOT NULL
- `content_type` NULL
- `event_time_epoch_seconds` NULL
- `processed_at` NOT NULL

## Early Access
### `early_access_entries`
- `email_normalized` PK
- `email` NOT NULL
- `status` NOT NULL CHECK (`waitlist`, `approved`, `rejected`)
- `created_at` NOT NULL
- `updated_at` NULL
- `approved_at` NULL

## RLS Standard
- Enable RLS for all user-owned tables.
- Policy form:
  - `USING (user_id = current_setting('app.user_id', true))`
  - `WITH CHECK (user_id = current_setting('app.user_id', true))`
- Composite owner tables (`entities`, `reviews`) still use `user_id` as ownership column.

## Naming Standard
- Identity FK column: `user_id` only.
- Temporal columns:
  - lifecycle create/update: `created_at`, `updated_at`
  - domain event time: `*_at` (`paid_at`, `occurred_at`, `completed_at`)
- Status columns must use closed controlled values.

## Rollout (Pre-Prod)
1. Rewrite baseline migration to this schema directly.
2. Regenerate SQL query files and repository mappings to new names.
3. Drop obsolete columns/tables (no compatibility layer).
4. Re-run integration suite and RLS checks.
