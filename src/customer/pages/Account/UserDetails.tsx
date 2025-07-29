import { Divider } from "@mui/material";
import ProfileFildCard from "../../../seller/pages/Account/ProfileFildCard";

const UserDetails = () => {
  return (
    <div className="flex justify-center py-10">
      <div className="w-full lg:w-[70%]  ">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600 ">
            Persional Details
          </h1>
        </div>
              <div className="space-y-5">
          {/* <Avatar
            sx={{ width: "10rem", height: "10rem" }}
            src="https://cdn.pixabay.com/photo/2014/11/29/19/33/bald-eagle-550804_640.jpg"
          /> */}
          <div>
            <ProfileFildCard keys={"Name"} value={"Phat"} />
            <Divider />
            <ProfileFildCard keys={"Email"} value={"a@gmail.com"} />
            <Divider />
            <ProfileFildCard keys={"Mobile"} value={"0379205270"} />
          </div>
        </div>    
       </div>
    </div>
  )
}

export default UserDetails