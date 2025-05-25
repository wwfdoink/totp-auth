# TOTP Authenticator

TOTP Authenticator desktop application.

# Features

- OTP QR code read from your clipboard
- OTP secret keys are encrypted using AES-256-CBC
- Everything is stored locally in `db.json` file
- Dark mode

Unlock screen             |  OTP List                 |  Dark mode
:-------------------------:|:-------------------------:|:-------------------------:
![image](https://github.com/user-attachments/assets/c04f423f-4350-4c6e-80e9-c99b0572796b)  |  ![image](https://github.com/user-attachments/assets/f606e155-53e7-443c-9e68-01550fa87fcb)  |  ![image](https://github.com/user-attachments/assets/3585f818-f2a3-4705-965c-9b4928db5d9a)

# How to use

- Set your password
    - This password will be used to encrypt your OTP secret keys
- Put the OTP QR code to your clipboard (eg.: snipping-tool)
    - You don't need a perfect cut, even a full screenshot works
- Press the `Scan QR code from clipboard` button on the top right corner
