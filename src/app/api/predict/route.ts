import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        const apiUrl = `https://customer-bike-sales.onrender.com/predict?${searchParams.toString()}`;
        console.log('Llamando a la API externa:', apiUrl);
        
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error in external API:', response.status, errorText);
                return NextResponse.json(
                    { error: `Error in external API: ${response.status} ${errorText}` },
                    { status: response.status }
                );
            }

            const data = await response.json();
            return NextResponse.json(data);
        } catch (fetchError) {
            console.error('Error fetching external API:', fetchError);
            if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
                return NextResponse.json(
                    { 
                        error: 'Error connecting to the external server. The service may be down or temporarily unavailable.',
                        details: fetchError.message
                    },
                    { status: 503 }
                );
            }
            
            throw fetchError;
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: `Server error: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
} 