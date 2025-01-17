openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out server.cert -config openssl.cnf
openssl x509 -req -in server.cert -signkey server.key -out server-cert.pem -days 365 -extensions v3_ca -extfile openssl.cnf


openssl x509 -req -signkey server.key -in server.cert -out certificate.crt