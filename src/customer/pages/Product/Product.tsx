import ProductCard from "./ProductCard/ProductCard";
import FilterSection from "./FilterSection";
import React, { useEffect, useState } from "react";
import {Box,Divider,FormControl,IconButton,InputLabel,MenuItem,Pagination,Select,useMediaQuery,useTheme,type SelectChangeEvent,} 
from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";

const Product = () => {
  const [sort, setSort] = React.useState("");
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showFilter, setShowFilter] = useState(false);
  const { categoryId } = useParams();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [page,setPage]=useState(1)
  

  const handleSortProduct = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };

  const handleShowFilter = () => {
    setShowFilter((prev) => !prev);
    console.log("showFilter   ", showFilter);
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageChange = (value: any) => {
    setPage(value)
    console.log("page nummmberr ", value);
  };
//   useEffect(() => {
//     const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
//     const newFilters = {
//       brand: searchParams.get("brand") || "",
//       color: searchParams.get("color") || "",
//       minPrice: minPrice ? Number(minPrice) : undefined,
//       maxPrice: maxPrice ? Number(maxPrice) : undefined,
//       pageNumber:page-1,
//       minDiscount: searchParams.get("discount")
//         ? Number(searchParams.get("discount"))
//         : undefined,
//     };

//     dispatch(getAllProducts({ category: categoryId, sort, ...newFilters }));
//   }, [searchParams, categoryId, sort,page]);

  return (
    <div className="-z-10 mt-10">
      <div>  
        <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase space-x-2">
         women sarees </h1>
      </div>

      <div className='lg:flex'>
            <section className="filter_section hidden lg:block w-[20%]">
                <FilterSection />
            </section>
            <div className="w-full lg:w-[80%] space-y-5">
          <div className="flex justify-between items-center px-9 h-[40px]">
            <div className="relative w-[50%]">
              {!isLarge && (
                <IconButton onClick={handleShowFilter}>
                  <FilterAltIcon />
                </IconButton>
              )}
              {showFilter && !isLarge && (
                <Box sx={{ zIndex: 3 }} className="absolute top-[60px]">
                  <FilterSection />
                </Box>
              )}
            </div>
            <FormControl size="small" sx={{ width: "200px" }}>
              <InputLabel id="sort">Sort</InputLabel>
              <Select
                labelId="sort"
                id="sort"
                value={sort}
                label="Sort"
                onChange={handleSortProduct}
              >
                <MenuItem value={"price_low"}>Price : Low - High</MenuItem>
                <MenuItem value={"price_high"}>Price : High - Low</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Divider />
          <section className="grid sm:grid-cols-2   md:grid-cols-3 lg:grid-cols-4 gap-y-5 px-5 justify-center">
                {[1, 1, 1, 1, 1, 1, 1, 1].map((item) => <ProductCard />)}
            </section>
            <div className="flex justify-center pt-10">
            <Pagination page={page} onChange={(e, value) => handlePageChange(value)}
                variant="outlined"
                color="primary"
                count={10}
                shape="rounded"/>
            </div>
        </div>
      </div>
      </div>
  )
}

export default Product