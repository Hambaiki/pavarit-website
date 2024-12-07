import { ReactNode, useState } from "react";

import { useAuthCheck } from "src/hooks/useAuthCheck";
import { jwtDecode } from "jwt-decode";

import AppointmentThonburiSidebar from "../../AppointmentThonburiSidebar";

type AppointmentThonburiLayoutProps = {
  children: ReactNode;
};

const AppointmentThonburiLayout = ({
  children,
}: AppointmentThonburiLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useAuthCheck({
    validateAuth: () => {
      const staffLevel = localStorage.getItem("staff_level");
      const staffId = localStorage.getItem("staff_id");

      const session = JSON.parse(
        localStorage.getItem("pilot_staff_session") || "{}"
      );
      const accessToken = session?.access_token;

      const decoded = jwtDecode(accessToken);
      const tokenExpiration = decoded.exp;

      const isTokenValid = tokenExpiration
        ? tokenExpiration > new Date().getTime() / 1000
        : false;

      return Boolean(staffLevel && staffId && accessToken && isTokenValid);
    },
    redirectTo: "/appointment-thonburi/auth/login",
  });

  return (
    <div className={`duration-300 print:visible bg-grey_background`}>
      <AppointmentThonburiSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div
        className={`${
          sidebarOpen ? "ml-72" : "ml-14"
        }  transition-all duration-300 ease-in-out`}
      >
        {children}
      </div>
    </div>
  );
};

export default AppointmentThonburiLayout;
