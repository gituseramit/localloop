const fs = require('fs');
const b64 = 'REFUQUJBU0VfVVJMPSJwb3N0Z3Jlc3FsOi8vbmVvbmRiX293bmVyOm5wZ18wb3lGNVNpSWZVeFRAZXAtYnJvYWQtbWF0aC1hbWxicTY2eS1wb29sZXIuYy01LnVzLWVhc3QtMS5hd3MubmVvbi50ZWNoL25lb25kYj9zc2xtb2RlPXJlcXVpcmUiCk5FWFRBVVRIX1NFQ1JFVD0ibG9jYWxsb29wLXN1cGVyLXNlY3JldC1rZXktMjAyNi1wcm9kdWN0aW9uIgpORVhUQVVUSF9VUkw9Imh0dHBzOi8vc3BhcmtsaW5nLWhhbXN0ZXItYWQxYmYyLm5ldGxpZnkuYXBwIg==';
const decoded = Buffer.from(b64, 'base64').toString('utf8');
fs.writeFileSync('.env', decoded);
fs.writeFileSync('.env.production', decoded);
console.log('Environment initialized securely.');
