import { Typography, Container } from '@mui/material';

export default function OwnerDashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Owner Dashboard
      </Typography>
      <Typography variant="body1">Owner-specific overview and actions.</Typography>
    </Container>
  );
}
