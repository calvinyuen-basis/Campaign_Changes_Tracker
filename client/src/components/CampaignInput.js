import { TextField, Button, Box } from '@mui/material';


export default function CampaignInput({ onSubmit, loading, textFieldProps = {}, buttonProps = {}, children }) {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <TextField
        label="Campaign ID"
        variant="outlined"
        name="campaignId"
        size="small"
        type="number"
        sx={{
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
        }}
        {...textFieldProps}
      />
      <Button variant="contained" type="submit" disabled={loading} sx={{ mr: 5 }} {...buttonProps}>
        {loading ? 'Loading...' : 'Load Campaign'}
      </Button>
      {children}
    </Box>
  );
}
