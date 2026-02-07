import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import { HoverProvider } from "../context/HoverContext"

const Layout = ({ children }) => {
  return (
    <HoverProvider>
      <div className="bg-white w-full">
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          {children}
          <main className="bg-white mt-32">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </HoverProvider>
  )
}

export default Layout;
