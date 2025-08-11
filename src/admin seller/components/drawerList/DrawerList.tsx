// admin seller/components/drawerList/DrawerList.tsx
import * as React from "react";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { performLogout } from "../../../Redux Toolkit/Customer/AuthSlice";

export interface Menu {
  name: string;
  path: string;
  icon: React.ReactElement<any>;
  activeIcon: React.ReactElement<any>;
}

// Chấp nhận cả 2 pattern:
// 1) (open:boolean) => void
// 2) (open:boolean) => (event?: any) => void   (curried theo MUI)
type ToggleDrawerFn =
  | ((open: boolean) => void)
  | ((open: boolean) => (e?: unknown) => void);

interface DrawerListProps {
  toggleDrawer?: ToggleDrawerFn;
  menu: Menu[];
  menu2: Menu[];
}

const DrawerList: React.FC<DrawerListProps> = ({ toggleDrawer, menu, menu2 }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const closeDrawer = React.useCallback(() => {
    if (!toggleDrawer) return;
    const res = (toggleDrawer as any)(false);
    if (typeof res === "function") res(); // hỗ trợ dạng curried
  }, [toggleDrawer]);

  const handleLogout = () => {
    dispatch(performLogout());
    navigate("/"); // dùng chung cho admin & seller
    closeDrawer();
  };

  const handleClick = (item: Menu) => () => {
    if (item.name === "Logout") {
      handleLogout();
      return;
    }
    navigate(item.path);
    closeDrawer();
  };

  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-[300px] border-r py-5">
        <div>
          <div className="space-y-2">
            {menu.map((item) => (
              <div key={item.name} onClick={handleClick(item)} className="pr-9 cursor-pointer">
                <p
                  className={`${
                    item.path === location.pathname
                      ? "bg-primary-color text-white "
                      : "text-primary-color"
                  } flex items-center px-5 py-3 rounded-r-full`}
                >
                  <ListItemIcon>
                    {location.pathname === item.path ? item.activeIcon : item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Divider />
          <div className="space-y-2">
            {menu2.map((item) => (
              <div key={item.name} onClick={handleClick(item)} className="pr-9 cursor-pointer">
                <p
                  className={`${
                    item.path === location.pathname
                      ? "bg-primary-color text-white "
                      : "text-primary-color"
                  } flex items-center px-5 py-3 rounded-r-full`}
                >
                  <ListItemIcon>
                    {location.pathname === item.path ? item.activeIcon : item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerList;
