import {Avatar,Badge,Box,Button,Drawer,IconButton,useMediaQuery,useTheme,} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Navbar.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Category, FavoriteBorder } from "@mui/icons-material";
import { mainCategory } from "../../../data/category/mainCategory";
import CategorySheet from "./CategorySheet";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
        const [showSheet, setShowSheet] = useState(false);
        const [selectedCategory, setSelectedCategory] = useState("men");
        const theme = useTheme();
        const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
        const user = true; // Giả định có đăng nhập
        const navigate = useNavigate();
        return (
            <div>
                <Box className='sticky top-0 left-0 right-0 z-50 bg-white' sx={{zIndex: 2}}>
                    <div className="flex items-center justify-between px-5 lg:px-20 h-[70px] border-b">
                        <div className="flex items-center gap-9">
                            <div className="flex items-center gap-2">
                            {!isLarge &&   <IconButton>
                                    <MenuIcon/>
                                </IconButton>}
                                <h1 onClick={()=> navigate}className="logo cursor-pointer text-lg md:text-2xl  text-[#00927c]">
                                    Zonix Mall
                                </h1>
                            </div>
                             <ul className="flex items-center font-medium text-gray-800">
                            {mainCategory.map((item) => 
                            <li onMouseLeave={() => {
                                setShowSheet(false);
                            }}
                            onMouseEnter={() => {
                                setShowSheet(true);
                                setSelectedCategory(item.categoryId); 
                            }}
                            className="mainCategory hover:text-[#00927C]
                            hover:border-b-2 h-[70px] px-4 border-primary-color flex items-center ">
                                {item.name}
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
                            <IconButton  onClick={() => navigate("/cart")}>
                                <Badge badgeContent={4} color="primary">
                                    <AddShoppingCartIcon className="text-gray-700" sx={{ fontSize: 29 }}/>
                                </Badge>
                            </IconButton>
                            {isLarge && <Button startIcon={<StorefrontIcon />} variant='outlined'>
                                Become Seller
                            </Button>}
                        </div>
                    </div>
                    {showSheet && <div 
                    onMouseLeave={() => setShowSheet(false)}
                    onMouseEnter={() => setShowSheet(true)}              
                    className='categorySheet absolute top-[4.41rem] left-20 right-20 border '>
                        <CategorySheet selectedCategory={selectedCategory}/>
                    </div>}
                </Box>
            </div>
        )
    }
    export default Navbar;