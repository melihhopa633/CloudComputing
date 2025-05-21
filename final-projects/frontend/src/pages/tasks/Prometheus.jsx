import React, { useEffect } from 'react';

const PrometheusPage = () => {
   // Component mount olduğunda URL değişmiş olacak
   useEffect(() => {
      // Burası sadece component mount olduğunda çalışır
      // URL'nin değiştiğinden emin olmak için
      document.title = 'Prometheus Viewer - Docker Logs';
   }, []);

   return (
      <div style={{
         width: '100%',
         height: 'calc(100vh - 64px)', // App bar yüksekliğini çıkar
         overflow: 'hidden',
         margin: 0,
         padding: 0,
         position: 'relative'
      }}>
         <iframe
            src="http://localhost:9090/#/events?range=1d"
            title="Prometheus Logs"
            style={{
               width: '100%',
               height: '100%',
               border: 'none',
               margin: 0,
               padding: 0,
               display: 'block',
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0
            }}
            allowFullScreen
         />
      </div>
   );
};

export default PrometheusPage; 