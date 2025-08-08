import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import React from 'react'
import type { Address } from '../../../types/customerTypes';

interface AddressCardProps {
    value: number;
    selectedValue: number;
    handleChange: (e: any) => void;
    item: Address
}
const AddressCard: React.FC<AddressCardProps> = ({ value, selectedValue, handleChange, item }) => {


    return (
        <div className='p-5 border rounded-md flex '>
            <div>
                <Radio
                    checked={value == selectedValue}
                    onChange={handleChange}
                    value={value}
                    name="radio-buttons"
                    inputProps={{ 'aria-label': 'B' }}
                />
            </div>

           <div className="space-y-2 pt-3">
                <h1 className="font-semibold text-lg">{item.name}</h1>

                <p className="w-[320px] leading-relaxed">
                    {item.street}, {item.locality}, {item.state}, {item.city}  - {item.postalCode}
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

export default AddressCard