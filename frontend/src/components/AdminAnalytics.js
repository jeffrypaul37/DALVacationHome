import React from 'react';
import { Typography } from '@mui/material';

const styles = {
  container: {
    padding: '20px',
  },
  iframe: {
    border: 'none',
  },
};

const AdminAnalytics = () => {
  return (
    <>
      <Typography variant="h4">Analytics</Typography>
      <div style={styles.container}>
        <iframe
          title="Looker Studio Report"
          width="100%"
          height="600px"
          src="https://lookerstudio.google.com/embed/reporting/c2a444b7-21a5-4622-93e4-39313eb72426/page/gMs6D"
          frameBorder="0"
          style={styles.iframe}
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
      </div>
    </>
  );
};

export default AdminAnalytics;
