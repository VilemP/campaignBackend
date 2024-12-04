import { createServer } from './api/http/server';

const app = createServer();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});