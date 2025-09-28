import { Typography, Container } from '@mui/material';

export default function DashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">Welcome to your dashboard.</Typography>
    </Container>
  );
}
