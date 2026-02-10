import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import ProjectPage from "./pages/ProjectPage"
import ProgramPage from "./pages/ProgramPage"
import HistoryPage from "./pages/HistoryPage"
import AIEducationTabs from "./pages/AIEducationTabs"



// dashboard manages import
import Home from "./dashboard/pages/Dashboard/Home";
import SignIn from "./AuthPages/SignIn";
import SignUp from "./AuthPages/SignUp";
import NotFound from "./dashboard/pages/OtherPage/NotFound";
import UserProfiles from "./dashboard/pages/UserProfiles";
import Calendar from "./dashboard/pages/Calendar";
import BasicTables from "./dashboard/pages/Tables/BasicTables";
import FormElements from "./dashboard/pages/Forms/FormElements";
import AppLayout from "./dashboard/layout/AppLayout";
import { ScrollToTop } from "./dashboard/components/common/ScrollToTop";


import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./context/ProtectedRoute"
import EditPost from "./dashboard/components/form/form-elements/EditPost"
import Onboard from "./pages/Onboard"
import { Toaster } from 'react-hot-toast';
import Professors from "./pages/Professors"
function App() {
  return (

    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <ScrollToTop />
        <Routes>
          {/* <Route path="/" element={<Onboard />} />
          <Route path="iater" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="project" element={<ProjectPage />} />
            <Route path="program" element={<ProgramPage />} />
            <Route path="professors" element={<Professors />} />

            <Route path="history" element={<HistoryPage />} />
            <Route path="aieducation" element={<AIEducationTabs />} />

          </Route> */}

          <Route index element={<Onboard />} />

          <Route path="/" element={<Layout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="project" element={<ProjectPage />} />
            <Route path="program" element={<ProgramPage />} />
            <Route path="professors" element={<Professors />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="aieducation" element={<AIEducationTabs />} />
          </Route>

          {/* Dashboard */}

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index path="/admin" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/editpost/:id" element={<EditPost />} />

            {/* Auth Layout */}
            {/* <Route path="**" element={<NotFound />} /> */}

            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>


  )
}

export default App
