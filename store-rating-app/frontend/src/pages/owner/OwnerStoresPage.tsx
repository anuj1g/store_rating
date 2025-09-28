import { Typography, Container } from '@mui/material';

export default function OwnerStoresPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Stores
      </Typography>
      <Typography variant="body1">Manage your stores here.</Typography>
    </Container>
  );
}
