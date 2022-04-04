const express = require('express');
const mongoClient = require('mongodb').MongoClient
const Model = require('./models');
const app = express();

const url = 'mongodb+srv://Saikumar:Saikumar123@cluster0.dnhpo.mongodb.net/TestDb?retryWrites=true&w=majority';
var db, agency, clients;

mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.log(err);
        return;
    }
    db = client.db('TestDb');
    agency = db.collection('agency');
    clients = db.collection('clients');
});

app.post('/addUser', async (request, response) => {

    try {
        const agentReq = request.body.agent;
        const clientReq = request.body.client;
        const Agent = new Model.Agent(agentReq);
        const Client = new Model.Client(clientReq);

        Agent.validate((err, res) => {
            if (err) {
                console.log('Agent Errors', err.errors, err);
                response.status(500).json({ error: err });
                return;
            }
            agency.insertOne(agentReq, (err, res) => {
                if (err) {
                    console.log('Agent Errors', err.errors, err);
                    response.status(500).json({ error: err });
                    return;
                }

                if (res) {
                    console.log('Agent Response', res);
                    Client.validate((err, res) => {
                        if (err) {
                            console.log('Client Errors', err.errors);
                            response.status(500).json({ error: err });
                            return;
                        }

                        clients.insertOne(clientReq, (err, res) => {
                            if (err) {
                                console.log('Client Errors', err.errors);
                                response.status(500).json({ error: err });
                                return;
                            }

                            if (res) {
                                console.log('Client Response', res);
                                response.status(200).json({ status: 'User Created Successfully' });
                            }
                        });
                    });
                }
            });
        });

    } catch (error) {
        response.status(500).send(error);
    }
});

app.put('/updateClient', async (request, response) => {
    try {
        clients.updateOne(request.query, { $set: request.body }, (err, res) => {

            if (err) {
                console.log('Update Failed ', err.errors);
                response.status(500).json({ error: err });
                return;
            }

            if (res) {
                console.log('User Response', res);
                response.status(200).json({ status: 'User Updated Successfully' });
            }
        });

    } catch (error) {
        response.status(500).send(error);
    }
});

app.get('/getClient', async (request, response) => {
    try {
        clients.aggregate([
            {
                $group: {
                    _id: null,
                    AgencyId: { $first: '$AgencyId' },
                    ClientName: { $first: '$Name' },
                    TotalBill: { $max: '$TotalBill' }
                }
            },
            {
                $lookup: {
                    from: 'agency',
                    localField: 'AgencyId',
                    foreignField: 'AgencyId',
                    as: 'agencyDetails'
                }
            },
            {
                $unwind: '$agencyDetails'
            },
            {
                $group: {
                    _id: 0,
                    ClientName: { $first: '$ClientName' },
                    AgencyId: { $first: '$agencyDetails.AgencyId' },
                    TotalBill: { $first: '$TotalBill' }
                }
            },
            {
                $project: {
                    _id: 0,
                    ClientName: '$ClientName',
                    AgencyId: '$AgencyId',
                    TotalBill: '$TotalBill'
                }
            }
        ]).toArray().then((res) => {
            console.log('User Response', res);
            response.status(200).json({ status: 'User Fetched Successfully', data: res });
        }).catch((err) => {
            console.log('Update Failed ', err.errors);
            response.status(500).json({ error: err });
        });

    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});

module.exports = app;