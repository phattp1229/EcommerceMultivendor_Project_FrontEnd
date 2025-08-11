import React, { useMemo } from "react";
import { Box } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type RawStatus =
  | "PENDING" | "PLACE" | "PLACED"
  | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  | undefined;

type Props = {
  orderStatus?: RawStatus;
  orderDate?: string;
  deliverDate?: string;
  packedDate?: string;
  etaFrom?: string;
  etaTo?: string;
};

const RAW_TO_STEP = {
  PENDING: "PENDING",
  PLACE: "PLACED",
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

const STEP_ORDER = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

const fmt = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString("vi-VN");
};

const OrderStepper: React.FC<Props> = ({
  orderStatus,
  orderDate,
  deliverDate,
    packedDate,
  etaFrom,
  etaTo,
}) => {
  const norm = orderStatus ? RAW_TO_STEP[orderStatus] ?? "PLACED" : "PLACED";

  const steps =
    norm === "CANCELLED"
      ? [
          { name: "Order Placed", value: "PLACED", desc: orderDate ? `on ${fmt(orderDate)}` : "" },
          { name: "Order Canceled", value: "CANCELLED", desc: "" },
        ]
      : [
          { name: "Order Placed", value: "PLACED", desc: orderDate ? `on ${fmt(orderDate)}` : "" },
          { name: "Packed",       value: "CONFIRMED", desc: packedDate ? `on ${fmt(packedDate)}` : "" },
          { name: "Shipped",      value: "SHIPPED",   desc: "" },
          { name: "Arriving",     value: "ARRIVING",  desc: (etaFrom || etaTo) ? `by ${etaFrom ?? ""}${etaFrom && etaTo ? " - " : ""}${etaTo ?? ""}` : "" },
          { name: "Arrived",      value: "DELIVERED", desc: deliverDate ? `on ${fmt(deliverDate)}` : "" },
        ];

  const activeIndex = useMemo(() => {
    if (norm === "CANCELLED") return 1;
    if (norm === "DELIVERED") return 4;
    const idx = STEP_ORDER.indexOf(norm as (typeof STEP_ORDER)[number]);
    return idx < 0 ? 0 : idx;
  }, [norm]);

  return (
    <Box className="mx-auto my-8">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const reached  = index <= activeIndex;

        return (
          <div key={`${step.value}-${index}`} className="flex px-4 py-2">
            {/* Rail + dots — giữ nguyên size/chỉnh nhẹ */}
            <div className="flex flex-col items-center">
              <Box
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  reached ? "bg-gray-200 text-teal-600" : "bg-gray-300 text-gray-600"
                }`}
              >
                {isActive ? <CheckCircleIcon fontSize="small" /> : <FiberManualRecordIcon fontSize="small" />}
              </Box>
              {index < steps.length - 1 && (
                <div
                  className={`w-[2px] ${index < activeIndex ? "bg-teal-500" : "bg-gray-300"}`}
                  style={{ height: 88 }}
                />
              )}
            </div>

            {/* Content */}
            <div className="ml-3 w-full">
              <div
                className={`w-full block rounded-md transition-all
                  ${isActive
                    ? "bg-primary-color text-white shadow px-5 py-3 -translate-y-1.5"
                    : "px-1 py-2"
                  }
                  ${norm === "CANCELLED" && isActive ? "bg-red-500" : ""}`}
              >
                <p className={`leading-6 ${isActive ? "text-white" : "text-gray-800"} text-[15px] font-medium`}>
                  {step.name}
                </p>
                {step.desc ? (
                  <p className={`mt-1 ${isActive ? "text-gray-100" : "text-gray-500"} text-sm`}>
                    {step.desc}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </Box>
  );
};

export default OrderStepper;
