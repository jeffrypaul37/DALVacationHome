import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import theme from '../theme';
import Link from '@mui/material/Link';
import logo from '../assets/logo_full.svg';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { useNavigate } from 'react-router-dom';
import { poolData } from '../aws-config';
import {
  validateEmail,
  validateConfirmPassword,
  validateName,
  validatePassword,
  validateSecurityAnswer,
  validateRole,
  validateSecurityQuestion,
  validateShiftKey,
} from '../utils/Validations';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [shiftValue, setShiftValue] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    securityAnswer: '',
    cipherAnswer: '',
    name: '',
    role: '',
    shiftKey: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const displaySnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleEmailChange = newValue => {
    setEmail(newValue);
    setFormErrors(errors => ({ ...errors, email: validateEmail(newValue) }));
  };

  const handlePasswordChange = newValue => {
    setPassword(newValue);
    setFormErrors(errors => ({
      ...errors,
      password: validatePassword(newValue),
    }));
  };

  const handleSecurityAnswerChange = newValue => {
    setSecurityAnswer(newValue);
    setFormErrors(errors => ({
      ...errors,
      securityAnswer: validateSecurityAnswer(newValue),
    }));
  };

  const handleShiftValueChange = newValue => {
    setShiftValue(newValue);
    setFormErrors(errors => ({
      ...errors,
      shiftKey: validateShiftKey(newValue),
    }));
  };

  const handleRoleChange = newValue => {
    setRole(newValue);
    setFormErrors(errors => ({
      ...errors,
      role: validateRole(newValue),
    }));
  };

  const handleSecurityQuestionChange = newValue => {
    setSecurityQuestion(newValue);
    setFormErrors(errors => ({
      ...errors,
      securityQuestion: validateSecurityQuestion(newValue),
    }));
  };

  const handleNameChange = newValue => {
    setName(newValue);
    setFormErrors(errors => ({
      ...errors,
      name: validateName(newValue),
    }));
  };

  const handleConfirmPasswordChange = (password, newValue) => {
    setFormErrors(errors => ({
      ...errors,
      confirmPassword: validateConfirmPassword(password, newValue),
    }));
  };

  useEffect(() => {
    // Replace with your API endpoint
    fetch(
      'https://hqsgv2rtgb.execute-api.us-east-1.amazonaws.com/prod/getSecurityQuestions'
    )
      .then(response => response.json())
      .then(data => {
        if (data.statusCode === 200) {
          setSecurityQuestions(data.body);
        } else {
          console.error('Failed to fetch security questions:', data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching security questions:', error);
        setLoading(false);
      });
  }, []);

  const handleRegister = async event => {
    event.preventDefault();

    const hasErrors = Object.values(formErrors).some(
      errorMessage => errorMessage !== ''
    );

    if (!hasErrors) {
      const client = new CognitoIdentityProviderClient({
        region: 'us-east-1',
      });
      const input = {
        ClientId: poolData.ClientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'name', Value: name },
          { Name: 'custom:role', Value: role },
        ],
        ValidationData: [
          { Name: 'name', Value: name },
          { Name: 'email', Value: email },
          { Name: 'role', Value: role },
          { Name: 'securityQuestion', Value: securityQuestion },
          { Name: 'answer', Value: securityAnswer },
          { Name: 'cipherKey', Value: shiftValue.toString() },
        ],
      };
      console.log(input);
      try {
        const command = new SignUpCommand(input);
        const response = await client.send(command);
        alert('User signed up successfully');
        console.log('Response: ' + response);
        await axios.post(
          'https://ioa67r2jb2.execute-api.us-east-1.amazonaws.com/prod/register-notification',
          {
            email,
            message: 'Thank you for registering at DALVacationHome!',
          }
        );
        navigate('/login');
      } catch (err) {
        console.error('Error signing up user:', err);
      }
    } else {
      displaySnackbar('Please enter all Required Details', 'error');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        px={2}
        py={2}
        bgcolor="#e6effc"
      >
        <Card sx={{ width: '100%', maxWidth: 600, py: 2, mx: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="center" mb={2}>
              <img
                src={logo}
                alt="Logo"
                style={{ width: '300px', height: 'auto' }}
              />
            </Box>
            <Typography variant="h4" component="h2" gutterBottom align="center">
              Register
            </Typography>
            <Typography variant="h6" component="h1" gutterBottom align="center">
              Create your account to start booking your dream vacation home.
            </Typography>
            <Box sx={{ py: 2 }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                onChange={e => handleNameChange(e.target.value)}
                onBlur={e => handleNameChange(e.target.value)}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                onChange={e => handleEmailChange(e.target.value)}
                onBlur={e => handleEmailChange(e.target.value)}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                sx={{ mb: 2 }}
              />
              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  onChange={e => handlePasswordChange(e.target.value)}
                  onBlur={e => handlePasswordChange(e.target.value)}
                  error={Boolean(formErrors.password)}
                  helperText={formErrors.password}
                  sx={{ mr: 1 }}
                />
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  onChange={e =>
                    handleConfirmPasswordChange(password, e.target.value)
                  }
                  onBlur={e =>
                    handleConfirmPasswordChange(password, e.target.value)
                  }
                  error={Boolean(formErrors.confirmPassword)}
                  helperText={formErrors.confirmPassword}
                />
              </Box>
              <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  onChange={e => handleRoleChange(e.target.value)}
                  onBlur={e => handleRoleChange(e.target.value)}
                  error={Boolean(formErrors.role)}
                  label="Role"
                >
                  <MenuItem value="Customer">Customer</MenuItem>
                  <MenuItem value="Property Agent">Property Agent</MenuItem>
                </Select>
                <FormHelperText color="error">{formErrors.role}</FormHelperText>
              </FormControl>
              <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                <InputLabel>Security Question</InputLabel>
                <Select
                  onChange={e => handleSecurityQuestionChange(e.target.value)}
                  onBlur={e => handleSecurityQuestionChange(e.target.value)}
                  error={Boolean(formErrors.securityQuestion)}
                  label="Security Question"
                  disabled={loading}
                >
                  {loading ? (
                    <MenuItem value="">
                      <CircularProgress size={24} />
                    </MenuItem>
                  ) : (
                    securityQuestions.map(question => (
                      <MenuItem key={question.id} value={question.question}>
                        {question.question}
                      </MenuItem>
                    ))
                  )}
                </Select>
                <FormHelperText color="error">
                  {formErrors.securityQuestion}
                </FormHelperText>
              </FormControl>
              <TextField
                label="Security Answer"
                variant="outlined"
                fullWidth
                onChange={e => handleSecurityAnswerChange(e.target.value)}
                onBlur={e => handleSecurityAnswerChange(e.target.value)}
                error={Boolean(formErrors.securityAnswer)}
                helperText={formErrors.securityAnswer}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Shift Value for Caesar Cipher"
                type="number"
                variant="outlined"
                fullWidth
                onChange={e => handleShiftValueChange(e.target.value)}
                onBlur={e => handleShiftValueChange(e.target.value)}
                error={Boolean(formErrors.shiftKey)}
                helperText={formErrors.shiftKey}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleRegister}
              >
                Register
              </Button>
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link href="/login" color="primary" fontWeight={600}>
                Login
              </Link>{' '}
              here.
            </Typography>
          </CardContent>
        </Card>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterPage;
