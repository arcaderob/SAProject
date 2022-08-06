const cors = require('cors'); 
const express = require('express');
const mysql = require('mysql');
const app = express(),
      bodyParser = require('body-parser');
      port = 3080;
app.use(cors());

// Database connection data (stored in local file for testing only. Normally,
// this data would be stored in env vars in the Docker container or other.)
const databaseSettings = {
    host: 'sql5.freemysqlhosting.net',
    user: 'sql5504775',
    password: 'Qh9k67RfPI',
    database: 'sql5504775',
    port: 3306
};

// Connection data
const connection = mysql.createConnection({
    host: databaseSettings.host,
    user: databaseSettings.user,
    database: databaseSettings.database,
    password: databaseSettings.password
});

// Establish connection to DB
connection.connect((err) => {
    if (err) return res.json({error: true, error: err});
    console.log('Successfully connected to DB');
});

// Listen on port
app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

// Use JSON body parser for incomming data
app.use(bodyParser.json());

// Function that inserts the events into the DB and updates the projection
const performAction = (res, body) => {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    connection.query(
        `INSERT into symbols VALUES (${Date.now()}, "${body.action}", "${body.symbol}", ${body.amount}, ${body.price}, "${timestamp}");`,
        (err, result) => {
            if (err) return res.json({error: true, error: err});
            updateProjection(connection, body);
            res.json({
                success: true,
                action: body.action,
                symbol: body.symbol,
                amount: body.amount
            });
        }
    );
};

// Function that updates the projection
const updateProjection = (con, body) => {
    con.query(
        `SELECT * from projections WHERE symbol='${body.symbol}';`,
        (err, result) => {
            if (err) throw err;
            const hasResult = !!result.length;
            const existingAmount = hasResult ? result[0].amount : 0;
            const newAmount = body.action === 'buy' ? existingAmount + body.amount : existingAmount - body.amount;
            const sql = hasResult ?
            `UPDATE projections SET id=${Date.now()}, symbol='${body.symbol}', amount=${newAmount} WHERE symbol='${body.symbol}';` :
            `INSERT into projections VALUES (${Date.now()}, '${body.symbol}', ${body.amount});`
            con.query(
                sql,
                (innerErr) => {
                    if (innerErr) throw innerErr;
                    console.log(`Projection ${hasResult ? 'updated' : 'inserted'}`);
                }
            );
        });
};

// Function that retrieves events and rebuilds a specific perjection
const rebuildProjection = (res, symbol) => {
    connection.query(
        `SELECT * FROM symbols WHERE symbol='${symbol}' ORDER BY timestamp ASC;`,
        (err, result) => {
            if (err) return res.json({error: true, error: err});
            if (result.length) {
                let total = 0;
                result.forEach((row) => {
                    total = row.action === 'buy' ? total + row.amount : total - row.amount; 
                });
                connection.query(
                    `UPDATE projections SET id=${Date.now()}, symbol='${symbol}', amount=${total} WHERE symbol='${symbol}';`,
                    (innerErr, innerResult) => {
                        if (innerErr) return res.json({error: true, error: err});
                        res.json({success: true, message: `Successfully rebuilt ${symbol}`});
                    }
                );
            } else {
                res.json({error: true, message: `No actions for ${symbol}`});
            }
        }
    );
};

// Endpoint to obtain all the built projections
app.get('/api/all', (req, res) => {
    connection.query(
        `SELECT * FROM projections;`,
        (err, data) => {
            if (err) return res.json({error: true, error: err});
            res.json({success: true, data});
        }
    );
});

// Endpoint to obtain the report on a specific symbol
app.get('/api/report', (req, res) => {
    connection.query(
        `SELECT * FROM symbols where symbol='${req.query.symbol}' ORDER BY timestamp ASC;`,
        (err, result) => {
            if (err) return res.json({error: true, error: err});
            res.json({success: true, data: result});
        }
    );
});

// Endpoint to obtain the data on a specific symbol
app.get('/api/symbol', (req, res) => {
    connection.query(
        `SELECT * FROM projections WHERE symbol='${req.query.symbol}';`,
        (err, result) => {
            if (err) return res.json({error: true, error: err});
            const data = result.length ? result[0] : {};
            res.json({success: true, data});
        }
    );
});

// Endpoint to call the funciton that performs a buy or sell event
app.post('/api/symbol', (req, res) => {
    performAction(res, req.body);
});

// Endpoint to rebuild the projections
app.post('/api/rebuild', (req, res) => {
    rebuildProjection(res, req.body.symbol)
});

// Endpoint to set the value of a projections for testing purposes (so you can rebuild it)
app.post('/api/setValue', (req, res) => {
    console.log('updateing it with this', `UPDATE projections SET amount=${req.body.amount} WHERE symbol='${req.body.symbol}'`);
    connection.query(
        `UPDATE projections SET amount=${req.body.amount} WHERE symbol='${req.body.symbol}'`,
        (err, result) => {
            if (err) return res.json({error: true, error: err});
            res.json({success: true, message: `${req.body.symbol} set to ${req.body.amount}`});
        }
    );
});
