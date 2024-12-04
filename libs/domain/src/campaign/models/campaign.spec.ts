import { describe, it, expect } from 'vitest';
import { CampaignEntity } from './campaign';

describe('Campaign Entity', () => {
  const validCampaignData = {
    name: 'Test Campaign',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    budget: 10000
  };

  it('should create a valid campaign', () => {
    const campaign = CampaignEntity.create(validCampaignData);
    
    expect(campaign.name).toBe('Test Campaign');
    expect(campaign.status).toBe('DRAFT');
    expect(campaign.budget).toBe(10000);
    expect(campaign.id).toBeDefined();
    expect(campaign.startDate).toEqual(new Date('2024-01-01'));
    expect(campaign.endDate).toEqual(new Date('2024-12-31'));
  });

  it('should throw error for invalid campaign name', () => {
    expect(() => 
      CampaignEntity.create({
        ...validCampaignData,
        name: 'ab' // too short
      })
    ).toThrow('Invalid campaign data');
  });

  it('should throw error for invalid dates', () => {
    expect(() => 
      CampaignEntity.create({
        ...validCampaignData,
        startDate: new Date('invalid date')
      })
    ).toThrow('Invalid campaign data');
  });

  it('should throw error for negative budget', () => {
    expect(() => 
      CampaignEntity.create({
        ...validCampaignData,
        budget: -1000
      })
    ).toThrow('Invalid campaign data');
  });

  it('should correctly serialize to JSON', () => {
    const campaign = CampaignEntity.create(validCampaignData);
    const json = campaign.toJSON();
    
    expect(json).toEqual({
      id: expect.any(String),
      name: 'Test Campaign',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: 10000,
      status: 'DRAFT'
    });
  });
});