import { useState } from 'react';
import { X, Check, Building2, Book } from 'lucide-react';
import OpenAI from 'openai';

interface AskAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIconSelect: (svgPath: string) => void;
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface GeneratedIcon {
  path: string;
  viewBox: string;
}

export function AskAIModal({ isOpen, onClose, onIconSelect }: AskAIModalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcon[]>([]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    try {
      setLoading(true);
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: `You are an expert in creating SVG path data for Lucide-style icons. Create simple, minimal, stroke-based icons similar to Lucide's style. 
          Rules:
          1. Create exactly 3 different variations
          2. Each path should ONLY contain the path data (no <path> tags)
          3. Use stroke-width=2 and 24x24 viewBox
          4. Keep paths simple and minimal
          5. Use only M, L, C, A commands for smooth paths
          6. Ensure paths are closed
          7. Return valid JSON array`
        }, {
          role: "user",
          content: `Create 3 different minimal SVG icons for: ${prompt}. Return only the JSON array with path and viewBox. Example:
          [
            {"path": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z", "viewBox": "0 0 24 24"},
            ...
          ]`
        }],
        temperature: 0.7,
      });

      if (response.choices[0]?.message?.content) {
        try {
          const icons: GeneratedIcon[] = JSON.parse(response.choices[0].message.content);
          setGeneratedIcons(icons);
        } catch (e) {
          console.error('Failed to parse icons:', e);
        }
      }
    } catch (error) {
      console.error('Error generating icons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIconClick = (icon: GeneratedIcon) => {
    onIconSelect(icon.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Describe your business and let AI do magic ✨</h2>
        
        <div className="relative mb-8">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="ai image generator"
            className="w-full p-2 border rounded mb-4 text-black"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleSubmit();
              }
            }}
          />
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Icons'}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {generatedIcons.length > 0 ? (
            generatedIcons.map((icon, index) => (
              <button
                key={index}
                onClick={() => handleIconClick(icon)}
                className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors p-4"
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox={icon.viewBox}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-800"
                >
                  <path d={icon.path} />
                </svg>
              </button>
            ))
          ) : (
            <>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center p-4">
                <Check className="w-full h-full text-gray-800" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center p-4">
                <Building2 className="w-full h-full text-gray-800" />
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center p-4">
                <Book className="w-full h-full text-gray-800" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
