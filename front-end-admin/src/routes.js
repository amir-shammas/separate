import Login from "./pages/User/Login/Login";
import AdminPanelLayout from "./pages/AdminPanel/AdminPanelLayout/AdminPanelLayout";
import UserLoginPrivate from "./Components/Privates/UserLoginPrivate";
import AdminPanelPrivate from "./Components/Privates/AdminPanelPrivate";
import AdminPanelIndex from "./pages/AdminPanel/AdminPanelIndex/AdminPanelIndex";
import AdminPanelUsers from "./pages/AdminPanel/AdminPanelUsers/AdminPanelUsers";


const routes = [

  { path: "/", element: <Login /> },

  { path: "/admin-panel/*",
    element: (
      <UserLoginPrivate>
        <AdminPanelPrivate>
          <AdminPanelLayout />
        </AdminPanelPrivate>
      </UserLoginPrivate>
    ),
    children: [
      {path: "", element: <AdminPanelIndex />},
      {path: "users", element: <AdminPanelUsers />},
    ]
   },

];

export default routes;
