# BE-INT2208_05

## User endpoints

| Endpoint                            | Method | Description                                 |
| ----------------------------------- | ------ | ------------------------------------------- |
| `/`                                 | GET    | Home                                        |
| `/user/auth/google-login`           | POST   | Setup/check GG linked account               |
| `/user/logout`                      | GET    | Logout                                      |
| `/user/get`                         | GET    | Get user data                               |
| `/user/update`                      | POST   | Update User Settings                        |

## Detail description

<span style="color:#ffb400; font-weight:700">POST</span>. **Verify Google Account**

```
    /user/auth/google-login
```

Check if the Google id token given by user is valid or not

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
        "token": string
    }
```

| Key          | Description                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| is_correct   | `true` if the id token is valid and vice                                                                                    |
| enough_data  | `true` if data of {username, phone number} exist in DB                                                                      |
| account_type | `NEW_ACCOUNT`: Have not yet been created <br />`EXISTENT_ACCOUNT`: Old account <br /> `undefined`: When is_correct is false |
| message      | Server message                                                                                                              |
| user_data    | User data                                                                                                                   |
| token        | 'session-token'. Because cookies are stored by host only, no port. So in dev version, this is need to set session             |


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
