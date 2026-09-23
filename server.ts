import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
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

// ================= REAL-TIME WEBSOCKET CLASSROOM ENGINE =================
interface LiveClientMeta {
  userId: string;
  userName: string;
  role: string;
  roomCode: string;
  isAudioMuted?: boolean;
  isVideoOff?: boolean;
  isHandRaised?: boolean;
  hasDrawingPermission?: boolean;
  joinedAt: number;
}

interface RoomState {
  roomCode: string;
  clients: Set<WebSocket>;
  clientMeta: Map<WebSocket, LiveClientMeta>;
  boardElements: any[];
  activeTopicId: string;
  drawingPermissionMode: string;
}

const liveRooms = new Map<string, RoomState>();

function getOrCreateRoom(roomCode: string): RoomState {
  let room = liveRooms.get(roomCode);
  if (!room) {
    room = {
      roomCode,
      clients: new Set(),
      clientMeta: new Map(),
      boardElements: [],
      activeTopicId: "",
      drawingPermissionMode: "TEACHER_ONLY"
    };
    liveRooms.set(roomCode, room);
  }
  return room;
}

async function startServer() {
  const httpServer = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket Upgrade for /ws/live/:roomCode
  httpServer.on("upgrade", (request, socket, head) => {
    try {
      const parsedUrl = new URL(request.url || "", `http://${request.headers.host || "localhost"}`);
      if (parsedUrl.pathname.startsWith("/ws/live")) {
        wss.handleUpgrade(request, socket, head, (ws) => {
          const parts = parsedUrl.pathname.split("/").filter(Boolean);
          const roomCode = parts[2] || parsedUrl.searchParams.get("room") || "TD-SS2-DEFAULT";
          wss.emit("connection", ws, request, roomCode);
        });
      }
    } catch (e) {
      console.warn("WebSocket upgrade error:", e);
    }
  });

  wss.on("connection", (ws: WebSocket & { isAlive?: boolean }, _req: http.IncomingMessage, roomCode: string) => {
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    const room = getOrCreateRoom(roomCode);
    room.clients.add(ws);

    // 1. Immediately send current whiteboard elements state to newly connected client
    if (room.boardElements && room.boardElements.length > 0) {
      try {
        ws.send(JSON.stringify({
          id: `srv-board-${Date.now()}`,
          roomCode,
          senderId: "server",
          senderName: "Classroom Server",
          type: "CANVAS_FULL_SYNC",
          payload: {
            elements: room.boardElements,
            topicId: room.activeTopicId,
            mode: room.drawingPermissionMode
          },
          timestamp: Date.now()
        }));
      } catch {}
    }

    // 2. Send current participant roster
    const activeParticipants = Array.from(room.clientMeta.values()).map(meta => ({
      id: meta.userId,
      name: meta.userName,
      role: meta.role,
      isAudioMuted: !!meta.isAudioMuted,
      isVideoOff: !!meta.isVideoOff,
      isHandRaised: !!meta.isHandRaised,
      hasDrawingPermission: !!meta.hasDrawingPermission,
      isSpotlighted: meta.role === "TEACHER",
      isSpeaking: false,
      audioLevel: 0,
      joinedAt: meta.joinedAt
    }));

    if (activeParticipants.length > 0) {
      try {
        ws.send(JSON.stringify({
          id: `srv-roster-${Date.now()}`,
          roomCode,
          senderId: "server",
          senderName: "Classroom Server",
          type: "PARTICIPANT_ROSTER_SYNC",
          payload: {
            participants: activeParticipants
          },
          timestamp: Date.now()
        }));
      } catch {}
    }

    // 3. Handle messages from client
    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (!msg || !msg.type) return;

        // Register client metadata if not present or update
        let meta = room.clientMeta.get(ws);
        if (!meta) {
          meta = {
            userId: msg.senderId || `usr-${Date.now()}`,
            userName: msg.senderName || "Participant",
            role: msg.payload?.role || (msg.senderId?.startsWith("teacher") ? "TEACHER" : "STUDENT"),
            roomCode,
            joinedAt: Date.now()
          };
          room.clientMeta.set(ws, meta);
        }

        // Update server room state for whiteboard and permissions
        if (msg.type === "CANVAS_FULL_SYNC" && msg.payload?.elements) {
          room.boardElements = msg.payload.elements;
          if (msg.payload.topicId) room.activeTopicId = msg.payload.topicId;
        } else if (msg.type === "CANVAS_CLEAR") {
          room.boardElements = [];
        } else if (msg.type === "CANVAS_ELEMENT_ADD" && msg.payload) {
          room.boardElements.push(msg.payload);
        } else if (msg.type === "PERMISSION_CHANGE" && msg.payload?.mode) {
          room.drawingPermissionMode = msg.payload.mode;
        } else if (msg.type === "REQUEST_FULL_SYNC") {
          ws.send(JSON.stringify({
            id: `srv-sync-reply-${Date.now()}`,
            roomCode,
            senderId: "server",
            senderName: "Classroom Server",
            type: "CANVAS_FULL_SYNC",
            payload: {
              elements: room.boardElements,
              topicId: room.activeTopicId,
              mode: room.drawingPermissionMode
            },
            timestamp: Date.now()
          }));
          return;
        } else if (msg.type === "MEDIA_STATE_CHANGE") {
          if (meta) {
            meta.isAudioMuted = msg.payload?.isAudioMuted;
            meta.isVideoOff = msg.payload?.isVideoOff;
          }
        }

        // Broadcast to all other clients in this specific room
        const serialized = JSON.stringify(msg);
        room.clients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(serialized);
          }
        });
      } catch (err) {
        console.warn("[WS message parse error]:", err);
      }
    });

    // 4. Handle client disconnect
    ws.on("close", () => {
      room.clients.delete(ws);
      const meta = room.clientMeta.get(ws);
      room.clientMeta.delete(ws);

      if (meta) {
        const leaveMsg = JSON.stringify({
          id: `srv-leave-${Date.now()}`,
          roomCode,
          senderId: meta.userId,
          senderName: meta.userName,
          type: "PARTICIPANT_LEAVE",
          payload: { userId: meta.userId, userName: meta.userName },
          timestamp: Date.now()
        });

        room.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(leaveMsg);
          }
        });
      }

      // Cleanup empty rooms after 15 minutes of inactivity
      if (room.clients.size === 0) {
        setTimeout(() => {
          if (room.clients.size === 0) {
            liveRooms.delete(roomCode);
          }
        }, 15 * 60 * 1000);
      }
    });
  });

  // Heartbeat ping/pong every 25 seconds to keep WebSockets alive
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws: any) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 25000);

  wss.on("close", () => {
    clearInterval(heartbeatInterval);
  });

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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Drafthands server running on http://0.0.0.0:${PORT} with WebSocket real-time live sync`);
  });
}

startServer();

