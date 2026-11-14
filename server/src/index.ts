import { app } from './app.js';

const PORT = parseInt(process.env.PORT || '4000', 10);

app.listen(PORT, () => {
  console.log(`Campus Lost & Found backend listening on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/v1`);
});
