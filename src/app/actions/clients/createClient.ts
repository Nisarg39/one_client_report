/**
 * Create Client Server Action
 * Creates a new client for the authenticated user
 */

'use server';

import { z } from 'zod';
import ClientModel from '@/models/Client';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/adapter';

/**
 * Input validation schema
 */
const createClientSchema = z.object({
  name: z.string().min(1, 'Client name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  logo: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  scenarioId: z.string().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export interface CreateClientResult {
  success: boolean;
  client?: {
    id: string;
    userId: string;
    name: string;
    email?: string;
    logo?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

/**
 * Create a new client
 */
export async function createClient(
  data: CreateClientInput
): Promise<CreateClientResult> {
  try {
    // Validate input
    const validated = createClientSchema.parse(data);

    // Get authenticated user
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Connect to database
    await connectDB();

    // Check client creation limit
    const existingClients = await ClientModel.find({ userId: user.id });
    const maxClients = user.restrictions?.maxClients || 999999;

    if (existingClients.length >= maxClients) {
      // Tier-specific error messages
      const tierMessage =
        user.usageTier === 'student' || user.usageTier === 'free'
          ? 'Student accounts are limited to 5 practice clients. Delete an existing client to create a new one.'
          : user.usageTier === 'pro'
          ? 'Professional plan is limited to 10 clients. Upgrade to Enterprise plan for more clients.'
          : user.restrictions?.maxClients === 25
          ? 'Your plan is limited to 25 clients. Upgrade to Enterprise for unlimited clients.'
          : user.usageTier === 'enterprise'
          ? 'Enterprise plan has reached its limit. Contact support for assistance.'
          : user.accountType === 'education'
          ? 'Students are limited to 5 practice workspaces. Delete an existing workspace to create a new one.'
          : 'Upgrade your plan to create more clients.';

      return {
        success: false,
        error: `You've reached your limit of ${maxClients} client${maxClients === 1 ? '' : 's'}. ${tierMessage}`,
      };
    }

    // Determine data source based on scenarioId or user account type
    const isEducationMode = validated.scenarioId || user.accountType === 'education';

    // Map scenarioId to metadata
    const scenarioMap: Record<string, { name: string; difficulty: 'beginner' | 'intermediate' | 'advanced'; objectives: string[] }> = {
      'beginner-ecommerce': {
        name: 'E-commerce Bounce Rate Mystery',
        difficulty: 'beginner',
        objectives: ['Device analysis', 'Metric identification']
      },
      'intermediate-ads': {
        name: 'Google Ads CPC Crisis',
        difficulty: 'intermediate',
        objectives: ['CPA calculation', 'Budget optimization']
      },
      'advanced-attribution': {
        name: 'Multi-Channel Attribution',
        difficulty: 'advanced',
        objectives: ['Attribution modeling', 'Cross-platform']
      },
      'beginner-local': {
        name: 'Local Business Patterns',
        difficulty: 'beginner',
        objectives: ['Trend analysis', 'Seasonality']
      }
    };

    // Create client with appropriate data source and metadata
    const clientData: any = {
      userId: user.id,
      name: validated.name,
      email: validated.email || undefined,
      logo: validated.logo || undefined,
      platforms: {},
      status: 'active',
      dataSource: isEducationMode ? 'mock' : 'real',
    };

    // Add education metadata if scenarioId is provided
    if (validated.scenarioId && scenarioMap[validated.scenarioId]) {
      const scenario = scenarioMap[validated.scenarioId];
      clientData.educationMetadata = {
        caseStudyName: scenario.name,
        difficulty: scenario.difficulty,
        learningObjectives: scenario.objectives,
      };
    }

    const client = await ClientModel.create(clientData);
    const clientDoc = client as any; // Type assertion for timestamps

    return {
      success: true,
      client: {
        id: String(client._id),
        userId: client.userId.toString(),
        name: client.name,
        email: client.email,
        logo: client.logo,
        status: client.status,
        createdAt: clientDoc.createdAt.toISOString(),
        updatedAt: clientDoc.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error('[createClient] Error:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    return {
      success: false,
      error: 'Failed to create client. Please try again.',
    };
  }
}
