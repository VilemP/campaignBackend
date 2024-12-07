import { describe, it, expect, vi } from 'vitest';
import { CreateCampaignCommand } from './CreateCampaignCommand.js';
import { BusinessType } from '@campaign-backend/domain/model/types.js';

describe('CreateCampaignCommand', () => {
    it('should create command with repository', () => {
        const mockRepo = {
            save: vi.fn(),
            load: vi.fn()
        };
        
        const payload = {
            name: 'Test Campaign',
            businessType: BusinessType.RETAIL
        };

        const command = new CreateCampaignCommand(payload, mockRepo);
        
        expect(command).toBeInstanceOf(CreateCampaignCommand);
        expect(mockRepo.save).not.toHaveBeenCalled(); // Verifies construction doesn't trigger save
    });
});