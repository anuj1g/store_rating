import { Typography, Container } from '@mui/material';

export default function OwnerReviewsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Store Reviews
      </Typography>
      <Typography variant="body1">See and manage reviews for your stores.</Typography>
    </Container>
  );
}
