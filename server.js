const express = require('express');
const proj4 = require('proj4');
const app = express();
app.use(express.json());

// Endpoint for UTM to Lat/Lon conversion
app.get('/utm2latlon', (req, res) => {
  try {
    const { zone, easting, northing, hemisphere } = req.query;
    if (!zone || !easting || !northing || !hemisphere) {
      return res.status(400).json({ error: 'Missing parameters: zone, easting, northing, hemisphere' });
    }
    let utmProjectionString = `+proj=utm +zone=${zone} ${hemisphere === 'south' ? '+south' : ''} +datum=WGS84 +units=m +no_defs`;
    let [longitude, latitude] = proj4(utmProjectionString, 'WGS84', [parseFloat(easting), parseFloat(northing)]);
    return res.json({ lat: latitude.toFixed(6), lon: longitude.toFixed(6) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);

});
