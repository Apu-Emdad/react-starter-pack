// App.tsx
import { Outlet } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { useEffect, useState } from "react";
import api, { injectLoaderSetter } from "./utils/axios";
import { AppContext } from "./context/app-context";

export type TUser = {
  username: string;
  email: string;
  role: "super_admin" | "admin" | "user";
  password: string;
};

function App() {
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    injectLoaderSetter(setLoader);
    const fetchUsers = async () => {
      try {
        const res = await api.get<TUser[]>("/users");
        console.log(res.data);
        // setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <AppContext.Provider value={{ loader, setLoader }}>
      <AppLayout>
        navbar
        <Outlet />
      </AppLayout>
    </AppContext.Provider>
  );
}

export default App;
