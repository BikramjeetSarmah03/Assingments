import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";

import { Home, Page404, SignIn } from "@/pages";
import Layout from "@/components/layout";
import Protected from "@/components/protected";

export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Protected />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Route>

      <Route path="auth">
        <Route path="sign-in" element={<SignIn />} />
      </Route>

      <Route path="*" element={<Navigate to={"/404"} replace />} />
      <Route path="/404" element={<Page404 />} />
    </RouterRoutes>
  );
}
