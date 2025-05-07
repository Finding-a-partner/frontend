// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import UserSearchPage from "./pages/UserSearchPage";
import FriendsPage from "./pages/FriendsPage";
import EventsPage from './pages/EventsPage';
import MyProfilePage from './pages/MyProfilePage';
import ProfilePage from './pages/ProfilePage';
import Navbar from "./components/Navbar";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/feed" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/feed"
            element={token ? <FeedPage /> : <Navigate to="/login" />}
          />
          <Route path="/users" element={<UserSearchPage />} />
          {/* <Route path="/userpage" element={<ProfilePage />} /> */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/users/:id" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
