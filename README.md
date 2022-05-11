# BE-INT2208_05

## Endpoint

| Endpoint                            | Method | Description                                 |
| ----------------------------------- | ------ | ------------------------------------------- |
| `/`                                 | GET    | Home                                        |
| `/user/register`                    | POST   | Register a new user in DB                   |
| `/user/register-with-google`        | POST   | Register a new user with google email in DB |
| `/user/activate-account/:id/:token` | GET    | Activate a new account                      |
| `/user/auth/login`                  | POST   | Check if given user is valid in DB          |
| `/user/auth/google-login`           | POST   | Setup/check GG linked account               |
| `/user/settings`                    | POST   | Change user information                     |
| `/user/logout`                      | GET    | Logout                                      |
| `/user/forgot-password`             | POST   | Request resetting password                  |
| `/user/reset-password/:id/:token`   | POST   | Save new password to DB                     |
| `/user/get`                         | GET    | Get user data                               |


## Detail description

### <span style="color:#0cbb52; font-weight:700">POST</span>. **Submit New User Registration**
```
    /user/register
```
**_Form Data_**: 
| Key                        | Description                       |
| -------------------------- | --------------------------------- |
| **_username_**: `string`   |                                   |
| **_email_**: `string` |  |
| **_phone_**: `number` |  |
| **_password_**: `string` |  |
| **_confirm_password_**: `string` |  |

**_Response_**:


<br>    

### <span style="color:#0cbb52; font-weight:700">GET</span>. **Verify Google Account**

```
    /user/auth/google-login
```

Check if the GG id token given by user is valid or not

**_Payload_**

| Key                        | Description                       |
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

| Key          | Description                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| is_correct   | `true` if the id token is valid and vice                                                                          |
| enough_data  | `true` if data of {username, phone number, password} exist in DB                                                  |
| account_type | `NEW_ACCOUNT`: Have not yet been created <br />`EXISTENT_ACCOUNT`: Old account <br /> `undefined`: When is_correct is false |
| message      | server message                                                                                                    |
| user_data    | User Data                                                                                                         |

### <span style="color:#0cbb52; font-weight:700">GET</span>. **Activate Account**

```
/user/activate-account/:token
```

Activate account

**_Params_**

| Key                   | Description                  |
| --------------------- | ---------------------------- |
| **_token_**: `string` | The Google token to activate |

**_Redirect_** to _localhost:3000/?message=_

| Key     | Description          |
| ------- | -------------------- |
| message | The response message |
| code    | Error code           |

### <span style="color:#0cbb52; font-weight:700">GET</span>. **Get user data**

```
/user/get
```

Get user data
**_Payload_**

| Key                          | Description         |
| ---------------------------- | ------------------- |
| **_sessionToken_**: `string` | The token to verify |

**_Response_**
|Key| Description|
| ---------------------------- | ------------------- |
|...|...|

<span style="color:#ffb400; font-weight:700">POST</span>.
