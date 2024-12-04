import { z } from 'zod';

export const CampaignSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3).max(100),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  budget: z.number().positive(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'])
});

export type Campaign = z.infer<typeof CampaignSchema>;

export class CampaignEntity {
  private constructor(
    private readonly props: Campaign
  ) {}

  public static create(props: Omit<Campaign, 'id' | 'status'>): CampaignEntity {
    const campaign: Campaign = {
      ...props,
      id: crypto.randomUUID(),
      status: 'DRAFT'
    };

    const result = CampaignSchema.safeParse(campaign);
    if (!result.success) {
      throw new Error(`Invalid campaign data: ${result.error.message}`);
    }

    return new CampaignEntity(campaign);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date {
    return this.props.endDate;
  }

  get budget(): number {
    return this.props.budget;
  }

  get status(): Campaign['status'] {
    return this.props.status;
  }

  public toJSON(): Campaign {
    return { ...this.props };
  }
}