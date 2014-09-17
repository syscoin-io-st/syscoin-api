// server.js
var express    = require('express');
var app        = module.exports = express();
var bodyParser = require('body-parser');

// load external configuration
var config = require('./config');

// initialize logger
var logger = require('./lib/logger')(config.log);

// load middleware
app.all('*', require('./middleware/requestId'));
app.all('*', require('./middleware/logging').attach(logger));
app.all('*', require('./middleware/logging').entry);
app.all('*', bodyParser());
app.all('*', require('./middleware/cors'));
app.all('*', require('./middleware/client')(config.syscoin));
app.all('*', require('./middleware/errors'));

// ROUTES FOR OUR API
// =============================================================================
var rpcRouter = express.Router({
  caseSensitive: false
});

var apiRouter = express.Router({
    caseSensitive: false
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
rpcRouter.get('/hello', function(req, res, next) {
    hello(req, res, next);
});

apiRouter.get('/hello', function(req, res, next) {
    hello(req, res, next);
});

rpcRouter.get('/notImplemented', function(req, res, next) {
    notImplemented(req, res, next);
});

apiRouter.get('/notImplemented', function(req, res, next) {
    notImplemented(req, res, next);
});

function hello(req, res, next) {
    res.json({ message: 'hooray! welcome to our api!' });
    next();
}

function notImplemented(req, res, next) {
    next(req.error.NotImplementedError('this route is not implemented'));
}

// GENERIC WALLET FUNCTIONS
// =============================================================================
rpcRouter.post('/getinfo', function(req, res, next) {
    req.log.info('getInfo()');
    req.client.getInfo(function(err, result, resHeaders) {
        if (err) return next(err);

        req.log.info(JSON.stringify(result));
        res.json(result);
        next();
    });
});

rpcRouter.post('/addnode', function(req, res, next) {
    req.log.info('addNode(' + req.query.node + ', ' + req.query.method + ')');
    req.client.addNode(req.query.node, req.query.method, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

// NAME ALIAS FUNCTIONS
// =============================================================================
rpcRouter.post('/aliasactivate', function(req, res, next) {
    //req.log.info('aliasactivate(' + req.query.aliasName + ', ' + req.query.guid + ', ' + req.query.tx + ', ' + req.query.value + ')');
    req.client.aliasActivate(req.query.aliasName, req.query.guid, req.query.tx, req.query.value, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

/*rpcRouter.post('/aliasclean', function(req, res, next) {
    req.log.info('aliasclean()');
    req.client.aliasClean(function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});*/

rpcRouter.post('/aliasfilter', function(req, res, next) {
    req.log.info('aliasfilter(' + req.query.regexp + ', ' + req.query.maxage + ', ' + req.query.from + ', ' + req.query.nb + ', ' + req.query.stat + ')');
    req.client.aliasFilter(req.query.regexp, req.query.maxage, req.query.from, req.query.nb, req.query.stat, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/aliashistory', function(req, res, next) {
    req.log.info('aliashistory(' + req.query.aliasName + ')');
    req.client.aliasHistory(req.query.aliasName, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/aliasinfo', function(req, res, next) {
    req.log.info('aliasinfo(' + req.query.aliasName + ')');
    req.client.aliasInfo(req.query.aliasInfo, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/aliaslist', function(req, res, next) {
    req.log.info('aliaslist(' + req.query.aliasNameFilter + ')');
    req.client.aliasList(req.query.aliasNameFilter, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/aliasnew', function(req, res, next) {
    req.log.info('aliasnew(' + req.query.aliasName + ')');
    req.client.aliasNew(req.query.aliasName, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/aliasscan', function(req, res, next) {
    req.log.info('aliasscan(' + req.query.startAliasName + ', ' + req.query.maxReturned + ')');
    req.client.aliasScan(req.query.startAliasName, req.query.maxReturned, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/aliasupdate', function(req, res, next) {
    req.log.info('aliasupdate(' + req.query.aliasName + ', ' + req.query.aliasValue + ', ' + req.query.toAddress + ')');
    req.client.aliasUpdate(req.query.aliasName, req.query.aliasValue, req.query.toAddress, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});


// CERTIFICATE MANAGEMENT FUNCTIONS
// =============================================================================
rpcRouter.post('/certissuerinfo', function(req, res, next) {
    req.log.info('certissuerinfo(' + req.query.guid + ')');
    req.client.certissuerInfo(req.query.guid, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/certissueractivate', function(req, res, next) {
    req.log.info('certissueractivate(' + req.query.guid + ', ' + req.query.tx + ')');
    req.client.certissuerActivate(req.query.guid, req.query.tx, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

/*rpcRouter.post('/certissuer_clean', function(req, res, next) {
    req.log.info('certissuer_clean()');
    req.client.certissuer_clean(function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});*/

rpcRouter.post('/certissuerfilter', function(req, res, next) {
    req.log.info('certissuerfilter(' + req.query.regexp + ', ' + req.query.maxage + ', ' + req.query.from + ', ' + req.query.nb + ', ' + req.query.stat + ')');
    req.client.certissuerFilter(req.query.regexp, req.query.maxage, req.query.from, req.query.nb, req.query.stat, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/certissuerhistory', function(req, res, next) {
    req.log.info('certissuerhistory(' + req.query.certIssuerName + ')');
    req.client.certissuerHistory(req.query.certIssuerName, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/certissuerinfo', function(req, res, next) {
    req.log.info('certissuerinfo(' + req.query.guid + ')');
    req.client.certissuerInfo(req.query.guid, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/certissuerlist', function(req, res, next) {
    req.log.info('certissuerlist(' + req.query.certIssuerNameFilter + ')');
    req.client.certissuerList(req.query.certIssuerNameFilter, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/certissuernew', function(req, res, next) {
    req.log.info('certissuernew(' + req.query.certIssuerName + ', ' + req.query.certIssuerData + ')');
    req.client.certissuerNew(req.query.certIssuerName, req.query.certIssuerData, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/certissuerscan', function(req, res, next) {
    req.log.info('certissuerscan(' + req.query.startCertIssuerName + ', ' + req.query.maxReturned + ')');
    req.client.certissuerScan(req.query.startCertIssuerName, req.query.maxReturned, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/certissuerupdate', function(req, res, next) {
    req.log.info('certissuerupdate(' + req.query.guid + ', ' + req.query.certIssuerName + ', ' + req.query.certIssuerData + ')');
    req.client.certissuerUpdate(req.query.guid, req.query.certIssuerName, req.query.certIssuerData, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/certnew', function(req, res, next) {
    req.log.info('certnew(' + req.query.issuerGuid + ', ' + req.query.toAddress + ', ' + req.query.certTitle + ', ' + req.query.certData + ')');
    req.client.certNew(req.query.issuerGuid, req.query.toAddress, req.query.certTitle, req.query.certData, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/certtransfer', function(req, res, next) {
    req.log.info('certtransfer(' + req.query.certGuid + ', ' + req.query.toAddress + ')');
    req.client.certTransfer(req.query.certGuid, req.query.toAddress, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

// DATA ALIAS FUNCTIONS
// =============================================================================
rpcRouter.post('/dataactivate', function(req, res, next) {
    req.log.info('dataactivate(' + req.query.dataName + ', ' + req.query.guid + ', ' + req.query.tx + ', ' + req.query.filename + ', ' + req.query.dataContent + ')');
    req.client.dataActivate(req.query.dataName, req.query.guid, req.query.tx, req.query.filename, req.query.dataContent, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

/*
MISSING FROM DAEMON
rpcRouter.post('/dataclean', function(req, res, next) {
    req.log.info('aliasclean()');
    req.client.dataclean(function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});
*/

/*
MISSING FROM DAEMON
rpcRouter.post('/datafilter', function(req, res, next) {
    req.log.info('datafilter(' + req.query.regexp + ', ' + req.query.maxage + ', ' + req.query.from + ', ' + req.query.nb + ', ' + req.query.stat + ')');
    req.client.dataFilter(req.query.regexp, req.query.maxage, req.query.from, req.query.nb, req.query.stat, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});
*/

/*
INCORRECT IN DAEMON - returns output related to aliases, not data.
rpcRouter.post('/datahistory', function(req, res, next) {
    req.log.info('datahistory(' + req.query.dataName + ')');
    req.client.dataHistory(req.query.dataName, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});
*/

/*
INCORRECT IN DAEMON - returns output related to aliases, not data.
rpcRouter.post('/datainfo', function(req, res, next) {
    req.log.info('datainfo(' + req.query.dataName + ')');
    req.client.dataInfo(req.query.dataName, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});
*/

/*
 INCORRECT IN DAEMON - returns output related to aliases, not data.
rpcRouter.post('/datalist', function(req, res, next) {
    req.log.info('datalist(' + req.query.dataNameFilter + ')');
    req.client.dataList(req.query.dataNameFilter, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});
*/

rpcRouter.post('/datanew', function(req, res, next) {
    req.log.info('datanew(' + req.query.dataName + ')');
    req.client.dataNew(req.query.dataName, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

/*
 MISSING FROM DAEMON
rpcRouter.post('/datascan', function(req, res, next) {
    req.log.info('datascan(' + req.query.startAliasName + ', ' + req.query.maxReturned + ')');
    req.client.dataScan(req.query.startAliasName, req.query.maxReturned, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});
*/

rpcRouter.post('/dataupdate', function(req, res, next) {
    req.log.info('dataupdate(' + req.query.dataName + ', ' + req.query.filename + ', ' + req.query.dataContent + ', ' + req.query.toAddress + ')');
    req.client.dataUpdate(req.query.aliasName, req.query.filename, req.query.dataContent, req.query.toAddress, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/dumpdata', function(req, res, next) {
    req.log.info('dumpdata(' + req.query.dataName + ')');
    req.client.dumpData(req.query.dataName, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

// MARKETPLACE/OFFER FUNCTIONS
// =============================================================================
rpcRouter.post('/offeraccept', function(req, res, next) {
    req.log.info('offeraccept(' + req.query.guid + ', ' + req.query.quantity + ')');
    req.client.offerAccept(req.query.guid, req.query.quantity, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/offeractivate', function(req, res, next) {
    req.log.info('offeractivate(' + req.query.guid + ', ' + req.query.tx + ')');
    req.client.offerActivate(req.query.guid, req.query.tx, req.query.value, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

/*rpcRouter.post('/offer_clean', function(req, res, next) {
    req.log.info('offer_clean()');
    req.client.offer_clean(function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});*/

rpcRouter.post('/offerfilter', function(req, res, next) {
    req.log.info('offerfilter(' + req.query.regexp + ', ' + req.query.maxage + ', ' + req.query.from + ', ' + req.query.nb + ', ' + req.query.stat + ')');
    req.client.offerFilter(req.query.regexp, req.query.maxage, req.query.from, req.query.nb, req.query.stat, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/offerhistory', function(req, res, next) {
    req.log.info('offerhistory(' + req.query.offerGuid + ')');
    req.client.offerHistory(req.query.offerGuid, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/offerinfo', function(req, res, next) {
    req.log.info('offerinfo(' + req.query.offerGuid + ')');
    req.client.offerInfo(req.query.offerGuid, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/offerlist', function(req, res, next) {
    req.log.info('offerlist(' + req.query.offerNameFilter + ')');
    req.client.offerList(req.query.offerNameFilter, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/offernew', function(req, res, next) {
    req.log.info('offernew('  + req.query.offerAddress + ', ' + req.query.category + ', ' + req.query.title + ', ' + req.query.quantity + ', ' + req.query.price + ', ' + req.query.description + ')');
    req.client.offerNew(req.query.offerAddress, req.query.category, req.query.title, req.query.quantity, req.query.price, req.query.description, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/offerpay', function(req, res, next) {
    req.log.info('offerpay(' + req.query.offerAcceptGuid + ', ' + req.query.offerAcceptTx + ', ' + req.query.messageToSeller + ')');
    req.client.offerPay(req.query.offerAcceptGuid, req.query.offerAcceptTx, req.query.messageToSeller, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/offerscan', function(req, res, next) {
    req.log.info('offerscan(' + req.query.startOfferGuid + ', ' + req.query.maxReturned + ')');
    req.client.offerScan(req.query.startOfferGuid, req.query.maxReturned, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

rpcRouter.post('/offerupdate', function(req, res, next) {
    req.log.info('offerupdate(' + req.query.offerGuid + ', ' + req.query.category + ', ' + req.query.title + ', ' + req.query.quantity + ', ' + req.query.price + ', ' + req.query.description + ')');
    req.client.offerUpdate(req.query.offerGuid, req.query.category, req.query.title, req.query.quantity, req.query.price, req.query.description, function(err, result, resHeaders) {
        if (err) return next(err);

        res.json(result);
        next();
    });
});

// REGISTER OUR ROUTES -------------------------------
// all of our REST routes will be prefixed with /api
app.use('/api', apiRouter);

app.use('/rpc', rpcRouter);

// ERROR HANDLING MDW
app.use('*', require('./middleware/errorHandler'));

// AFTER ROUTE HANDLING, LOG WHEN THE REQUEST LEAVES THE API SEVER
// =============================================================================
app.use('*', require('./middleware/logging').exit);

// START THE SERVER
// =============================================================================
app.listen(config.port);
logger.info('Syscoin-API Server started on port ' + config.port);
/*
req.client.getInfo(function(err, result, resHedeaders) {
    console.log("syscoind must be running for this to work...");
    console.log("INIT TEST:" + JSON.stringify(result));
});
*/
