import { app, db } from './app.js';

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, async () => {
    await db.init();
    console.log(`Server started on port ${PORT}`);
});