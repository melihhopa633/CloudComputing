import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Container,
  Divider,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Functions as CalculatorIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import billingService from '../services/billingService';

function BillingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [billingResult, setBillingResult] = useState(null);
  const [usageSummary, setUsageSummary] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  // Current user from localStorage
  const currentUserEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchUsers();
    if (currentUserEmail) {
      fetchUsageSummary(currentUserEmail);
    }
  }, [currentUserEmail]);

  const fetchUsers = async () => {
    try {
      const response = await billingService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
        if (response.data.length > 0 && !selectedUser) {
          setSelectedUser(currentUserEmail || response.data[0].user_email);
        }
      }
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error:', error);
    }
  };

  const fetchUsageSummary = async (userEmail, days = 30) => {
    try {
      const response = await billingService.getUsageSummary(userEmail, days);
      if (response.success) {
        setUsageSummary(response.data);
      }
    } catch (error) {
      console.error('Error fetching usage summary:', error);
    }
  };

  const handleCalculateBilling = async () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await billingService.calculateBilling(
        selectedUser,
        startDate.toISOString(),
        endDate.toISOString()
      );

      if (response.success) {
        setBillingResult(response.data);
        setSuccess('Billing calculated successfully');
      }
    } catch (error) {
      setError('Failed to calculate billing');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!selectedUser) {
      setError('Please select a user');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await billingService.generateInvoice(
        selectedUser,
        startDate.toISOString(),
        endDate.toISOString()
      );

      if (response.success) {
        setInvoiceData(response.data);
        setDialogOpen(true);
        setSuccess('Invoice generated successfully');
      }
    } catch (error) {
      setError('Failed to generate invoice');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (filename) => {
    try {
      await billingService.downloadInvoice(filename);
      setSuccess('Invoice downloaded successfully');
    } catch (error) {
      setError('Failed to download invoice');
      console.error('Error:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
    setBillingResult(null);
  };

  // Usage Summary Tab
  const UsageSummaryTab = () => (
    <Box>
      <Typography variant="h5" sx={{
        color: '#fff',
        fontWeight: 700,
        mb: 3,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #651fff 0%, #10b981 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        💰 My Resource Usage & Costs
      </Typography>

      {usageSummary && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(101, 31, 255, 0.9) 0%, rgba(103, 58, 183, 0.9) 100%)',
              color: 'white',
              borderRadius: '20px',
              border: '1px solid rgba(101, 31, 255, 0.3)',
              boxShadow: '0 15px 35px rgba(101, 31, 255, 0.4)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 25px 50px rgba(101, 31, 255, 0.6)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {usageSummary.total_containers}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                      🐳 Active Containers
                    </Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
              color: 'white',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 25px 50px rgba(16, 185, 129, 0.6)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {usageSummary.total_cpu_hours.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                      ⚡ CPU Hours
                    </Typography>
                  </Box>
                  <CalculatorIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%)',
              color: 'white',
              borderRadius: '20px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 25px 50px rgba(59, 130, 246, 0.6)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      {usageSummary.total_memory_mb_hours.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                      🧠 Memory MB Hours
                    </Typography>
                  </Box>
                  <DateRangeIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{
              height: '100%',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%)',
              color: 'white',
              borderRadius: '20px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              boxShadow: '0 15px 35px rgba(245, 158, 11, 0.4)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 25px 50px rgba(245, 158, 11, 0.6)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                      ${usageSummary.estimated_cost}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                      💵 Estimated Cost (30 days)
                    </Typography>
                  </Box>
                  <MoneyIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );

  // Admin Billing Tab
  const AdminBillingTab = () => (
    <Box>
      <Typography variant="h5" sx={{
        color: '#fff',
        fontWeight: 700,
        mb: 4,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #651fff 0%, #10b981 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        🧾 Admin Billing & Invoice Center
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{
            background: 'rgba(15, 15, 35, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(101, 31, 255, 0.3)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{
                color: '#fff',
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}>
                📊 Generate Billing Report
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    label="👤 Select User"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(15, 15, 35, 0.8)',
                        borderRadius: '12px',
                        '& fieldset': {
                          borderColor: 'rgba(101, 31, 255, 0.3)',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(101, 31, 255, 0.6)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#651fff',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-focused': {
                          color: '#651fff',
                        },
                      },
                      '& .MuiSelect-select': {
                        color: '#fff',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.user_email} value={user.user_email}>
                        {user.user_fullname} ({user.user_email})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="📅 Start Date"
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                      renderInput={(params) =>
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(15, 15, 35, 0.8)',
                              borderRadius: '12px',
                              '& fieldset': {
                                borderColor: 'rgba(16, 185, 129, 0.3)',
                                borderWidth: '1px',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(16, 185, 129, 0.6)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#10b981',
                                borderWidth: '2px',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&.Mui-focused': {
                                color: '#10b981',
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: '#fff',
                            },
                            '& .MuiSvgIcon-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        />
                      }
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="📅 End Date"
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                      renderInput={(params) =>
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(15, 15, 35, 0.8)',
                              borderRadius: '12px',
                              '& fieldset': {
                                borderColor: 'rgba(16, 185, 129, 0.3)',
                                borderWidth: '1px',
                              },
                              '&:hover fieldset': {
                                borderColor: 'rgba(16, 185, 129, 0.6)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#10b981',
                                borderWidth: '2px',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                              '&.Mui-focused': {
                                color: '#10b981',
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: '#fff',
                            },
                            '& .MuiSvgIcon-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        />
                      }
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      onClick={handleCalculateBilling}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <CalculatorIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        borderRadius: '12px',
                        px: 3,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          boxShadow: '0 12px 35px rgba(16, 185, 129, 0.6)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💻 Calculate
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleGenerateInvoice}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <ReceiptIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #651fff 0%, #5b21b6 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        borderRadius: '12px',
                        px: 3,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: '0 8px 25px rgba(101, 31, 255, 0.4)',
                        border: '1px solid rgba(101, 31, 255, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5b21b6 0%, #4c1d95 100%)',
                          boxShadow: '0 12px 35px rgba(101, 31, 255, 0.6)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      📄 Invoice
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {billingResult && (
          <Grid item xs={12}>
            <Card sx={{
              background: 'rgba(15, 15, 35, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              boxShadow: '0 15px 35px rgba(16, 185, 129, 0.2)',
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{
                  color: '#fff',
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  background: 'linear-gradient(135deg, #10b981 0%, #651fff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  💰 Detailed Billing Summary
                </Typography>

                <TableContainer
                  component={Paper}
                  sx={{
                    mt: 2,
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '16px',
                    border: '1px solid rgba(101, 31, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: 'linear-gradient(135deg, rgba(101, 31, 255, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%)' }}>
                        <TableCell sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>📋 Description</TableCell>
                        <TableCell align="right" sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>📊 Quantity</TableCell>
                        <TableCell align="right" sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>💲 Unit Price</TableCell>
                        <TableCell align="right" sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>💰 Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {billingResult.billing_summary.line_items.map((item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:nth-of-type(odd)': { backgroundColor: 'rgba(101, 31, 255, 0.05)' },
                            '&:hover': { backgroundColor: 'rgba(101, 31, 255, 0.1)' },
                            transition: 'background-color 0.3s ease',
                          }}
                        >
                          <TableCell sx={{ color: '#fff', fontWeight: 500 }}>{item.description}</TableCell>
                          <TableCell align="right" sx={{ color: '#fff' }}>{item.quantity}</TableCell>
                          <TableCell align="right" sx={{ color: '#fff' }}>${item.unit_price}</TableCell>
                          <TableCell align="right" sx={{ color: '#10b981', fontWeight: 600 }}>${item.total}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ background: 'rgba(101, 31, 255, 0.1)' }}>
                        <TableCell colSpan={3} sx={{ color: '#fff', fontWeight: 700 }}>📊 Subtotal</TableCell>
                        <TableCell align="right" sx={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>
                          ${billingResult.billing_summary.subtotal}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                        <TableCell colSpan={3} sx={{ color: '#fff', fontWeight: 700 }}>🏛️ Tax (18%)</TableCell>
                        <TableCell align="right" sx={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>
                          ${billingResult.billing_summary.tax_amount}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{
                        background: 'linear-gradient(135deg, rgba(101, 31, 255, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                        border: '2px solid rgba(101, 31, 255, 0.3)',
                      }}>
                        <TableCell colSpan={3} sx={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>
                          💎 TOTAL AMOUNT
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h5" sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #651fff 0%, #10b981 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                            ${billingResult.billing_summary.total_amount}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                  <Chip
                    label={`📈 ${billingResult.metrics_count} metrics processed`}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.8) 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#fff' }
                    }}
                  />
                  <Chip
                    label={`📅 Period: ${billingResult.period}`}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(101, 31, 255, 0.8) 0%, rgba(103, 58, 183, 0.8) 100%)',
                      color: '#fff',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(101, 31, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <Box sx={{
          textAlign: 'center',
          mb: 4,
          background: 'linear-gradient(135deg, rgba(101, 31, 255, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(101, 31, 255, 0.2)',
          p: 4,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        }}>
          <Typography variant="h3" sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #651fff 0%, #10b981 50%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2,
            textShadow: '0 0 30px rgba(101, 31, 255, 0.3)',
          }}>
            ⚡ DecentraCloud Billing
          </Typography>
          <Typography variant="h6" sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 500,
            letterSpacing: '1px',
          }}>
            💰 Smart Cloud Resource Billing & Invoice Management
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: '16px',
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              backdropFilter: 'blur(10px)',
              '& .MuiAlert-icon': { color: '#f44336' },
              '& .MuiAlert-message': { color: '#fff' },
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: '16px',
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              backdropFilter: 'blur(10px)',
              '& .MuiAlert-icon': { color: '#4caf50' },
              '& .MuiAlert-message': { color: '#fff' },
            }}
          >
            {success}
          </Alert>
        )}

        {/* Tabs */}
        <Card sx={{
          background: 'rgba(15, 15, 35, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(101, 31, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          mb: 3,
        }}>
          <Box sx={{ borderBottom: '1px solid rgba(101, 31, 255, 0.2)' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  minHeight: '64px',
                  '&.Mui-selected': {
                    color: '#fff',
                    background: 'linear-gradient(135deg, rgba(101, 31, 255, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)',
                  }
                },
                '& .MuiTabs-indicator': {
                  background: 'linear-gradient(135deg, #651fff 0%, #10b981 100%)',
                  height: '3px',
                  borderRadius: '3px',
                }
              }}
            >
              <Tab label="💰 My Usage Dashboard" />
              <Tab label="🧾 Admin Billing Center" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && <UsageSummaryTab />}
            {activeTab === 1 && <AdminBillingTab />}
          </Box>
        </Card>
      </Container>

      {/* Invoice Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          🧾 Invoice Generated Successfully
        </DialogTitle>
        <DialogContent>
          {invoiceData && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Invoice Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Invoice ID:</strong> {invoiceData.invoice_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>User:</strong> {invoiceData.user_email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Period:</strong> {invoiceData.period}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Total Amount:</strong> ${invoiceData.total_amount}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Currency:</strong> {invoiceData.currency}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Created:</strong> {new Date(invoiceData.created_at).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Close
          </Button>
          {invoiceData && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => {
                const filename = invoiceData.pdf_url.split('/').pop();
                handleDownloadInvoice(filename);
              }}
            >
              Download PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BillingPage; 