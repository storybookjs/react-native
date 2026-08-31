Try this:
`npx uri-scheme open "exp://127.0.0.1:8081/--/?STORYBOOK_STORY_ID=controlexamples-boolean--basic" --ios`
or this:
`npx uri-scheme open "exp://127.0.0.1:8081/--/?STORYBOOK_STORY_ID=controlexamples-controlexample--example" --ios`

Secure Storybook example:

1. `pnpm storybook:secure:cert`
2. `pnpm storybook:secure`

The example only switches on `EXPO_PUBLIC_STORYBOOK_WS_SECURED=true`. In secure mode it keeps the normal default ports and only upgrades the channel server to HTTPS/WSS:

- Expo on the default Metro port (`8081`, unless Expo picks another open port)
- channel server on `https://localhost:7007`
- `wss://localhost:7007` on iOS and `wss://10.0.2.2:7007` on Android emulators
- cert files at `.certs/storybook-localhost-key.pem` and `.certs/storybook-localhost-cert.pem`

`pnpm storybook:secure:cert` prefers `mkcert` when available so the cert is trusted locally. Without `mkcert` it falls back to `openssl`, but React Native / Expo may reject that certificate until you trust it manually.

This simplified secure example is for local simulators and emulators. It is not suitable for physical devices because the client host is hardcoded.
