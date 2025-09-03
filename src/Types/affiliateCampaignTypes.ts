export interface AffiliateCampaign {
    id: number;
    campaignCode: string;
    name: string;
    description?: string | null;
    commissionPercent: number;   // Double bên backend
    createdAt: string;           // ISO từ LocalDateTime
    startAt?: string;
    expiredAt: string;           // ISO từ LocalDateTime
    active: boolean;
}

export interface CreateAffiliateCampaignRequest {
    // campaignCode: string;
    name: string;
    description?: string;
    commissionPercent: number;
    expiredAt: string;   // yyyy-MM-dd hoặc ISO (backend parse)
    active?: boolean;    // default true nếu không gửi
}
export interface AffiliateRegistrationResponse {
    id: number;
    campaignId: number;
    campaignTitle: string;
    campaignDescription?: string | null;
    commissionPercent?: number;
    startedAt?: string;   // campaign createdAt
    expiredAt?: string;   // campaign expiredAt
    registeredAt: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
}

// For Seller view of KOC registrations
export interface KocRegistration {
    id: number;
    koc: {
        id: number;
        kocCode: string;
        customer: {
            fullName: string;
            account: {
                username: string;
            };
        };
    };
    campaign: {
        id: number;
        campaignCode: string;
        name: string;
        commissionPercent: number;
        productCount: number; // Số lượng sản phẩm trong campaign
    };
    registeredAt: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface RegistrationApprovalResponse {
    id: number;
    campaignCode: string;
    campaignName: string;
    kocCode: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
}

// Extended fields returned from backend for richer KOC registration display
export interface AffiliateRegistrationResponseV2 extends AffiliateRegistrationResponse {
    campaignDescription?: string | null;
    commissionPercent?: number;
    startedAt?: string;
    expiredAt?: string;
}
