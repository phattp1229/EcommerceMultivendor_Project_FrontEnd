    import {Avatar,Badge,Box,Button,Drawer,IconButton,useMediaQuery,useTheme,} from "@mui/material";
    import React, { useEffect, useState } from "react";
    import "./Navbar.css";
    import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
    import StorefrontIcon from "@mui/icons-material/Storefront";
    import SearchIcon from "@mui/icons-material/Search";
    import MenuIcon from "@mui/icons-material/Menu";
    import AccountCircleIcon from "@mui/icons-material/AccountCircle";
    import { FavoriteBorder } from "@mui/icons-material";

    const Navbar = () => {
        const theme = useTheme();
        const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
        const user = true; // Giả định có đăng nhập
        return (
            <div>
                <Box>
                    <div className="flex items-center justify-between px-5 lg:px-20 h-[70px] border-b">
                        <div className="flex items-center gap-9">
                            <div className="flex items-center gap-2">
                            {!isLarge &&   <IconButton>
                                    <MenuIcon/>
                                </IconButton>}
                                <h1 className="logo cursor-pointer text-lg md:text-2xl  text-[#00927c]">
                                    Zonix Mall
                                </h1>
                            </div>
                             <ul className="flex items-center font-medium text-gray-800">
                            {["Men","Women","Home & Furniture","Electronics"].map((item) => 
                            <li className="mainCategory hover:text-[#00927C]
                            hover:border-b-2 h-[70px] px-4 border-primary-color flex items-center ">
                                {item}
                            </li> )}
                        </ul>
                        </div>
                        <div className="flex gap-1 lg:gap-6 items-center">   
                            <IconButton>
                                <SearchIcon className="text-gray-700" sx={{ fontSize: 29 }}/>
                            </IconButton>
                            {user ? (
                                <Button className="flex items-center gap-2">
                                <Avatar
                                    sx={{ width: 29, height: 29 }}
                                    src="https://cdn.pixabay.com/photo/2015/04/15/09/28/head-723540_640.jpg"
                                />
                                <h1 className="font-semibold hidden lg:block">Phat</h1>
                                </Button>
                            ) : (
                                <Button variant="contained">Login</Button>
                            )}

                            <IconButton>
                                <FavoriteBorder sx={{ fontSize: 29 }}className="text-gray-700" />
                            </IconButton>
                            <IconButton>
                                <Badge badgeContent={4} color="primary">
                                    <AddShoppingCartIcon className="text-gray-700" sx={{ fontSize: 29 }}/>
                                </Badge>
                            </IconButton>
                            {isLarge && <Button startIcon={<StorefrontIcon />} variant='outlined'>
                                Become Seller
                            </Button>}
                        </div>
                    </div>
                </Box>
            </div>
        )
    }
    export default Navbar;