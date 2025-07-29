
import SimilarProductCard from './SimilarProductCard'
import { useAppSelector } from '../../../../Redux Toolkit/Store'

const SmilarProduct = () => {
  // const { products } = useAppSelector((store) => store);
  return (
    <div>
        <div className='grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 justify-between gap-4 gap-y-8'>
        {[1,1,1,1,1,1,1].map((item) =><SimilarProductCard/>)}
        </div>
    </div>
  )
}

export default SmilarProduct