import { Grid, Paper, Box, Typography, Container } from "@mui/material";
import InputFileUpload from "./InputFileUpload";
import "./Dashboard.css";
import Layout from "./Layout";

const Dashboard = () => {
  const handleFileChange = (event, label) => {
    console.log(`${label} file uploaded`);
  };

  return (
    <Layout>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom className="section-title">
            Proof of Identification (POI) Documents
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {["Aadhar", "PAN", "BankPassbook", "PassportSize_Photo"].map(
              (label) => (
                <Grid item xs={12} sm={6} md={3} key={label}>
                  <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      className="item-title"
                    >
                      {label}
                    </Typography>
                    <InputFileUpload
                      onChange={(e) => handleFileChange(e, label)}
                      label={label}
                    />
                  </Paper>
                </Grid>
              )
            )}
          </Grid>
        </Box>

        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom className="section-title">
            Educational Certificates
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {[
              "SSC",
              "Intermediate",
              "1-1 Memo",
              "1-2 Memo",
              "2-1 Memo",
              "2-2 Memo",
              "3-1 Memo",
              "3-2 Memo",
              "4-1 Memo",
              "4-2 Memo",
            ].map((label) => (
              <Grid item xs={12} sm={6} md={2.4} key={label}>
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom className="item-title">
                    {label}
                  </Typography>
                  <InputFileUpload
                    onChange={(e) => handleFileChange(e, label)}
                    label={label}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom className="section-title">
            Resume
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom className="item-title">
                  Resume
                </Typography>
                <InputFileUpload
                  onChange={(e) => handleFileChange(e, "Resume")}
                  label="Resume"
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default Dashboard;
