const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('frontend/build'));

app.get('/api/game', (req, res) => {
  // You can implement your game logic here or in another file and import it
  res.send({ message: 'Welcome to the Rock, Paper, Scissors game!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
