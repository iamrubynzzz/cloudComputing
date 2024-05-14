const express = require('express');
const transactionsRouter = require('../routes/Transactions');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());

app.use('/api/transactions', transactionsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
