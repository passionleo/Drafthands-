import { UserRoleType } from './subscription';

export type VisitorPortalLocation = 
  | 'STUDENT_CAD' 
  | 'TEACHER_PORTAL' 
  | 'PARENT_PORTAL' 
  | 'WAEC_ARCHIVE' 
  | 'PUBLIC_LANDING' 
  | 'ADMIN_CONSOLE';

export type VisitorAccessStatus = 
  | 'ACTIVE' 
  | 'PERMITTED_BY_OWNER' 
  | 'ACCESS_REQUESTED' 
  | 'RESTRICTED';

export interface VisitorAccessRequest {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  institution: string;
  reason: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedDurationHours?: number;
}

export interface VisitorSession {
  id: string;
  ipHash: string;
  location: string;
  device: string;
  currentPortal: VisitorPortalLocation;
  currentTopicTitle?: string;
  startedAt: string;
  lastActiveAt: string;
  status: VisitorAccessStatus;
  accessGrantedUntil?: string | null;
  requestDetails?: VisitorAccessRequest;
}

export type SiteAccessPolicy = 
  | 'STANDARD'            // Standard preview (3 free topics per tier, paystack for rest)
  | 'OPEN_ALL_VISITORS'   // Owner temporarily opens all topics to every visitor
  | 'OWNER_APPROVAL_ONLY'; // Requires owner permit or VIP code to view full content

export interface VipAccessPass {
  code: string;
  label: string;
  createdAt: string;
  expiresAt: string;
  durationHours: number;
  maxUses: number;
  usedCount: number;
  role: UserRoleType;
  createdBy: string;
  active: boolean;
}

export interface LiveTrafficMetrics {
  liveActiveCount: number;
  totalVisitorsToday: number;
  totalPageViewsToday: number;
  avgSessionMinutes: number;
  portalDistribution: {
    studentCad: number;
    teacherPortal: number;
    parentPortal: number;
    waecArchive: number;
    publicLanding: number;
  };
  geoDistribution: Array<{
    region: string;
    count: number;
    percentage: number;
  }>;
  deviceBreakdown: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  recentActivityEvents: Array<{
    id: string;
    timestamp: string;
    description: string;
    type: 'visit' | 'drawing' | 'request' | 'approval' | 'export';
    portal: VisitorPortalLocation;
    location: string;
  }>;
}
