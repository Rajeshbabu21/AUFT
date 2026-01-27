import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import LandingPage from "./pages/LandingPage/LandingPage"
import Stats from "./pages/Stats/Stats"
import PointTables from "./pages/Tables/PointTables";
import Login from "./admin/Auth/Login.tsx";
import MatchResults from "./components/MatchResults/MatchResults"
import AdminLayout from "./admin/AdminLayout.tsx";
import Dashboard from "./admin/Dashboard.tsx";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}

          <Route index path='/' element={<LandingPage />} />
          <Route element={<AppLayout />}>
            <Route index path='/dashboard' element={<Home />} />

            {/* Others Page */}
            <Route path='/profile' element={<UserProfiles />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/blank' element={<Blank />} />
            <Route path='/stats' element={<Stats />} />
            <Route path='/results' element={<MatchResults />} />

            {/* Forms */}
            <Route path='/form-elements' element={<FormElements />} />

            {/* Tables */}
            <Route path='/points-tables' element={<BasicTables />} />
            <Route path='/match-tables' element={<PointTables />} />

            {/* Ui Elements */}
            <Route path='/teams' element={<Alerts />} />
            <Route path='/players' element={<Avatars />} />
            <Route path='/badge' element={<Badges />} />
            <Route path='/buttons' element={<Buttons />} />
            <Route path='/images' element={<Images />} />
            <Route path='/videos' element={<Videos />} />

            {/* Charts */}
            <Route path='/line-chart' element={<LineChart />} />
            <Route path='/bar-chart' element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />

          {/* Fallback Route */}
          <Route path='*' element={<NotFound />} />

          {/* admin routes  */}
           <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
          
        </Routes>
      </Router>
    </>
  )
}
