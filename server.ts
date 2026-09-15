import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy initialization of Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Technical topic curated fallback schematics
const CURATED_BLUEPRINTS: Record<string, string[]> = {
  default: [
    "/assets/actual_orthographic_diagram.jpg",
    "/assets/actual_isometric_diagram.jpg"
  ],
  "TD-SS1-MOD01": [
    "/assets/bisection_plate.jpg",
    "/assets/actual_geometry_tangency.jpg"
  ],
  "TD-SS1-MOD02": [
    "/assets/bisection_plate.jpg",
    "/assets/scales_plate.jpg"
  ],
  "TD-SS1-MOD03": [
    "/assets/actual_polygon_conic.jpg",
    "/assets/conic_sections_plate.jpg"
  ],
  "TD-SS1-MOD04": [
    "/assets/scales_plate.jpg",
    "/assets/actual_drafting_instruments.jpg"
  ],
  "TD-SS1-MOD05": [
    "/assets/actual_orthographic_diagram.jpg",
    "/assets/actual_isometric_diagram.jpg"
  ],
  "TD-SS2-MOD02": [
    "/assets/actual_geometry_tangency.jpg",
    "/assets/conic_sections_plate.jpg"
  ],
  "TD-SS2-MOD03": [
    "/assets/actual_isometric_diagram.jpg",
    "/assets/actual_orthographic_diagram.jpg"
  ],
  "TD-SS2-MOD04": [
    "/assets/conic_sections_plate.jpg",
    "/assets/actual_polygon_conic.jpg"
  ],
  "TD-SS2-MOD05": [
    "/assets/surface_development_plate.jpg",
    "/assets/actual_orthographic_diagram.jpg"
  ],
  "TD-SS3-MOD01": [
    "/assets/sectioning_plate.jpg",
    "/assets/actual_orthographic_diagram.jpg"
  ],
  "TD-SS3-MOD02": [
    "/assets/actual_building_foundation.jpg",
    "/assets/actual_orthographic_diagram.jpg"
  ],
  "TD-SS3-MOD03": [
    "/assets/actual_fastener_drawing.jpg",
    "/assets/sectioning_plate.jpg"
  ]
};

// API Route: Generate topic diagrams using Gemini Image Generation with fallback
app.post("/api/generate-topic-diagrams", async (req, res) => {
  try {
    const { prompt, topicId } = req.body || {};
    const ai = getAI();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                text: prompt || `Generate a clean, high-precision technical drawing schematic blueprint for topic: ${topicId || 'Engineering Drawing'}. Dark blue engineering blueprint aesthetic with white/cyan dimension lines.`
              }
            ]
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9"
            }
          }
        });

        const imageUrls: string[] = [];
        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            imageUrls.push(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
          }
        }

        if (imageUrls.length > 0) {
          return res.json({ success: true, imageUrls });
        }
      } catch (geminiError: any) {
        console.warn("Gemini image generation attempt notice:", geminiError?.message || geminiError);
        // Graceful fallback to verified technical CAD blueprint schematics
      }
    }

    // Return curated high-definition blueprint illustrations
    const fallbackUrls = CURATED_BLUEPRINTS[topicId] || CURATED_BLUEPRINTS.default;
    return res.json({
      success: true,
      imageUrls: fallbackUrls,
      source: "curated_blueprint_cache"
    });
  } catch (error: any) {
    console.error("Error in /api/generate-topic-diagrams:", error);
    return res.status(500).json({ error: error.message || "Failed to generate topic diagrams" });
  }
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Drafthands server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
