// import * as React from "react";
// import DrawerList from "../../../admin seller/components/drawerList/DrawerList";
import { AccountBox } from "@mui/icons-material";
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DrawerList from "../../../admin seller/components/drawerList/DrawerList";
import CampaignIcon from "@mui/icons-material/Campaign";
import HowToRegIcon from "@mui/icons-material/HowToReg";

const menu = [
  {
    name: "Dashboard",
    path: "/seller",
    icon: <DashboardIcon className="text-primary-color" />,
    activeIcon: <DashboardIcon className="text-white" />,
  },
  {
    name: "Orders",
    path: "/seller/orders",
    icon: <ShoppingBagIcon className="text-primary-color" />,
    activeIcon: <ShoppingBagIcon className="text-white" />,
  },
  {
    name: "Products",
    path: "/seller/products",
    icon: <InventoryIcon className="text-primary-color" />,
    activeIcon: <InventoryIcon className="text-white" />,
  },
  {
    name: "Add Product",
    path: "/seller/add-product",
    icon: <AddIcon className="text-primary-color" />,
    activeIcon: <AddIcon className="text-white" />,
  },
  {
    name: "Payment",
    path: "/seller/payment",
    icon: <AccountBalanceWalletIcon className="text-primary-color" />,
    activeIcon: <AccountBalanceWalletIcon className="text-white" />,
  },
  {
    name: "Transaction",
    path: "/seller/transaction",
    icon: <ReceiptIcon className="text-primary-color" />,
    activeIcon: <ReceiptIcon className="text-white" />,
  },
  // 👇 Affiliate
{ name: "Campaigns", 
  path: "/seller/campaigns",
  icon: <CampaignIcon className="text-primary-color" />, 
  activeIcon: <CampaignIcon className="text-white" /> 
},

{ name: "New Campaign", 
  path: "/seller/campaigns/new", 
  icon: <AddIcon className="text-primary-color" />, 
  activeIcon: <AddIcon className="text-white" /> 
},

{ name: "KOC Approvals", 
  path: "/seller/campaigns/approvals", 
  icon: <HowToRegIcon className="text-primary-color" />, 
  activeIcon: <HowToRegIcon className="text-white" /> 
},
];

const menu2 = [
  
  {
    name: "Account",
    path: "/seller/account",
    icon: <AccountBox className="text-primary-color" />,
    activeIcon: <AccountBox className="text-white" />,
  },
  {
    name: "Logout",
    path: "/",
    icon: <LogoutIcon className="text-primary-color" />,
    activeIcon: <LogoutIcon className="text-white" />,
  },
];

interface DrawerListProps {
  toggleDrawer?: any;
}

const SellerDrawerList = ({toggleDrawer} : {toggleDrawer:any}) => {
  return(

        <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer}/> 

  )
};

export default SellerDrawerList;
