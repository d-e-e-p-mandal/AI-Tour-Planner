import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/Popover.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog.jsx";

import { googleLogout, useGoogleLogin } from "@react-oauth/google";

const Header = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const getUserProfile = async (tokenInfo) => {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
      {
        headers: { Authorization: `Bearer ${tokenInfo.access_token}` },
      }
    );

    localStorage.setItem("user", JSON.stringify(res.data));
    setOpenDialog(false);
    navigate("/"); // ✅ NO basename
  };

  const login = useGoogleLogin({
    onSuccess: getUserProfile,
  });

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    navigate("/"); // ✅ NO basename
  };

  return (
    <header className="h-20 flex justify-between items-center px-8 shadow-md bg-white">
      {/* Logo */}
      <Link to="/" className="flex items-center h-full">
        <img
          src="logo.png"
          alt="AI Trip Planner"
          className="h-20 w-auto object-contain"
        />
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <Link to="/create-trip">
            <Button variant="outline">Create Trip</Button>
          </Link>

          <Link to="/my-trip">
            <Button variant="outline">My Trips</Button>
          </Link>

          <Popover>
            <PopoverTrigger>
              <img
                src={user.picture}
                className="h-10 w-10 rounded-full cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent>
              <Button onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Button onClick={() => setOpenDialog(true)}>Sign in</Button>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              <Button onClick={login} className="w-full mt-4">
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;