import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { ROUTES } from '@/config/app';
import { useTheme } from '@mui/material/styles';
import api from '@/services/api';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Check if token is valid on component mount
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!token) {
        setIsValidToken(false);
        setIsLoading(false);
        return;
      }

      try {
        // Call API to validate the reset token
        await api.get(`/auth/validate-reset-token/${token}`);
        setIsValidToken(true);
      } catch (err: any) {
        setError(
          err.response?.data?.message || 
          'This password reset link is invalid or has expired. Please request a new one.'
        );
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTokenValidity();
  }, [token]);

  // Form validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!token) return;
      
      setError(null);
      
      try {
        // Call the API to reset the password
        await api.post(`/auth/reset-password/${token}`, {
          password: values.password,
        });
        
        // Show success state
        setIsSubmitted(true);
      } catch (err: any) {
        setError(
          err.response?.data?.message || 
          'Failed to reset password. Please try again.'
        );
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Show loading state while checking token
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Show error if token is invalid
  if (!isValidToken) {
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
              <LockIcon
                sx={{
                  fontSize: 48,
                  color: 'error.main',
                  mb: 2,
                }}
              />
              <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Invalid or Expired Link
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                {error || 'This password reset link is invalid or has expired.'}
              </Typography>
              
              <Button
                component={RouterLink}
                to={ROUTES.FORGOT_PASSWORD}
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 2,
                  textTransform: 'none',
                }}
              >
                Request New Reset Link
              </Button>
              
              <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
                <Link
                  component={RouterLink}
                  to={ROUTES.LOGIN}
                  color="primary"
                  underline="hover"
                  sx={{ fontWeight: 500 }}
                >
                  Back to Login
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Show success message after password reset
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
              <CheckCircleIcon
                sx={{
                  fontSize: 64,
                  color: 'success.main',
                  mb: 2,
                }}
              />
              <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                Password Reset Successful!
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Your password has been successfully reset. You can now sign in with your new password.
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
                Go to Sign In
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  // Show reset password form
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
            <LockIcon
              sx={{
                fontSize: 48,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Create New Password
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
              Please enter your new password below.
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
              id="password"
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
              autoFocus
            />

            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isLoading || !formik.isValid || formik.isSubmitting}
              sx={{
                py: 1.5,
                mt: 3,
                mb: 2,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {formik.isSubmitting ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPasswordPage;
