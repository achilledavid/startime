import { NextResponse } from "next/server";
import { put } from '@vercel/blob';

export async function POST(request: Request): Promise<NextResponse> {
    if (!request.body) {
        return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const slug = formData.get('slug');

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'No files found in the request' }, { status: 400 });
        }

        const blob = await put(`${slug}/${file.name}`, file, {
            access: 'public',
            addRandomSuffix: true
        });

        return NextResponse.json({ ...blob });
    } catch (error) {
        console.error('Error processing files:', error);
        return NextResponse.json({ error: 'Failed to process files' }, { status: 500 });
    }
}