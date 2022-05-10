# BE-INT2208_05

## Endpoint

| Endpoint                            | Method | Description                                 |
| ----------------------------------- | ------ | ------------------------------------------- |
| `/`                                 | GET    | Home                                        |
| `/user/protected-route`             | GET    | Test login                                  |
| `/user/login`                       | GET    | Login page                                  |
| `/user/register`                    | GET    | Register page                               |
| `/user/profile`                     | GET    | Get current user profile                    |
| `/user/forgot-password`             | GET    | Forget password page                        |
| `/user/activate-account/:id/:token` | GET    | Activate a new account                      |
| `/user/register`                    | POST   | Register a new user in DB                   |
| `/user/register-with-google`        | POST   | Register a new user with google email in DB |
| `/user/auth/login`                  | POST   | Check if given user is valid in DB          |
| `/user/auth/google-login`           | POST   | Setup/check GG linked account               |
| `/user/settings`                    | POST   | Change user information                     |
| `/user/logout`                      | GET    | Logout                                      |

## Detail description

<span style="color:#0cbb52; font-weight:700">GET</span>. **Verify Google Account**

```
    /user/auth/google-login
```

Check if the GG id token given by user is valid or not

**_Payload_**

| key                        | Description                       |
| -------------------------- | --------------------------------- |
| **_credential_**: `string` | The Google id token need verified |

**_Response_**

```json
    {
        "is_correct": boolean,
        "enough_data": boolean,
        "account_status": AccountStatus,
        "message": string,
        "user_data": UserDataObject
    }
```

| key          | Description                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| is_correct   | `true` if the id token is valid and vice                                                                          |
| enough_data  | `true` if data of {username, phone number, password} exist in DB                                                  |
| account_type | `NEW_ACCOUNT`: Have create yet <br />`EXISTENT_ACCOUNT`: Old account <br /> `undefined`: When is_correct is false |
| message      | server message                                                                                                    |
| user_data    | User Data                                                                                                         |

<span style="color:#ffb400; font-weight:700">POST</span>.
