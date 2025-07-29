import { Radio } from "@mui/material";

const AddressCard = () => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      console.log(event.target.checked);
    }
  }
  return (
    <div className='p-5 border rounded-md flex '>
      <div>
        <Radio
          checked={true}
          onChange={handleChange}
          value=""
          name="radio-buttons"/>
      </div>
      <div className="space-y-3 pt-3">
        <h1>Phat</h1>
        <p className='w-[320px]'>123 Main St, Springfield, IL 62701</p>
        <p className='w-[320px]'><strong>Mobile : </strong> 123-456-7890</p>
      </div>
    </div>
  )
}

export default AddressCard