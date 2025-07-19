import { styled } from "@mui/material";
import { Box } from "@mui/material";

export const AdminTitleContainer = styled(Box)({
  backgroundColor: "#f0f0f0",
  borderRadius: "10px 10px 0 0",
  padding: "1rem",
});

const Home = () => {
  return <AdminTitleContainer> Hello world</AdminTitleContainer>;
};

export default Home;
