import { createServer } from './api/http/server';
import { InMemoryEventStore } from '@libs/event-sourcing';
import { EventSourcedCampaignRepository } from './persistence/repositories/EventSourcedCampaignRepository';

class ApplicationContext {
    private readonly eventStore = new InMemoryEventStore();
    private readonly campaignRepository = new EventSourcedCampaignRepository(this.eventStore);

    createServer() {
        return createServer({
            repositories: {
                campaign: this.campaignRepository
            }
        });
    }
}

// Bootstrap application
const context = new ApplicationContext();
const app = context.createServer();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 