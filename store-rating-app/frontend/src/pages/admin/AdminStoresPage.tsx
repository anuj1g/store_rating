import { Typography, Container } from '@mui/material';

export default function AdminStoresPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Stores
      </Typography>
      <Typography variant="body1">Admin store management tools.</Typography>
    </Container>
  );
}
