Try this:
`npx uri-scheme open "exp://127.0.0.1:8081/--/?STORYBOOK_STORY_ID=controlexamples-boolean--basic" --ios`
or this:
`npx uri-scheme open "exp://127.0.0.1:8081/--/?STORYBOOK_STORY_ID=controlexamples-controlexample--example" --ios`

Secure Storybook example:

1. `pnpm storybook:secure:cert`
2. `pnpm storybook:secure`

The example only switches on `EXPO_PUBLIC_STORYBOOK_WS_SECURED=true`. In secure mode it always uses:

- Expo on `8091`
- channel server on `https://localhost:7443`
- `wss://localhost:7443` on iOS and `wss://10.0.2.2:7443` on Android emulators
- cert files at `.certs/storybook-localhost-key.pem` and `.certs/storybook-localhost-cert.pem`

`pnpm storybook:secure:cert` prefers `mkcert` when available so the cert is trusted locally. Without `mkcert` it falls back to `openssl`, but React Native / Expo may reject that certificate until you trust it manually.

This simplified secure example is for local simulators and emulators. It is not suitable for physical devices because the client host is hardcoded.
