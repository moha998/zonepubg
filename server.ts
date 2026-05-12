import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post('/api/tiktok/render', async (req, res) => {
    try {
      const { smartText, newsImage } = req.body;
      if (!smartText) {
        return res.status(400).json({ error: 'Smart text is required' });
      }

      console.log('Generating TikTok video for text:', smartText);

      // Call Creatomate
      const creatomateKey = process.env.CREATOMATE_API_KEY;
      if (!creatomateKey) {
        throw new Error('CREATOMATE_API_KEY is not set');
      }

      // Using the user-provided template ID and modification key
      const templateId = process.env.VITE_CREATOMATE_TEMPLATE_ID || '32297bf4-380c-42c3-87cf-518ae5ace28c';

      const modifications: any = {
        'Title': smartText, // User specified "Title" as the element name
      };

      if (newsImage) {
        modifications['Image-1'] = newsImage;
      }

      console.log('Calling Creatomate with template:', templateId);

      const response = await fetch('https://api.creatomate.com/v1/renders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${creatomateKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template_id: templateId,
          modifications: modifications
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Creatomate Error Response:', errorData);
        throw new Error(`Creatomate API error: ${errorData.message || JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Creatomate render request success:', data);
      
      // Return the render object. The client should check data[0].url and status.
      res.json(data[0] || data);
    } catch (error: any) {
      console.error('TikTok Render Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
