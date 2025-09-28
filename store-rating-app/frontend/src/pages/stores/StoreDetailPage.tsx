import { Typography, Container } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function StoreDetailPage() {
  const { id } = useParams();
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Store Detail
      </Typography>
      <Typography variant="body1">Details for store ID: {id}</Typography>
    </Container>
  );
}
