const express = require('express');
const proj4 = require('proj4');
const app = express();
app.use(express.json());

// Endpoint para conversão UTM → Lat/Lon
app.get('/utm2latlon', (req, res) => {
  try {
    const { zone, easting, northing, hemisphere } = req.query;
    if (!zone || !easting || !northing || !hemisphere) {
      return res.status(400).json({ error: 'Faltam parâmetros: zone, easting, northing, hemisphere' });
    }
    let utm = `+proj=utm +zone=${zone} ${hemisphere === 'south' ? '+south' : ''} +datum=WGS84 +units=m +no_defs`;
    let [lon, lat] = proj4(utm, 'WGS84', [parseFloat(easting), parseFloat(northing)]);
    return res.json({ lat: lat.toFixed(6), lon: lon.toFixed(6) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Inicializa servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('API rodando na porta ' + PORT);

});
