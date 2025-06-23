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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          💰 My Usage & Costs
        </Typography>
      </Grid>

      {usageSummary && (
        <>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {usageSummary.total_containers}
                    </Typography>
                    <Typography variant="body2">
                      Active Containers
                    </Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {usageSummary.total_cpu_hours.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      CPU Hours
                    </Typography>
                  </Box>
                  <CalculatorIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {usageSummary.total_memory_gb_hours.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Memory GB Hours
                    </Typography>
                  </Box>
                  <DateRangeIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      ${usageSummary.estimated_cost}
                    </Typography>
                    <Typography variant="body2">
                      Estimated Cost (30 days)
                    </Typography>
                  </Box>
                  <MoneyIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );

  // Admin Billing Tab
  const AdminBillingTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          🧾 Billing Administration
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Generate Billing Report
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Select User"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  fullWidth
                  size="small"
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
                    label="Start Date"
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={3}>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    onClick={handleCalculateBilling}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <CalculatorIcon />}
                    sx={{ mr: 1 }}
                  >
                    Calculate
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleGenerateInvoice}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <ReceiptIcon />}
                  >
                    Invoice
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {billingResult && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 Billing Summary
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Description</strong></TableCell>
                      <TableCell align="right"><strong>Quantity</strong></TableCell>
                      <TableCell align="right"><strong>Unit Price</strong></TableCell>
                      <TableCell align="right"><strong>Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billingResult.billing_summary.line_items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${item.unit_price}</TableCell>
                        <TableCell align="right">${item.total}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3}><strong>Subtotal</strong></TableCell>
                      <TableCell align="right"><strong>${billingResult.billing_summary.subtotal}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3}><strong>Tax (18%)</strong></TableCell>
                      <TableCell align="right"><strong>${billingResult.billing_summary.tax_amount}</strong></TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell colSpan={3}><strong>Total Amount</strong></TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="primary">
                          <strong>${billingResult.billing_summary.total_amount}</strong>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box mt={2}>
                <Chip label={`${billingResult.metrics_count} metrics processed`} color="info" />
                <Chip label={`Period: ${billingResult.period}`} color="default" sx={{ ml: 1 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        💰 Billing & Invoices
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="💰 My Usage" />
          <Tab label="🧾 Admin Billing" />
        </Tabs>
      </Box>

      {activeTab === 0 && <UsageSummaryTab />}
      {activeTab === 1 && <AdminBillingTab />}

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