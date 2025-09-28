import { Typography, Container } from '@mui/material';

export default function AdminUsersPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Typography variant="body1">User management interface will be here.</Typography>
    </Container>
  );
}
