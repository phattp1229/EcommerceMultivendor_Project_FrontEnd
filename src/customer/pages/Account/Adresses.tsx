import React from 'react'
import { useAppSelector } from '../../../Redux Toolkit/Store'
import AddressCard from '../Checkout/AddressCard'
import UserAddressCard from './UserAddressCard'

const Addresses = () => {
    // const { user } = useAppSelector(store => store)
    return (
        <>
            <div className='space-y-3'>
                {[1,1,1].map((item) =>
                    <UserAddressCard
                        key={"item.id"}
                        />)}
            </div>
        </>
    )
}

export default Addresses