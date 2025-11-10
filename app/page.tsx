'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GeneratedImage {
  url: string;
  prompt: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [color, setColor] = useState('#FF1493');
  const [style, setStyle] = useState('elegant');
  const [background, setBackground] = useState('marble');
  const [error, setError] = useState('');

  const colorPresets = [
    { name: 'Deep Pink', value: '#FF1493' },
    { name: 'Coral Red', value: '#FF6B6B' },
    { name: 'Rose Gold', value: '#B76E79' },
    { name: 'Classic Red', value: '#DC143C' },
    { name: 'Burgundy', value: '#800020' },
    { name: 'Nude Beige', value: '#F5DEB3' },
    { name: 'Lavender', value: '#E6E6FA' },
    { name: 'Mint Green', value: '#98FF98' },
    { name: 'Navy Blue', value: '#000080' },
    { name: 'Black', value: '#000000' },
  ];

  const styleOptions = [
    'elegant',
    'edgy',
    'romantic',
    'minimalist',
    'glamorous',
    'bohemian',
  ];

  const backgroundOptions = [
    'marble',
    'silk fabric',
    'velvet',
    'minimalist studio',
    'botanical garden',
    'luxury hotel',
    'sunset beach',
    'modern architecture',
  ];

  const generateImages = async () => {
    setLoading(true);
    setError('');
    setImages([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          color,
          style,
          background,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate images');
      }

      const data = await response.json();
      setImages(data.images);
    } catch (err) {
      setError('Failed to generate images. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-4">
            Aloha Nails AI Photoshoot Pro
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Generate flawless, high-fashion product photography
          </p>
          <p className="text-sm text-gray-500">
            Ultra-realistic images with perfect hands, matching outfits, and luxury styling
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Nail Polish Color
              </label>
              <div className="space-y-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                />
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setColor(preset.value)}
                      className="h-10 rounded-lg border-2 border-gray-200 hover:border-pink-400 transition-all"
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Style Aesthetic
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none"
              >
                {styleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Background Setting
              </label>
              <select
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none"
              >
                {backgroundOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateImages}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating Editorial Images...
              </span>
            ) : (
              'Generate AI Photoshoot'
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Your Editorial Collection
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={img.url}
                      alt={`Generated nail art ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">{img.prompt}</p>
                    <a
                      href={img.url}
                      download={`aloha-nails-${idx + 1}.png`}
                      className="block w-full text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
                    >
                      Download High-Res Image
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-gray-600">
          <p className="text-sm">
            Powered by AI • Professional Product Photography for{' '}
            <a
              href="https://alohanails.gr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 font-semibold"
            >
              alohanails.gr
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
