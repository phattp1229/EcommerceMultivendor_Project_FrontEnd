import { useEffect, useState } from "react";
import "./ProductCard.css"
import FavoriteIcon from "@mui/icons-material/Favorite";
import { teal } from "@mui/material/colors";
import { Box, Button, IconButton, Modal } from "@mui/material";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
const images = [
    "https://media.routine.vn/1200x1500/prod/product/10s25tss050-beige-blue-3-jpg-hmbb.webp",
    "https://media.routine.vn/1200x1500/prod/variant/10s25tssw020-white-2-jpg-ds2c.webp",
    "https://media.routine.vn/1200x1500/prod/product/10s25tssw012-red-2-jpg-ddgr.webp",
    "https://media.routine.vn/1200x1500/prod/product/10s25shlw004-pink-4-jpg-9rv7.webp"
]
    const ProductCard = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let interval: any;
        if (isHovered) {
            interval = setInterval(() => {
                setCurrentImage((prevImage) => (prevImage + 1) % images.length);
            }, 1000); // Change image every 1 second
        } else if (interval) {
            clearInterval(interval);
            interval = null;
        }
        return () => clearInterval(interval);
    }, [isHovered])

    return (
    <>
        <div className='group px-4 relative'>
            <div className='card'>
                {images.map((item,index) => <img className="card-media oject-top" src={item} alt="" 
                style={{transform: `translateX(${(index - currentImage) * 100}% `}}/>)}

                {<div>
                <div className="flex gap-3">

                    <Button variant="contained" color="secondary" >      
                        <FavoriteIcon sx={{ color: teal[500] }} />
                    </Button>                   
                    <Button variant="contained" color="secondary" >
                        <ModeCommentIcon />
                    </Button>
                    </div>    
                </div>}
            </div>

            <div className='details pt-3 space-y-1 group-hover-effect rounded-md'> 
                <div className='name'>
                    <h1>Niky</h1>
                    <p>Blue Skirt</p>
                </div>
                <div className='price flex items-center gap-3'>
                    <span className='font-sans text-gray-800'>rs 400</span>
                    <span className='thin-line-trhough text-gray-400'>res 999</span>
                    <span className="text-primary-color font-semibold">60%</span>
                </div>
            </div>
        </div>
    </>
  )
}

export default ProductCard