# Running the Syscoin API NodeJS Server
Prior to running the server a Syscoin node must be installed and properly configured as a JSON-RPC server. After the full node is configured the syscoin-api server 
needs to know the location of syscoin.conf using the `SYS_LOCATION` environmental variable, replacing `DATALOCATION` in the examples below 
with the path to your Syscoin data directory, including the trailing slash.

To run the server, follow these simple steps:

```
npm install
SYS_LOCATION=DATALOCATION npm run start
```

## Running the server in daemon mode
Running the server in daemon mode is dependent on [pm2](https://www.npmjs.com/package/pm2). To run the server as a daemon 
use the below command after `npm install` completes:

```
SYS_LOCATION=DATALOCATION npm run startd
```

## Running unit tests
Syscoin API has a series of "sanity" unit tests written using the Mocha + Chai test framework and assertions library.
Due to the confirmation-based nature of blockchain transactions and for ease of use, you must first create a few Syscoin 
services manually and use the data from these to configure the test, before running the tests. 

Follow the steps below before running the test suite:

1. First ensure your wallet is running on a working testnet as **the test suite will spend SYS in its execution.** You can do this by 
editing `syscoin.conf` and specifying `testnet=1`.
1. Transfer at least 100 syscoin to the root wallet address (can be acquired by running `getaccountaddress ""` via syscoind 
or QT debug console)
1. Manually create the following entities on the Syscoin network, and populate the result values mentioned below into 
[`server/nodejs/spec/config.js`](spec/config.js):
    1. Create an alias with a password. Set `TEST_ALIAS` and `TEST_ALIAS_PASSWORD` to the alias and password.
    1. Create an offer with 100 qty and a price of 1 SYS using `TEST_ALIAS` and set `TEST_OFFER_GUID` to the guid of the new offer.
    1. Create a certificate using `TEST_ALIAS`, and set `TEST_CERT_GUID` to the guid of the new cert.
    1. Create a new message from `TEST_ALIAS` to `TEST_ALIAS`, and set `TEST_MESSAGE_GUID` to the guid of the new message.
    1. Create a new escrow using `TEST_ALIAS` as buyer and arbiter, purchasing `TEST_OFFER_GUID`, and set `TEST_ESCROW_GUID` to the guid of the new escrow.
1. Run the test suite using the commend below, ensuring both Syscoin API Server and the Syscoin Core RPC Server are running. 

   ```
   npm run test
   ```
   
   **Note**: Depending on network variables some tests may fail due to lack of confirmation on transactions/operations earlier in 
        the test suite. The test try to accomodate this by waiting 3mins for confirmations around these confirmation-sensitive 
        transaction types. These are typically `offerAccept` and `offerAcceptFeedback` tests. Additionally if the `TEST_*` identifiers
        you're using in `Config.js` have large result lists you may need to modify the specifics tests by adding a `this.timeout(n)` where `n` 
        represents a time in ms that allows for the full response to be returned. The default is 2000ms. 

# Configuring for Production Use
Before deploying syscoin-api for production use you will need to modify the following files:

1. `host` value in [`/api/swagger.yaml`](api/swagger.yaml)
1. `swaggerSpec.host` value located in [`../../swagger-ui/dist/swagger-spec.js`](https://github.com/syscoin/swagger-ui/blob/858d2b341291fd477dab4e629d93df0b16aea9a6/dist/swagger-spec.js)
1. `HOST` value in [`/spec/config.js`](spec/config.js)
 
In all these files modify the specified value from `localhost:8001` to `SERVERIP:8001`. Replacing `SERVERIP` with your server's 
production IP or domain. You can also optionally change the port. 

**It is highly recommended that you allow only HTTPS 
access in production deployments and secure all connections with a valid SSL certificate. Failure to do this can expose the wallet to attack.**