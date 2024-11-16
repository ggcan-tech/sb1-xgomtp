import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PlacesSelection from './pages/PlacesSelection';
import StylePreferences from './pages/StylePreferences';
import WardrobeSetup from './pages/WardrobeSetup';
import Home from './pages/Home';
import Wardrobe from './pages/Wardrobe';
import Account from './pages/Account';
import Social from './pages/Social';
import MyPosts from './pages/MyPosts';
import AccountProfile from './pages/AccountProfile';
import AccountPreferences from './pages/AccountPreferences';
import AccountSettings from './pages/AccountSettings';
import AccountActivities from './pages/AccountActivities';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/places-selection" element={<PlacesSelection />} />
        <Route path="/style-preferences" element={<StylePreferences />} />
        <Route path="/wardrobe-setup" element={<WardrobeSetup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/account" element={<Account />} />
        <Route path="/social" element={<Social />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/account/profile" element={<AccountProfile />} />
        <Route path="/account/preferences" element={<AccountPreferences />} />
        <Route path="/account/settings" element={<AccountSettings />} />
        <Route path="/account/activities" element={<AccountActivities />} />
      </Routes>
    </BrowserRouter>
  );
}