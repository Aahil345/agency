const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
    AgencyId: { type: String, required: true },
    Name: { type: String, required: true },
    Address1: { type: String, required: true },
    Address2: { type: String, required: false },
    State: { type: String, required: true },
    City: { type: String, required: true },
    PhoneNumber: { type: String, required: true }
}, { collection: 'agency' });

const ClientSchema = new mongoose.Schema({
    ClientId: { type: String, required: true },
    AgencyId: { type: String, required: true },
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    TotalBill: { type: Number, required: true },
    PhoneNumber: { type: String, required: true }
}, { collection: 'clients' });

const Agent = mongoose.model('Agent', AgentSchema);
const Client = mongoose.model('Client', ClientSchema);

module.exports = { Agent, Client };