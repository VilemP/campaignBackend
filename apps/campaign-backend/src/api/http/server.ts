import express, { Express, Request, Response, NextFunction } from 'express';
import { endpoints } from './endpoints.js';
import { CampaignRepository } from '../../persistence/repositories/CampaignRepository.js';

interface ServerConfig {
    repositories: {
        campaign: CampaignRepository;
    };
}

export function createServer(config: ServerConfig): Express {
    const app = express();
    
    app.use(express.json());
    
    endpoints.forEach((endpoint) => {
        const method = endpoint.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
        app[method](endpoint.path, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const payload = endpoint.createPayload(req);
                const command = new endpoint.command(config.repositories.campaign);
                await command.execute(payload);
                
                res.status(endpoint.responses.success.code).json({ success: true });
            } catch (error) {
                console.error('Error processing request:', error);
                next(error);
            }
        });
    });

    return app;
} 