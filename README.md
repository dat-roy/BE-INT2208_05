# BE-INT2208_05

## Endpoint

| Endpoint                  | Method | Description                        |
| ------------------------- | ------ | ---------------------------------- |
| `/`                       | GET    | Home                               |
| `/test/protected-route`   | GET    | Test login                         |
| `/test/login`             | GET    | Login page                         |
| `/test/register`          | GET    | Register page                      |
| `/test/profile`           | GET    | Get current user profile           |
| `/test/forgot-password`   | GET    | Forget password page               |
| `/user/register`          | POST   | Register a new user in DB          |
| `/user/auth/login`        | POST   | Check if given user is valid in DB |
| `/user/auth/google-login` | POST   | Setup/check GG linked account      |
| `/user/logout`            | GET    | Logout                             |
