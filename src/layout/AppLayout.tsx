import { Box } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../context/app-context";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { loader } = useContext(AppContext);
  return <Box>{loader ? "Loading..." : children}</Box>;
};

export default AppLayout;
