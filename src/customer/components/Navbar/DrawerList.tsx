import { ListItemIcon, ListItemText } from "@mui/material"
import { useLocation } from "react-router-dom"

interface menuItem{
  name: string,
  path: string,
  icon: any,
  activeIcon: any,
}
interface DrawerListProps{
  menu:menuItem[],
  menu2:menuItem[],
  toggleDrawer:()=>void
}

//@ts-ignore
const DrawerList = ({menu,menu2,toggleDrawer} : DrawerListProps) => {
  const location=useLocation();
  return (
    <div className='h-full'>
      <div className='flex flex-col justify-between h-full w-[300px] border-r py-5'>

        <div>
          <div className='space-y-2'>
            {
              menu.map((item,index:number)=>
                <div className='pr-9 cursor-pointer' key={index}>
                  <p className={`${item.path==location.pathname?"bg-primary-color text-white" : 
                    "text-primary-color"} flex items-center px-5 py-3 rounded-r-full`}>
                    <ListItemIcon>
                      {item.path==location.pathname?item.activeIcon:item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name}/>
                  </p>
                </div>
              )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default DrawerList