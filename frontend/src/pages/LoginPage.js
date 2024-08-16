import React, { useRef, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import theme from '../theme';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Link from '@mui/material/Link';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo_full.svg';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { poolData } from '../aws-config';
import {
  validateEmail,
  validatePassword,
  validateSecurityAnswer,
  validateCipher,
} from '../utils/Validations';
import axios from 'axios';

const steps = [
  'Enter Email and Password',
  'Answer Security Question',
  'Solve Caesar Cipher',
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [cipherAnswer, setCipherAnswer] = useState('');
  const [challengeParameters, setChallengeParameters] = useState({});
  const [session, setSession] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const cognitoUserRef = useRef();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const displaySnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    securityAnswer: '',
    cipherAnswer: '',
  });

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

  const handleCipherAnswerChange = newValue => {
    setCipherAnswer(newValue);
    setFormErrors(errors => ({
      ...errors,
      cipherAnswer: validateCipher(newValue),
    }));
  };

  const handleConfirm = async event => {
    event.preventDefault();

    const hasErrors = Object.values(formErrors).some(
      errorMessage => errorMessage !== ''
    );

    if (hasErrors) {
      if (activeStep === 0) {
        displaySnackbar('Please enter Email and Password.', 'error');
      } else if (activeStep === 1) {
        displaySnackbar('Please answer the Security Question.', 'error');
      } else if (activeStep === 2) {
        displaySnackbar('Please enter the Cipher Answer.', 'error');
      }
      return;
    }

    switch (activeStep) {
      case 0:
        await initiateAuth();
        break;
      case 1:
        await respondToSecurityQuestion();
        break;
      case 2:
        await respondToCipher();
        break;
      default:
        break;
    }
  };

  const initiateAuth = async () => {
    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const UserPool = new CognitoUserPool(poolData);

    const userData = {
      Username: email,
      Pool: UserPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUserRef.current = cognitoUser;

    cognitoUser.setAuthenticationFlowType('CUSTOM_AUTH');

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        console.log('Authentication Successful.', result);
      },
      onFailure: err => {
        displaySnackbar(err.message, 'error');
      },
      customChallenge: challengeParameters => {
        displaySnackbar('Authentication successful', 'success');
        setSession(cognitoUser.Session);
        setChallengeParameters(challengeParameters);
        setActiveStep(1);
      },
    });
  };

  const respondToSecurityQuestion = async () => {
    console.log('Starting respondToSecurityQuestion');
    const cognitoUser = cognitoUserRef.current;

    if (!cognitoUser || !session) {
      console.log('No Cognito user or session available.');
      return;
    }

    cognitoUser.sendCustomChallengeAnswer(securityAnswer, {
      onSuccess: result => {
        console.log('Security Question Challenge Success.');
      },
      onFailure: err => {
        console.log('Security Question Challenge Failed.', err);
        displaySnackbar('Security Question Challenge Failed', 'error');
      },
      customChallenge: challengeParameters => {
        displaySnackbar('Security Question Challenge Success', 'success');
        setSession(session);
        setChallengeParameters(challengeParameters);
        setActiveStep(2);
      },
    });
  };

  const respondToCipher = async () => {
    const cognitoUser = cognitoUserRef.current;

    if (!cognitoUser || !session) {
      console.log('No Cognito user or session available.');
      return;
    }

    cognitoUser.sendCustomChallengeAnswer(
      cipherAnswer,
      {
        onSuccess: async result => {
          alert('Login Successful!', 'success');
          const loggedInUser = {
            name: challengeParameters.name,
            email: challengeParameters.email,
            role: challengeParameters.role,
          };
          login(loggedInUser);
          try {
            const response = await axios.post(
              'https://ioa67r2jb2.execute-api.us-east-1.amazonaws.com/prod/login-notification',
              { email }
            );

            console.log('API request successful', response.data);
          } catch (error) {
            console.error('API request failed:', error);
          }

          navigate('/');
        },
        onFailure: err => {
          displaySnackbar('Caesar Cipher Challenge Failed.', 'error');
          console.log('Caesar Cipher Challenge Failed.');
        },
      },
      {
        Session: session,
      }
    );
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ py: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              onBlur={e => handleEmailChange(e.target.value)}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={e => handlePasswordChange(e.target.value)}
              onBlur={e => handlePasswordChange(e.target.value)}
              error={Boolean(formErrors.password)}
              helperText={formErrors.password}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ py: 2, width: '100%' }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
              Security Question: {challengeParameters.securityQuestion}
            </Typography>
            <Box sx={{ py: 0 }}>
              <TextField
                label="Answer"
                variant="outlined"
                fullWidth
                value={securityAnswer}
                onChange={e => handleSecurityAnswerChange(e.target.value)}
                onBlur={e => handleSecurityAnswerChange(e.target.value)}
                error={Boolean(formErrors.securityAnswer)}
                helperText={formErrors.securityAnswer}
              />
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ py: 2, width: '100%' }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
              Encrypted Text:{' '}
              <strong>{challengeParameters.securityQuestion}</strong>
            </Typography>
            <TextField
              label="Decrypted Text"
              variant="outlined"
              fullWidth
              value={cipherAnswer}
              onChange={e => handleCipherAnswerChange(e.target.value)}
              onBlur={e => handleCipherAnswerChange(e.target.value)}
              error={Boolean(formErrors.cipherAnswer)}
              helperText={formErrors.cipherAnswer}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        width="100%"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={2}
        bgcolor="#e6effc"
      >
        <Card sx={{ width: '100%', maxWidth: 600, py: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="center" mb={4}>
              <img
                src={logo}
                alt="Logo"
                style={{ width: '400px', height: 'auto' }}
              />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Login
            </Typography>
            <br />
            <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleConfirm}
                  endIcon={<ArrowForward />}
                >
                  {activeStep === steps.length - 1 ? 'Login ' : 'Confirm '}
                </Button>
              </Box>
              {activeStep === 0 && (
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                  Don&apos;t have an account?{' '}
                  <Link href="/register" color="primary" fontWeight={600}>
                    Register
                  </Link>{' '}
                  here.
                </Typography>
              )}
            </Box>
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

export default LoginPage;
