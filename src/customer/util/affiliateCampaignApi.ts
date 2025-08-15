import axios from "axios";

export const fetchActiveCampaigns = async () => {
    // Đổi lại endpoint cho đúng backend của bạn
    const res = await axios.get("/api/affiliate-campaign/active");
    return res.data;
};
