const express = require('express');
const cors = require('cors');
const { queryInsuranceData } = require('./query_llm');

const app = express();
app.use(cors());

app.get('/api/insurance', async (req, res) => {
  const data = await queryInsuranceData("Get all insurance details");
  res.json(JSON.parse(data));
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
