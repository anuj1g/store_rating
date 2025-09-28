import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  AlertTitle,
  Link,
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { ROUTES, API_ENDPOINTS } from '../../config/app';
import { useTheme } from '@mui/material/styles';
import api from '../../services/api';

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      setIsSubmitting(true);
      
      try {
        // Call the API to send password reset email
        await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
          email: values.email,
          resetUrl: `${window.location.origin}${ROUTES.RESET_PASSWORD}`,
        });
        
        // Show success message
        setIsSubmitted(true);
      } catch (err: any) {
        setError(
          err.response?.data?.message || 
          'Failed to send reset email. Please try again later.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (isSubmitted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
          p: 2,
        }}
      >
        <Container component="main" maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}
            >
              <EmailIcon
                sx={{
                  fontSize: 64,
                  color: 'success.main',
                  mb: 2,
                }}
              />
              <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Check Your Email
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                We've sent a password reset link to <strong>{formik.values.email}</strong>.
                Please check your email and click on the link to reset your password.
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                If you don't see the email, please check your spam folder.
              </Typography>
              
              <Button
                component={RouterLink}
                to={ROUTES.LOGIN}
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 2,
                  textTransform: 'none',
                }}
              >
                Back to Login
              </Button>
              
              <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
                Didn't receive the email?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  color="primary"
                  underline="hover"
                  sx={{ fontWeight: 500 }}
                >
                  Resend email
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        p: 2,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <EmailIcon
              sx={{
                fontSize: 48,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Forgot your password?
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={isSubmitting}
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting || !formik.isValid}
              sx={{
                py: 1.5,
                mt: 3,
                mb: 2,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component={RouterLink}
                to={ROUTES.LOGIN}
                color="primary"
                underline="hover"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  '&:hover': {
                    textDecoration: 'none',
                  },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Back to Sign In
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
