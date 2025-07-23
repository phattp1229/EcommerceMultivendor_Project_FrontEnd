import './App.css'
import { ThemeProvider } from '@emotion/react';
import customeTheme from './Theme/customeTheme';
import Navbar from './customer/components/Navbar/Navbar'
import Home from './customer/pages/Home/Home';



function App() {
  return (
      <div className="">
        <ThemeProvider theme={customeTheme}>
          <div>
            <Navbar/>
            <Home/>
          </div>
        </ThemeProvider>

    </div>
  )
}export default App;
