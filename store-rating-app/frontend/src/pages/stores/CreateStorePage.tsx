import { Typography, Container } from '@mui/material';

export default function CreateStorePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Store
      </Typography>
      <Typography variant="body1">Store creation form will go here.</Typography>
    </Container>
  );
}
