import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const response = await fetch('https://customer-bike-sales.onrender.com/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customer: body })
        });

        if (!response.ok) {
            throw new Error('Error in R classificationAPI call');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Request failed' },
            { status: 500 }
        );
    }
} 