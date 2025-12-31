import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';

// GET /api/campaigns - List campaigns for organization
// POST /api/campaigns - Create new campaign

export async function GET(request: NextRequest) {
    try {
        const orgId = request.nextUrl.searchParams.get('organizationId');
        const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
        const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '10');

        if (!orgId) {
            return NextResponse.json(
                { error: 'Organization ID is required' },
                { status: 400 }
            );
        }

        const result = await db.getCampaignsByOrganization(orgId, { page, pageSize });
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return NextResponse.json(
            { error: 'Failed to fetch campaigns' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { organizationId, name, description, settings } = body;

        if (!organizationId || !name) {
            return NextResponse.json(
                { error: 'Organization ID and name are required' },
                { status: 400 }
            );
        }

        const userId = request.headers.get('x-user-id') || 'demo_user';

        const campaign = await db.createCampaign({
            organizationId,
            name,
            description,
            status: 'draft',
            settings: {
                websiteUrl: settings?.websiteUrl || '',
                targetAudience: settings?.targetAudience || '',
                industry: settings?.industry || '',
                keywords: settings?.keywords || [],
                velocity: settings?.velocity || { month1: 15, month2: 30, month3: 45 },
                contentTypes: settings?.contentTypes || {
                    blog: true,
                    youtube: false,
                    instagram: false,
                    facebook: false,
                },
                autoPublish: settings?.autoPublish ?? false,
                requireApproval: settings?.requireApproval ?? true,
                schedulingPreferences: settings?.schedulingPreferences || {
                    preferredDays: ['monday', 'wednesday', 'friday'],
                    preferredTimes: ['09:00', '14:00'],
                    timezone: 'UTC',
                },
            },
            metrics: {
                totalContent: 0,
                publishedContent: 0,
                pendingContent: 0,
                totalViews: 0,
                totalEngagement: 0,
                riskScore: 0,
            },
            createdBy: userId,
        });

        await db.logActivity({
            organizationId,
            userId,
            action: 'campaign.created',
            entityType: 'campaign',
            entityId: campaign.id,
        });

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error('Error creating campaign:', error);
        return NextResponse.json(
            { error: 'Failed to create campaign' },
            { status: 500 }
        );
    }
}
