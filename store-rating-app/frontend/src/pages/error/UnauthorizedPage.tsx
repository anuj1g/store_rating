import { Typography, Container, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You don't have permission to access this page.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Go Home
      </Button>
    </Container>
  );
}
