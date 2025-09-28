import { Typography, Container } from '@mui/material';

export default function ProfilePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">Manage your profile details here.</Typography>
    </Container>
  );
}
