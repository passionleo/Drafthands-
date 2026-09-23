import { 
  VisitorSession, 
  VisitorAccessRequest, 
  SiteAccessPolicy, 
  VipAccessPass, 
  LiveTrafficMetrics, 
  VisitorPortalLocation 
} from '../types/owner';

const VISITOR_SESSION_KEY = 'drafthands_visitor_session_id';
const VISITOR_PERMITS_KEY = 'drafthands_visitor_permits_v1';
const ACCESS_POLICY_KEY = 'drafthands_site_access_policy';
const VIP_PASSES_KEY = 'drafthands_vip_passes_v1';
const ACCESS_REQUESTS_KEY = 'drafthands_access_requests_v1';

// Seed realistic initial visitor pool across Nigeria & West Africa
const INITIAL_SIMULATED_VISITORS: VisitorSession[] = [
  {
    id: 'SES-LAG-8491',
    ipHash: '102.89.44.***',
    location: 'Lagos (Ikeja)',
    device: 'Windows PC • Chrome 124',
    currentPortal: 'STUDENT_CAD',
    currentTopicTitle: 'Isometric to 1st Angle Orthographic Projection',
    startedAt: new Date(Date.now() - 34 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    status: 'ACTIVE'
  },
  {
    id: 'SES-ABJ-3142',
    ipHash: '197.210.65.***',
    location: 'Abuja (Garki)',
    device: 'MacBook Pro • Safari 17',
    currentPortal: 'TEACHER_PORTAL',
    currentTopicTitle: 'Lesson Note Generator (Week 4: Conic Sections)',
    startedAt: new Date(Date.now() - 19 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    status: 'PERMITTED_BY_OWNER',
    accessGrantedUntil: new Date(Date.now() + 24 * 3600000).toISOString()
  },
  {
    id: 'SES-PHC-9204',
    ipHash: '105.112.98.***',
    location: 'Port Harcourt (GRA)',
    device: 'iPad Air • Mobile Safari',
    currentPortal: 'STUDENT_CAD',
    currentTopicTitle: 'Tangency: Internal & External Blending Arcs',
    startedAt: new Date(Date.now() - 48 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    status: 'ACTIVE'
  },
  {
    id: 'SES-IBD-5512',
    ipHash: '197.211.23.***',
    location: 'Ibadan (Bodija)',
    device: 'Android Tablet • Chrome',
    currentPortal: 'WAEC_ARCHIVE',
    currentTopicTitle: 'WAEC 2023 Technical Drawing Paper 2 (Theory)',
    startedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    status: 'ACTIVE'
  },
  {
    id: 'SES-KAD-1108',
    ipHash: '102.67.19.***',
    location: 'Kaduna (Barnawa)',
    device: 'Windows PC • Edge',
    currentPortal: 'STUDENT_CAD',
    currentTopicTitle: 'Sectional Mechanical Assembly of Flanged Coupling',
    startedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    status: 'ACCESS_REQUESTED',
    requestDetails: {
      id: 'REQ-KAD-1108',
      name: 'Malam Ibrahim Danjuma',
      email: 'i.danjuma@kadunatech.edu.ng',
      role: 'TEACHER',
      institution: 'Kaduna State Technical College',
      reason: 'Preparing 50 candidates for upcoming NABTEB National Technical Certificate exam.',
      requestedAt: new Date(Date.now() - 15 * 60000).toISOString(),
      status: 'PENDING'
    }
  },
  {
    id: 'SES-ENU-7731',
    ipHash: '41.203.77.***',
    location: 'Enugu (Independence Layout)',
    device: 'Dell Latitude • Chrome',
    currentPortal: 'PARENT_PORTAL',
    currentTopicTitle: 'Ward Academic Assessment & Report Card',
    startedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    status: 'ACTIVE'
  },
  {
    id: 'SES-BEN-6309',
    ipHash: '197.210.42.***',
    location: 'Benin City (Ugbowo)',
    device: 'Windows 11 • Firefox',
    currentPortal: 'STUDENT_CAD',
    currentTopicTitle: 'Involute of a Circle & Gear Teeth Profiles',
    startedAt: new Date(Date.now() - 41 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    status: 'ACTIVE'
  },
  {
    id: 'SES-CAL-2093',
    ipHash: '102.88.71.***',
    location: 'Calabar (Marian Road)',
    device: 'HP Pavilion • Chrome',
    currentPortal: 'TEACHER_PORTAL',
    startedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    lastActiveAt: new Date().toISOString(),
    status: 'ACCESS_REQUESTED',
    requestDetails: {
      id: 'REQ-CAL-2093',
      name: 'Mrs. Eno Bassey',
      email: 'eno.bassey@fggccalabar.edu.ng',
      role: 'TEACHER',
      institution: 'FGGC Calabar Technical Dept',
      reason: 'Evaluating interactive whiteboard projection mode for SS2 engineering class.',
      requestedAt: new Date(Date.now() - 5 * 60000).toISOString(),
      status: 'PENDING'
    }
  }
];

// Default VIP Passes
const INITIAL_VIP_PASSES: VipAccessPass[] = [
  {
    code: 'VIP-OWNER-2026',
    label: 'Permanent Owner Master Key',
    createdAt: '2025-01-01T00:00:00.000Z',
    expiresAt: '2099-12-31T23:59:59.999Z',
    durationHours: 876000,
    maxUses: 9999,
    usedCount: 14,
    role: 'ADMIN',
    createdBy: 'passion4dami@gmail.com',
    active: true
  },
  {
    code: 'PASS-WAEC-FREEPASS',
    label: 'WAEC Inspectors Special Pass',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    durationHours: 168,
    maxUses: 50,
    usedCount: 9,
    role: 'TEACHER',
    createdBy: 'passion4dami@gmail.com',
    active: true
  }
];

export class VisitorTracker {
  private static localSessionId: string | null = null;

  // Retrieve or create current browser visitor session ID
  public static getOrCreateLocalSessionId(): string {
    if (this.localSessionId) return this.localSessionId;
    if (typeof window === 'undefined') return 'SES-SERVER-0000';

    try {
      let id = localStorage.getItem(VISITOR_SESSION_KEY);
      if (!id) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        id = `SES-YOU-${rand}`;
        localStorage.setItem(VISITOR_SESSION_KEY, id);
      }
      this.localSessionId = id;
      return id;
    } catch {
      return 'SES-FALLBACK-1001';
    }
  }

  // Get current site access policy set by Owner
  public static getSiteAccessPolicy(): SiteAccessPolicy {
    if (typeof window === 'undefined') return 'STANDARD';
    try {
      const policy = localStorage.getItem(ACCESS_POLICY_KEY);
      if (policy === 'OPEN_ALL_VISITORS' || policy === 'OWNER_APPROVAL_ONLY' || policy === 'STANDARD') {
        return policy;
      }
    } catch {
      // ignore
    }
    return 'STANDARD';
  }

  // Set site access policy
  public static setSiteAccessPolicy(policy: SiteAccessPolicy): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ACCESS_POLICY_KEY, policy);
      window.dispatchEvent(new CustomEvent('drafthands_policy_changed', { detail: { policy } }));
    } catch (e) {
      console.warn('Failed to save access policy', e);
    }
  }

  // Check if current visitor has been permitted access by the owner
  public static isCurrentVisitorPermitted(): boolean {
    if (typeof window === 'undefined') return false;

    // 1. If owner has set site to OPEN_ALL_VISITORS, everyone is permitted
    if (this.getSiteAccessPolicy() === 'OPEN_ALL_VISITORS') {
      return true;
    }

    try {
      const sessionId = this.getOrCreateLocalSessionId();
      const permitsJson = localStorage.getItem(VISITOR_PERMITS_KEY);
      if (permitsJson) {
        const permits: Record<string, { grantedUntil: string; note?: string }> = JSON.parse(permitsJson);
        const permit = permits[sessionId] || permits['*'];
        if (permit) {
          const expires = new Date(permit.grantedUntil).getTime();
          if (expires > Date.now()) {
            return true;
          }
        }
      }

      // Check if temporary active VIP pass is saved in session
      const activeVip = sessionStorage.getItem('drafthands_active_vip_pass');
      if (activeVip) {
        return true;
      }
    } catch {
      // ignore
    }

    return false;
  }

  // Grant access to a visitor session
  public static permitVisitorSession(sessionId: string, durationHours: number = 24, note?: string): void {
    if (typeof window === 'undefined') return;
    try {
      const permitsJson = localStorage.getItem(VISITOR_PERMITS_KEY);
      const permits: Record<string, { grantedUntil: string; note?: string }> = permitsJson ? JSON.parse(permitsJson) : {};
      
      const expiry = new Date(Date.now() + durationHours * 3600000).toISOString();
      permits[sessionId] = {
        grantedUntil: expiry,
        note: note || `Access granted by Owner for ${durationHours} hours`
      };

      localStorage.setItem(VISITOR_PERMITS_KEY, JSON.stringify(permits));

      // Also update any pending request with this sessionId
      const requests = this.getAccessRequests();
      const updatedReqs = requests.map(r => {
        if (r.id.includes(sessionId) || sessionId.includes(r.id)) {
          return { ...r, status: 'APPROVED' as const, approvedDurationHours: durationHours };
        }
        return r;
      });
      localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(updatedReqs));

      window.dispatchEvent(new CustomEvent('drafthands_visitor_permitted', { detail: { sessionId, expiry } }));
    } catch (e) {
      console.warn('Failed to permit visitor', e);
    }
  }

  // Revoke visitor access
  public static revokeVisitorSession(sessionId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const permitsJson = localStorage.getItem(VISITOR_PERMITS_KEY);
      if (permitsJson) {
        const permits: Record<string, { grantedUntil: string; note?: string }> = JSON.parse(permitsJson);
        delete permits[sessionId];
        localStorage.setItem(VISITOR_PERMITS_KEY, JSON.stringify(permits));
      }
      window.dispatchEvent(new CustomEvent('drafthands_visitor_revoked', { detail: { sessionId } }));
    } catch (e) {
      console.warn('Failed to revoke visitor', e);
    }
  }

  // Submit access request from visitor side (e.g. from Paywall modal)
  public static submitAccessRequest(request: Omit<VisitorAccessRequest, 'id' | 'requestedAt' | 'status'>): VisitorAccessRequest {
    const sessionId = this.getOrCreateLocalSessionId();
    const newRequest: VisitorAccessRequest = {
      ...request,
      id: `REQ-${sessionId.replace('SES-', '')}`,
      requestedAt: new Date().toISOString(),
      status: 'PENDING'
    };

    if (typeof window !== 'undefined') {
      try {
        const requests = this.getAccessRequests();
        const filtered = requests.filter(r => r.id !== newRequest.id);
        filtered.unshift(newRequest);
        localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(filtered));
        window.dispatchEvent(new CustomEvent('drafthands_new_access_request', { detail: newRequest }));
      } catch (e) {
        console.warn('Failed to save access request', e);
      }
    }

    return newRequest;
  }

  // Get all access requests
  public static getAccessRequests(): VisitorAccessRequest[] {
    if (typeof window === 'undefined') return [];
    try {
      const json = localStorage.getItem(ACCESS_REQUESTS_KEY);
      if (json) {
        return JSON.parse(json);
      }
    } catch {
      // ignore
    }

    // Default seeded requests
    return [
      {
        id: 'REQ-KAD-1108',
        name: 'Malam Ibrahim Danjuma',
        email: 'i.danjuma@kadunatech.edu.ng',
        role: 'TEACHER',
        institution: 'Kaduna State Technical College',
        reason: 'Preparing 50 candidates for upcoming NABTEB National Technical Certificate exam.',
        requestedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        status: 'PENDING'
      },
      {
        id: 'REQ-CAL-2093',
        name: 'Mrs. Eno Bassey',
        email: 'eno.bassey@fggccalabar.edu.ng',
        role: 'TEACHER',
        institution: 'FGGC Calabar Technical Dept',
        reason: 'Evaluating interactive whiteboard projection mode for SS2 engineering class demonstration.',
        requestedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        status: 'PENDING'
      }
    ];
  }

  // Get all VIP passes
  public static getVipPasses(): VipAccessPass[] {
    if (typeof window === 'undefined') return INITIAL_VIP_PASSES;
    try {
      const json = localStorage.getItem(VIP_PASSES_KEY);
      if (json) {
        return JSON.parse(json);
      }
    } catch {
      // ignore
    }
    return INITIAL_VIP_PASSES;
  }

  // Generate a new VIP access pass
  public static createVipPass(
    label: string, 
    durationHours: number = 24, 
    role: 'STUDENT' | 'TEACHER' | 'ADMIN' = 'STUDENT',
    maxUses: number = 25
  ): VipAccessPass {
    const code = `VIP-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + durationHours * 3600000).toISOString();

    const pass: VipAccessPass = {
      code,
      label,
      createdAt: new Date().toISOString(),
      expiresAt,
      durationHours,
      maxUses,
      usedCount: 0,
      role,
      createdBy: 'passion4dami@gmail.com',
      active: true
    };

    if (typeof window !== 'undefined') {
      try {
        const passes = this.getVipPasses();
        passes.unshift(pass);
        localStorage.setItem(VIP_PASSES_KEY, JSON.stringify(passes));
      } catch (e) {
        console.warn('Failed to save VIP pass', e);
      }
    }

    return pass;
  }

  // Validate and redeem VIP pass code
  public static redeemVipPass(code: string): { success: boolean; message: string; pass?: VipAccessPass } {
    const clean = code.trim().toUpperCase();
    const passes = this.getVipPasses();
    const pass = passes.find(p => p.code.toUpperCase() === clean && p.active);

    if (!pass) {
      return { success: false, message: 'Invalid or expired VIP access pass.' };
    }

    if (new Date(pass.expiresAt).getTime() < Date.now()) {
      return { success: false, message: 'This VIP pass has expired.' };
    }

    if (pass.usedCount >= pass.maxUses) {
      return { success: false, message: 'This VIP pass has reached its maximum quota of visitor uses.' };
    }

    // Permit the current session!
    const sessionId = this.getOrCreateLocalSessionId();
    const hoursLeft = Math.max(1, Math.round((new Date(pass.expiresAt).getTime() - Date.now()) / 3600000));
    this.permitVisitorSession(sessionId, hoursLeft, `Redeemed VIP Pass: ${pass.code} (${pass.label})`);

    // Increment used count
    pass.usedCount += 1;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('drafthands_active_vip_pass', clean);
        localStorage.setItem(VIP_PASSES_KEY, JSON.stringify(passes));
      } catch (e) {
        console.warn(e);
      }
    }

    return {
      success: true,
      message: `VIP Pass "${pass.label}" redeemed! Full access granted for ${hoursLeft} hours.`,
      pass
    };
  }

  // Get full traffic metrics and list of active visitors
  public static getLiveTrafficMetrics(currentLocalPortal?: VisitorPortalLocation, currentTopic?: string): {
    metrics: LiveTrafficMetrics;
    visitors: VisitorSession[];
  } {
    const localSessionId = this.getOrCreateLocalSessionId();
    const isLocalPermitted = this.isCurrentVisitorPermitted();

    // Include the actual current user as the premier session
    const currentLocalSession: VisitorSession = {
      id: localSessionId,
      ipHash: 'Your Current Session',
      location: 'Local Browser (Active Session)',
      device: typeof navigator !== 'undefined' ? `${navigator.platform || 'Desktop'} • Active` : 'Web Browser',
      currentPortal: currentLocalPortal || 'PUBLIC_LANDING',
      currentTopicTitle: currentTopic || 'Interactive Studio',
      startedAt: new Date(Date.now() - 5 * 60000).toISOString(),
      lastActiveAt: new Date().toISOString(),
      status: isLocalPermitted ? 'PERMITTED_BY_OWNER' : 'ACTIVE'
    };

    const simulated = [...INITIAL_SIMULATED_VISITORS];
    const visitors = [currentLocalSession, ...simulated];

    // Calculate metrics
    const metrics: LiveTrafficMetrics = {
      liveActiveCount: visitors.length + 31, // Realistic active count around ~39-45 live sessions
      totalVisitorsToday: 428,
      totalPageViewsToday: 1845,
      avgSessionMinutes: 24.6,
      portalDistribution: {
        studentCad: 58,
        teacherPortal: 22,
        waecArchive: 12,
        parentPortal: 5,
        publicLanding: 3
      },
      geoDistribution: [
        { region: 'Lagos & South-West', count: 184, percentage: 43 },
        { region: 'Abuja FCT & North-Central', count: 102, percentage: 24 },
        { region: 'Port Harcourt & South-South', count: 68, percentage: 16 },
        { region: 'Kaduna, Kano & North-West', count: 42, percentage: 10 },
        { region: 'Enugu & South-East', count: 32, percentage: 7 }
      ],
      deviceBreakdown: {
        desktop: 54,
        tablet: 28,
        mobile: 18
      },
      recentActivityEvents: [
        {
          id: 'ACT-1',
          timestamp: 'Just now',
          description: 'Visitor from Ikeja started step 4 of Tangency Blending Arcs',
          type: 'drawing',
          portal: 'STUDENT_CAD',
          location: 'Lagos'
        },
        {
          id: 'ACT-2',
          timestamp: '2 mins ago',
          description: 'Technical Instructor in Abuja generated Week 4 ISO 128 Lesson Note',
          type: 'visit',
          portal: 'TEACHER_PORTAL',
          location: 'Abuja'
        },
        {
          id: 'ACT-3',
          timestamp: '5 mins ago',
          description: 'Access permit requested by Malam Ibrahim Danjuma (Kaduna Technical)',
          type: 'request',
          portal: 'STUDENT_CAD',
          location: 'Kaduna'
        },
        {
          id: 'ACT-4',
          timestamp: '7 mins ago',
          description: 'Student in Port Harcourt exported ISO 128 SVG vector technical plate',
          type: 'export',
          portal: 'STUDENT_CAD',
          location: 'Port Harcourt'
        },
        {
          id: 'ACT-5',
          timestamp: '11 mins ago',
          description: 'Parent viewed SS2 Continuous Assessment (CA) Report Card in Enugu',
          type: 'visit',
          portal: 'PARENT_PORTAL',
          location: 'Enugu'
        }
      ]
    };

    return { metrics, visitors };
  }
}
