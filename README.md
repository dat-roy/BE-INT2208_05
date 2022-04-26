# BE-INT2208_05

## Endpoint

| Endpoint                  | Method | Description                        |
| ------------------------- | ------ | ---------------------------------- |
| `/`                       | GET    | Home                               |
| `/user/protected-route`   | GET    | Test login                         |
| `/user/login`             | GET    | Login page                         |
| `/user/register`          | GET    | Register page                      |
| `/user/profile`           | GET    | Get current user profile           |
| `/user/forgot-password`   | GET    | Forget password page               |
| `/user/activate-account/:id/:token`| GET | Activate a new account 	  |
| `/user/register`          | POST   | Register a new user in DB          |
| `/user/auth/login`        | POST   | Check if given user is valid in DB |
| `/user/auth/google-login` | POST   | Setup/check GG linked account      |
| `/user/settings`          | POST   | Change user information            |
| `/user/logout`            | GET    | Logout                             |
