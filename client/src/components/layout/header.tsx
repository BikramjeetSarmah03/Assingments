import { useState } from "react";
import { toast } from "react-hot-toast";

import LoadingButton from "../ui/loading-button";
import { api } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button, buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";

export default function Header() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/logout");

      if (res.data.success) {
        toast.success("Logout Successfull");
        navigate("/auth/sign-in");
      } else {
        throw Error("Error while logging out");
      }
    } catch (error) {
      toast.error("Error while logging out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b shadow">
      <h1>PMS</h1>

      <div className="flex items-center gap-4">
        <Link to={"/"} className={buttonVariants({ variant: "outline" })}>
          Home
        </Link>

        <Link to={"/proposal"} className={buttonVariants()}>
          Add Proposal
        </Link>
      </div>

      {isAuth && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <h1>{user.name}</h1>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem>
              <LoadingButton
                variant={"outline"}
                className="w-full gap-4"
                loading={loading}
                onClick={handleLogout}>
                <LogOutIcon />
                <span>Log out</span>{" "}
              </LoadingButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to={"/auth/sign-in"} className={buttonVariants()}>
          Sign In
        </Link>
      )}
    </header>
  );
}
