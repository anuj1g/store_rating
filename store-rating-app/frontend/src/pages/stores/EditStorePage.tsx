import { Typography, Container } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function EditStorePage() {
  const { id } = useParams();
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Store
      </Typography>
      <Typography variant="body1">Editing store ID: {id}</Typography>
    </Container>
  );
}
