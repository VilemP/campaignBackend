import { createServer } from './api/http/server.js';
import { InMemoryEventStore } from '@libs/event-sourcing';
import { EventSourcedCampaignRepository } from './persistence/repositories/EventSourcedCampaignRepository.js';

const port = process.env['PORT'] || 3000;
const eventStore = new InMemoryEventStore();
const campaignRepository = new EventSourcedCampaignRepository(eventStore);

const server = createServer({
    repositories: {
        campaign: campaignRepository
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 