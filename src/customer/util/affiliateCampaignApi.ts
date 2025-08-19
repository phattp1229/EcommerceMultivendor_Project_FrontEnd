import { api } from "../../Config/Api";

export const fetchActiveCampaigns = async () => {
    const jwt = localStorage.getItem("jwt") || "";
    const res = await api.get("/api/koc/affiliate-campaign/active", {
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : undefined,
    });
    return res.data;
};
