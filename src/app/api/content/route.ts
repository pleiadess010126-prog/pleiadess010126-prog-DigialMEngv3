import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/client';

// GET /api/content - List content for campaign/organization
// POST /api/content - Create new content

export async function GET(request: NextRequest) {
    try {
        const orgId = request.nextUrl.searchParams.get('organizationId');
        const campaignId = request.nextUrl.searchParams.get('campaignId');
        const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
        const pageSize = parseInt(request.nextUrl.searchParams.get('pageSize') || '20');
        const status = request.nextUrl.searchParams.get('status');

        if (!orgId && !campaignId) {
            return NextResponse.json(
                { error: 'Organization ID or Campaign ID is required' },
                { status: 400 }
            );
        }

        let result;
        if (campaignId) {
            result = await db.getContentByCampaign(campaignId, { page, pageSize });
        } else if (orgId) {
            result = await db.getContentByOrganization(orgId, { page, pageSize });
        }

        // Apply status filter if provided
        if (status && result) {
            result.items = result.items.filter(item => item.status === status);
            result.total = result.items.length;
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json(
            { error: 'Failed to fetch content' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { organizationId, campaignId, title, content, type, metadata } = body;

        if (!organizationId || !campaignId || !title || !content) {
            return NextResponse.json(
                { error: 'Organization ID, Campaign ID, title, and content are required' },
                { status: 400 }
            );
        }

        const userId = request.headers.get('x-user-id') || 'demo_user';

        const contentItem = await db.createContent({
            organizationId,
            campaignId,
            title,
            content,
            type: type || 'blog',
            status: 'draft',
            metadata: {
                seoScore: metadata?.seoScore || 0,
                wordCount: content.split(/\s+/).length,
                readingTime: Math.ceil(content.split(/\s+/).length / 200),
                keywords: metadata?.keywords || [],
                targetKeyword: metadata?.targetKeyword,
                hashtags: metadata?.hashtags,
                topicPillar: metadata?.topicPillar || 'General',
                aiModel: metadata?.aiModel,
                generationPrompt: metadata?.generationPrompt,
            },
            platforms: [],
            createdBy: userId,
        });

        // Increment usage
        await db.incrementUsage(organizationId, 'contentGenerated');

        await db.logActivity({
            organizationId,
            userId,
            action: 'content.created',
            entityType: 'content',
            entityId: contentItem.id,
        });

        return NextResponse.json(contentItem, { status: 201 });
    } catch (error) {
        console.error('Error creating content:', error);
        return NextResponse.json(
            { error: 'Failed to create content' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Content ID is required' },
                { status: 400 }
            );
        }

        const userId = request.headers.get('x-user-id') || 'demo_user';

        const existingContent = await db.getContent(id);
        if (!existingContent) {
            return NextResponse.json(
                { error: 'Content not found' },
                { status: 404 }
            );
        }

        const updatedContent = await db.updateContent(id, updates);

        await db.logActivity({
            organizationId: existingContent.organizationId,
            userId,
            action: 'content.updated',
            entityType: 'content',
            entityId: id,
            metadata: { updates },
        });

        return NextResponse.json(updatedContent);
    } catch (error) {
        console.error('Error updating content:', error);
        return NextResponse.json(
            { error: 'Failed to update content' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Content ID is required' },
                { status: 400 }
            );
        }

        const userId = request.headers.get('x-user-id') || 'demo_user';

        const existingContent = await db.getContent(id);
        if (!existingContent) {
            return NextResponse.json(
                { error: 'Content not found' },
                { status: 404 }
            );
        }

        await db.deleteContent(id);

        await db.logActivity({
            organizationId: existingContent.organizationId,
            userId,
            action: 'content.deleted',
            entityType: 'content',
            entityId: id,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting content:', error);
        return NextResponse.json(
            { error: 'Failed to delete content' },
            { status: 500 }
        );
    }
}
