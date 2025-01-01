import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
//import { useAuthToken } from "@/authentication/authentication_ops";
//import { Dispatch, SetStateAction } from "react";
//import { set } from "lodash";

export const Route = createRootRoute({
  component: function Component() {
   //const [token] = useAuthToken() as [string | null, Dispatch<SetStateAction<string | null>>];
  const token = sessionStorage.getItem('authToken')
    return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
      { /*<Link to="/user_tickets" className="[&.active]:font-bold">
          User Tickets
        </Link>*/}
        <Link to="/managers_login" className="[&.active]:font-bold">
          Managers Login
        </Link>
        <Link to="/employees_login" className="[&.active]:font-bold">
          Employees Login
        </Link>
        {(token !== null) && <Link to="/manager_options" className="[&.active]:font-bold">Manager Options</Link>}
        {(token !== null) && <Link to="/all_users_list" className="[&.active]:font-bold">List of all users</Link>}
        {(token !== null) && <Link to="/pending_tickets" className="[&.active]:font-bold">Pending tickets</Link>}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
    );
  },
})



