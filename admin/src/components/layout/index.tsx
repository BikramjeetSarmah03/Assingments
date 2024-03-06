import { Outlet } from "react-router-dom";
import Header from "./header";
import Modals from "../modals";

export default function Layout() {
  return (
    <>
      <Header />
      <Outlet />

      <Modals />
    </>
  );
}
