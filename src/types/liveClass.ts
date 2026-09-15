import { CurriculumTier } from './curriculum';
import { WhiteboardElement, OnScreenInstrument, WorkspaceMode } from './whiteboard';

export type ParticipantRole = 'TEACHER' | 'STUDENT' | 'CO_HOST';

export type DrawingPermissionMode = 'TEACHER_ONLY' | 'COLLABORATIVE' | 'INDIVIDUAL_PERMIT';

export type VideoLayoutMode = 
  | 'SPLIT_EQUAL' 
  | 'SPLIT_SIDEBAR' 
  | 'SPLIT_STAGE' 
  | 'FLOATING_PIP' 
  | 'MINI_DOCK' 
  | 'GALLERY_FOCUS'
  | 'FULL_BOARD';

export type ClassroomResourceTab = 
  | 'BOARD' 
  | 'CURRICULUM' 
  | 'PAST_QUESTIONS' 
  | 'TEXTBOOK_PLATES' 
  | 'ASSIGNMENTS' 
  | 'ISO_STANDARDS';

export interface LiveParticipant {
  id: string;
  name: string;
  role: ParticipantRole;
  avatarBg: string;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
  audioLevel: number; // 0 to 1
  hasDrawingPermission: boolean;
  isSpotlighted: boolean;
  joinedAt: number;
  gradeOrClass?: string;
  videoStreamUrl?: string;
}

export interface LiveChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: ParticipantRole;
  text: string;
  timestamp: string;
  isQuestion?: boolean;
  upvotes?: number;
}

export interface RemoteCursor {
  participantId: string;
  participantName: string;
  role: ParticipantRole;
  color: string;
  x: number;
  y: number;
  lastActive: number;
}

export interface LaserPointerPosition {
  active: boolean;
  x: number;
  y: number;
  teacherName: string;
  color: string;
}

export interface LiveClassSession {
  id: string;
  roomCode: string;
  topicId: string;
  topicTitle: string;
  tier: CurriculumTier;
  teacherName: string;
  schoolName: string;
  drawingPermissionMode: DrawingPermissionMode;
  isRecording: boolean;
  isScreenSharing: boolean;
  startedAt: number;
  activeMode: WorkspaceMode;
  participants: LiveParticipant[];
}

export type LiveSyncEventType =
  | 'CANVAS_STROKE_START'
  | 'CANVAS_STROKE_MOVE'
  | 'CANVAS_STROKE_END'
  | 'CANVAS_ELEMENT_ADD'
  | 'CANVAS_ELEMENT_UPDATE'
  | 'CANVAS_ELEMENT_DELETE'
  | 'CANVAS_CLEAR'
  | 'CANVAS_FULL_SYNC'
  | 'INSTRUMENT_MOVE'
  | 'LASER_POINTER_MOVE'
  | 'CURSOR_MOVE'
  | 'PERMISSION_CHANGE'
  | 'HAND_RAISE'
  | 'CHAT_MESSAGE'
  | 'MEDIA_STATE_CHANGE'
  | 'PARTICIPANT_JOIN'
  | 'PARTICIPANT_LEAVE'
  | 'REQUEST_FULL_SYNC';

export interface LiveSyncMessage {
  id: string;
  roomCode: string;
  senderId: string;
  senderName: string;
  type: LiveSyncEventType;
  payload: any;
  timestamp: number;
}
