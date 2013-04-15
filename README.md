A Bitcoin Wallet based on NodeJS and Bitcoind RPC API

Plan:

1. RPC proxy
2. use https
3. login/logout feature ()
4. readonly mode (so that user can only view the wallet, but can not make transaction)
5. multiple account mode (developed for merchats to view balance and transactions for multiple accounts)


How to use it:

1. install bitcoind

2. config bitcond to accept RPC call

```
vim ~/.bitcoin/bitcoin.conf
```

3. git clone git@github.com:lancehub/nodewallet.git

4. copy config.sample.js to config.js and edit config.js add your username password to it

```
cp config.sample.js config.js
vim config.js
```

5. npm install

6. generate key/cert for https

```
openssl req -x509 -days 365 -nodes -newkey rsa:1024 -keyout key.pem -out cert.pem
```

7. node app and then visit: https://yourserver:9000