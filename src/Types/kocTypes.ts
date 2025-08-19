export interface CreateKocRequest {
    customerId: number;
    facebookLink?: string;
    instagramLink?: string;
    tiktokLink?: string;
    youtubeLink?: string;
}

export interface Koc {
    id: number;
    kocCode: string;
    accountStatus?: string;
    // … nếu cần thêm
}
