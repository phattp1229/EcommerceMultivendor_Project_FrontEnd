import React, { useState, useEffect } from "react";
import "./ProductCard.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { teal } from "@mui/material/colors";
import { Box, Button, IconButton, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../../types/productTypes";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../../Redux Toolkit/Store";
// import { addProductToWishlist } from "../../../../Redux Toolkit/Customer/WishlistSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import { isWishlisted } from "../../../../util/isWishlisted";
import ModeCommentIcon from '@mui/icons-material/ModeComment';


interface ProductCardProps {
    // images: string[];
    // categoryId: string | undefined;
    item: Product;
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "auto",
    borderRadius: ".5rem",
    boxShadow: 24,

};

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    // const { wishlist } = useAppSelector((store) => store);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const wishlist = true;

    const handleAddWishlist = (event: MouseEvent) => {
        event.stopPropagation();
        setIsFavorite((prev) => !prev);
        // if (item.id) dispatch(addProductToWishlist({ productId: item.id }));
    };

    useEffect(() => {
        let interval: any;
        if (isHovered) {
            interval = setInterval(() => {
                setCurrentImage((prevImage) => (prevImage + 1) % item.images.length);
            }, 1000); // Change image every 1 second
        } else if (interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isHovered, item.images.length]);


    return (
        <>
            <div onClick={() => navigate(`/product-details/${item.category?.categoryId}/${item.title}/${item.id}`)}
                className=" group px-8 relative overflow-hidden rounded-2xl shadow-lg cursor-pointer ">
                <div
                    className="card"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {item.images.map((image: any, index: number) => (
                        <img
                            key={index}
                            className="card-media object-w-full h-full object-contain object-center  border-4 border-white hover:border-pink-400 
                            transition duration-300top absolute inset-0 transition-all duration-500 ease-in-out"
                            src={image}
                            alt={`product-${index}`}
                            style={{
                                transform: `translateX(${(index - currentImage) * 100}%)`,
                            }}
                        />
                    ))}
                    {isHovered && (
                        <div className="indicator absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/60 px-3 py-2 rounded-xl
                         shadow backdrop-blur-md">
                            <div className="flex gap-4">
                                {item.images.map((item: any, index: number) => (
                                    <button
                                        key={index}
                                        className={`indicator-button ${index === currentImage ? "active" : ""
                                            }`}
                                        onClick={() => setCurrentImage(index)}
                                    />
                                ))}
                            </div>



                        </div>
                    )}
                </div>
                <div className="details bg-white rounded-b-2xl px-3 pt-3 pb-4 space-y-1 text-sm">
                {/* Tên shop */}
                <div className="text-gray-600 font-semibold truncate">
                    {item.seller?.businessDetails.businessName}
                </div>

                {/* Tên sản phẩm */}
                <div className="text-gray-900 font-semibold text-[16px] leading-snug line-clamp-2 min-h-[42px]">
                    {item.title}
                </div>

                {/* Giá sản phẩm */}
                <div className="flex items-center gap-2 pt-1">
                    <span className="text-lg font-bold text-pink-600">
                    {item.sellingPrice.toLocaleString("vi-VN")} đ
                    </span>
                    <span className="line-through text-gray-400 text-sm">
                    {item.mrpPrice.toLocaleString("vi-VN")} đ
                    </span>
                    <span className="text-green-600 text-l font-semibold">
                    -{item.discountPercent}%
                    </span>
                </div>
                </div>
            </div>
        </>
    );
};

export default ProductCard;
