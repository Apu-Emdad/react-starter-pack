import { Box } from "@mui/material";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return <Box>{children}</Box>;
};

export default AppLayout;
