const express = require('express'); 
const cors = require('cors'); 
require('dotenv').config()
const Transaction = require('./models/transaction.js');
const mongoose = require('mongoose');
const app = express();

app.use(cors()); 
app.use(express.json());
app.get('/api/test', (req, res) => {
    try {
        res.status(200).json({ message: 'Endpoint successfully accessed', data: "Test Passed"});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/transaction', async (req, res) =>{
    try{
        await mongoose.connect(process.env.MONGO_URL); 
        const {name, price, description, datetime} = req.body; 
        const transaction = await Transaction.create({name, price, description, datetime});
        res.json(transaction);
    }catch(error){
        console.error('Error: ', error);
        res.status(500).json({error: 'Internal Server Error'}); 
    }
});

app.get('/api/transactions', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL); 
    const transactions = await Transaction.find();
    res.json(transactions);
});
  
  // Start the server
const port = 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});