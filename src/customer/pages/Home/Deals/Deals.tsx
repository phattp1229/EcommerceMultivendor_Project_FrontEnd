import DealCard from "./DealCard"
import Slider from "react-slick"

const Deals = () => {
  return (
    <div className="py5 lg:px-20">
      <div className = 'flex items-center justify-between '>
        {[1,1,1,1,1,1].map((item) => <DealCard />)}
        </div>
    </div>
  )
}

export default Deals