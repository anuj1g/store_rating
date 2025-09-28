import { Typography, Container } from '@mui/material';

export default function AdminDashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1">Overview of administrative stats.</Typography>
    </Container>
  );
}
