import { Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"
import { teal } from "@mui/material/colors"
import { colors } from "../../../data/Filter/color"
import { price } from "../../../data/Filter/price";
import { discount } from "../../../data/Filter/discount";
import { useSearchParams } from "react-router-dom";
import React, { useState } from "react";


const FilterSection = () => {
  const [expendColor, setExpendColor] = useState(false);
  const [expendBrand, setExpendBrand] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const handleExpendBrand = () => {
    setExpendBrand(!expendBrand);
  };
  const handleExpendColor = () => {
    setExpendColor(!expendColor);
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFilterParams = (e: any) => {
    const { value, name } = e.target;
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    console.log("clearAllFilters",searchParams)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchParams.forEach((value: any, key: any) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams);
  };
  return (
    <div className="-z-50 space-y-5 bg-white">
      <div className="flex items-center justify-between h-[40px] px-9 lg:border-r">
        <p className="text-lg font-semibold">Filters</p>
        <Button size="small"className="text-teal-600 cursor-pointer font-semibold">clear all
        </Button>
      </div>
       <Divider/>
      <section>
        <FormControl>
        <FormLabel 
        sx={{fontSize: "16px",
            fontWeight: "bold",
            pb: "14px",
            color: teal[600],}}
        className="text-2xl font-semibold" id="color">Color</FormLabel>
        <RadioGroup
            aria-labelledby="color"
            defaultValue=""
            name="color"
        >
          {colors
                .slice(0, expendColor ? colors.length : 5)
                .map((item, index) => (
                  <FormControlLabel
                    sx={{ fontSize: "12px" }}
                    key={item.name}
                    value={item.name}
                    control={<Radio size="small" />}
                    label={
                      <div className="flex items-center gap-3">
                        <p>{item.name}</p>
                        <span
                          style={{ backgroundColor: item.hex }}
                          className={` h-5 w-5 rounded-full ${
                            item.name === "White" ? "border" : "border"
                          }`}
                        ></span>
                      </div>
                    }
                  />
                ))}
        </RadioGroup>
      </FormControl>
      </section>
    </div>

  )
}

export default FilterSection