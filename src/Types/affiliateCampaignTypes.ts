export interface AffiliateCampaign {
    id: number;
    campaignCode: string;
    name: string;
    description?: string | null;
    commissionPercent: number;   // Double bên backend
    createdAt: string;           // ISO từ LocalDateTime
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