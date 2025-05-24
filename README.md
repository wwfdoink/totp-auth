# TOTP Authenticator

TOTP Authenticator desktop application.

# Features

- OTP QR code read from your clipboard
- Secrets are encrypted using AES-256-CBC
- Everything is stored locally in the `db.json` file
- Dark mode

# How to use

- Set your password
    - This password will be used to encrypt your OTP secret keys
- Put the OTP QR code to your clipboard (eg.: snipping-tool)
    - You don't need a perfect cut, event a full screenshot works
- Press the `Scan QR code from clipboard` button on the top right corner
