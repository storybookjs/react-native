#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CERT_DIR="${ROOT_DIR}/.certs"
KEY_FILE="${CERT_DIR}/storybook-localhost-key.pem"
CERT_FILE="${CERT_DIR}/storybook-localhost-cert.pem"
CONFIG_FILE="${CERT_DIR}/openssl.cnf"

mkdir -p "${CERT_DIR}"

if command -v mkcert >/dev/null 2>&1; then
  mkcert -cert-file "${CERT_FILE}" -key-file "${KEY_FILE}" localhost 127.0.0.1 ::1 10.0.2.2
  echo "Wrote ${KEY_FILE}"
  echo "Wrote ${CERT_FILE}"
  echo "Generated with mkcert. The certificate should be trusted on this machine."
  exit 0
fi

cat > "${CONFIG_FILE}" <<'EOF'
[req]
distinguished_name = dn
x509_extensions = v3_req
prompt = no

[dn]
CN = localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
IP.2 = 10.0.2.2
EOF

openssl req \
  -x509 \
  -nodes \
  -newkey rsa:2048 \
  -keyout "${KEY_FILE}" \
  -out "${CERT_FILE}" \
  -days 3650 \
  -config "${CONFIG_FILE}" \
  >/dev/null 2>&1

rm -f "${CONFIG_FILE}"

echo "Wrote ${KEY_FILE}"
echo "Wrote ${CERT_FILE}"
echo "Generated with openssl fallback."
echo "React Native may reject this certificate unless it is trusted by your OS/device."
echo "Install mkcert for a locally trusted development certificate."
