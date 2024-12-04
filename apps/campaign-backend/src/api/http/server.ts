import express, { Express } from 'express';
import { endpoints } from './endpoints';

export function createServer(): Express {
    const app = express();
    
    app.use(express.json());
    
    endpoints.forEach(endpoint => {
        app[endpoint.method.toLowerCase()](endpoint.path, async (req, res, next) => {
            try {
                const payload = endpoint.createPayload(req);
                const command = new endpoint.command(payload);
                await command.execute();
                
                const successCode = Object.keys(endpoint.responses)
                    .find(code => code.startsWith('2')) || '200';
                
                res.status(parseInt(successCode)).json({ success: true });
            } catch (error) {
                next(error);
            }
        });
    });

    return app;
}