import { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const DriverLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For Sign Up
  const [isSignUp, setIsSignUp] = useState(false); // To toggle between login and signup

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSignUp) {
      // Sign Up Logic
      const response = await fetch('/api/driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          pass: password,
          rating: 0,
          rides: 0,
          isOnline: true,
          isOnRide: false,
          currCity: "",
          currLan: "",
          currLon: ""
        }),
      });

      if (response.ok) {
        const driverData = await response.json();
        console.log('Driver signed up successfully');

        // Create a request board for the new driver
        const requestBoardResponse = await fetch('/api/requestBoard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            driverId: driverData._id, // Assuming the driver's ID is returned from the sign-up response
          }),
        });

        if (requestBoardResponse.ok) {
          console.log('Request board created successfully');
        } else {
          console.error('Failed to create request board');
        }
      } else {
        console.error('Failed to sign up driver');
      }
    } else {
      // Login Logic
      const response = await fetch(`/api/driver?email=${email}`);

      if (response.ok) {
        const data = await response.json();
        if (data.password !== password) {
          console.log('Wrong password');
        } else {
          console.log('Logged in successfully');
        }
      } else {
        console.error('Failed to retrieve driver login info');
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setName(''); // Clear fields when toggling
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
          p: 3,
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      >
        <Typography component="h1" variant="h5">
          {isSignUp ? 'Sign Up' : 'Driver Login'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {isSignUp && (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </Button>
        </Box>
        <Button onClick={toggleMode}>
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Button>
      </Box>
    </Container>
  );
};

export default DriverLoginForm;
