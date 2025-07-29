import SellerDrawerList from "../../components/SideBar/SellerDrawerList"

const SellerDashboard = () => {
  const toggleDrawer =()=>{}
  return (
    <div>
      <div className="lg:flex lg:h-[90vh]">

        <section className="hidden lg:block ">
          <SellerDrawerList toggleDrawer={toggleDrawer}/>
        </section>

        <section className="p-10 w-full lg:w-[80%]  overflow-y-auto">
          seller routes
        </section>
      </div>
    </div>
  )
}

export default SellerDashboard