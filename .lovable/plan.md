

# Grant Admin Privileges to kevonna@ncrfoundation.org

## Current State
- User exists: `f3ee281a-6dce-41aa-a4d2-4a297e09a4f4`
- Currently has only the `player` role in `user_roles`
- Admin login page (`/admin/login`) checks `user_roles` for `role = 'admin'`

## Change
Insert an `admin` role row into `user_roles` for this user:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('f3ee281a-6dce-41aa-a4d2-4a297e09a4f4', 'admin');
```

This is a single data insert — no schema changes, no code changes needed. After this, she can log in at `/admin/login` with her existing credentials and access the admin dashboard.

## Files Changed
None — data-only operation.

