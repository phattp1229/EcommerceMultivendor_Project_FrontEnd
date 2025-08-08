
import type { Address } from '../../../types/customerTypes'

const CustomerAddressCard = ({item}:{item: Address}) => {
  return (
    <div className='p-5 border rounded-md '>
   

   <div className="space-y-2 pt-3">
      <h1 className="font-semibold text-lg">{item.name}</h1>

      <p className="w-[320px] leading-relaxed">
        {item.street}, {item.locality}, {item.state} , {item.city} 
      </p>
      <p>
        <strong>Postal Code:</strong> {item.postalCode}
        </p>
     <p>
      <strong>TypeAddress:</strong>{" "}
      {(item.ownerType ?? "")
        .charAt(0).toUpperCase() + (item.ownerType ?? "").slice(1).toLowerCase()}
    </p>
      <p>
        <strong>Mobile:</strong> {item.mobile}
      </p>
    </div>

</div>
  )
}

export default CustomerAddressCard