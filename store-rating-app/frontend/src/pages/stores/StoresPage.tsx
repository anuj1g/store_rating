import { Typography, Container } from '@mui/material';

export default function StoresPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stores
      </Typography>
      <Typography variant="body1">List of stores will appear here.</Typography>
    </Container>
  );
}
