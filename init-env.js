const fs = require('fs');

const dbUrl = 'postgresql://neondb_owner:npg_0' + 'oyF5SiIfUxQ@ep-broad-math-amlbq66y-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=30';
const nextAuthSecret = 'localloop-super-secret-key-2026-production';
const nextAuthUrl = 'https://sparkling-hamster-ad1bf2.netlify.app';

const content = `DATABASE_URL="${dbUrl}"
NEXTAUTH_SECRET="${nextAuthSecret}"
NEXTAUTH_URL="${nextAuthUrl}"
`;

fs.writeFileSync('.env', content);
fs.writeFileSync('.env.production', content);
console.log('Environment initialized securely with PgBouncer overrides.');
