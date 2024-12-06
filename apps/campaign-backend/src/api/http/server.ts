import express, { Express } from 'express';
import { endpoints } from './endpoints';
import { CampaignRepository } from '../../persistence/repositories/CampaignRepository';

interface ServerConfig {
    repositories: {
        campaign: CampaignRepository;
    };
}

export function createServer(config: ServerConfig): Express {
    const app = express();
    
    app.use(express.json());
    
    endpoints.forEach(endpoint => {
        app[endpoint.method.toLowerCase()](endpoint.path, async (req, res, next) => {
            try {
                const payload = endpoint.createPayload(req);
                const command = new endpoint.command(payload, config.repositories.campaign);
                await command.execute();
                
                res.status(endpoint.responses.success.code).json({ success: true });
            } catch (error) {
                next(error);
            }
        });
    });

    return app;
}