import app from './app.js';

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏛️  E-Civic Backend API running on http://localhost:${PORT}`);
    console.log(`⚡ AI Civic Intelligence Service initialized`);
    console.log(`=======================================================`);
  });
}

export default app;
