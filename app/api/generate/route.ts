import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
  try {
    const { color, style, background } = await request.json();

    const colorName = getColorName(color);

    const prompts = [
      // Main product shot
      `Ultra-realistic professional product photography: Perfect female hands with flawless ${colorName} manicured nails displayed elegantly against ${background} background. Hands are anatomically perfect with natural proportions, no extra fingers or deformities. The model wears a ${style} ${colorName}-colored outfit that perfectly matches the nail polish. Luxury editorial fashion photography, high-fashion composition, soft studio lighting, 8K quality. In the corner, a perfectly round colored badge displays the text "TPO FREE • HEMA FREE" in clear, legible white sans-serif font. Professional nail salon advertising aesthetic for alohanails.gr`,

      // Close-up detail shot
      `Hyper-realistic close-up: Perfect hands with immaculate ${colorName} nail polish in ${style} style, shot against luxurious ${background}. Hands have correct anatomy with exactly 5 fingers each, no malformations. Model wears ${colorName} fashion that matches nails perfectly. Magazine-quality beauty photography, dramatic lighting, ultra-sharp focus on nails. A colored circular badge reads "TPO FREE • HEMA FREE" in perfectly spelled white text. Premium nail product photography for alohanails.gr`,

      // Lifestyle editorial shot
      `Editorial fashion photography: Elegant female model with perfectly manicured ${colorName} nails, hands positioned gracefully. Hands are naturally proportioned with correct finger count. She wears a stunning ${style} ${colorName} outfit coordinated with her manicure. Background is ${background} with sophisticated composition. Vogue-style photoshoot, professional lighting, luxury beauty aesthetic. Prominent colored circle badge displays "TPO FREE • HEMA FREE" in clear white lettering. High-end nail salon marketing for alohanails.gr`,

      // Artistic composition
      `High-fashion beauty editorial: Flawless hands with ${colorName} professional manicure, anatomically perfect with no defects or extra digits. ${style.charAt(0).toUpperCase() + style.slice(1)} aesthetic with model in matching ${colorName} designer clothing. Artistic ${background} setting, creative composition, studio-quality lighting. Premium product photography with colored badge showing "TPO FREE • HEMA FREE" in perfect white typography. Elite nail art photography for alohanails.gr`,
    ];

    const imagePromises = prompts.slice(0, 4).map(async (prompt) => {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'vivid',
      });

      return {
        url: response.data?.[0]?.url || '',
        prompt: prompt.substring(0, 150) + '...',
      };
    });

    const images = await Promise.all(imagePromises);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    );
  }
}

function getColorName(hexColor: string): string {
  const colorMap: { [key: string]: string } = {
    '#FF1493': 'deep pink',
    '#FF6B6B': 'coral red',
    '#B76E79': 'rose gold',
    '#DC143C': 'crimson red',
    '#800020': 'burgundy',
    '#F5DEB3': 'nude beige',
    '#E6E6FA': 'lavender',
    '#98FF98': 'mint green',
    '#000080': 'navy blue',
    '#000000': 'black',
  };

  return colorMap[hexColor.toUpperCase()] || 'vibrant';
}
