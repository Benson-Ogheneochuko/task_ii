import './env.js'
import { app } from "./index.js";
import { connnectDatabase, closeDatabase, dbMiddleWare } from "./postgressDB/connectDB.js";


// Initialize database connection
connnectDatabase().catch(console.error);

// Export the Express app as a module
// export default app;
app.use(dbMiddleWare)


// If running locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully");
  await closeDatabase();
  process.exit(0);
});