import { useAppSelector } from '../../../Redux Toolkit/Store'
import CustomerAddressCard from './CustomerAddressCard'

const Addresses = () => {
    const { customer } = useAppSelector(store => store)
    return (
        <>
            <div className='space-y-3'>
                {customer.customer?.addresses?.map((item, index) =>
                    <CustomerAddressCard
                        key={item.id}
                        item={item} />)}
            </div>
        </>
    )
}

export default Addresses