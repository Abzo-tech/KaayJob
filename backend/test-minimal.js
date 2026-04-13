const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: 'Test Category' }
    ]
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { email: req.body.email },
      token: 'test-token'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Serveur minimal sur port ${PORT}`);
});