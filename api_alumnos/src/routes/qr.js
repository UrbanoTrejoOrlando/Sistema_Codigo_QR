const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  getQrByFolio,
  getQrImageByFolio,
  downloadCardPdf,
  downloadAllCardsPdf
} = require('../controller/qrController');

// Generar QR (dataURL y PNG)
router.get('/qr/folio/:folio', getQrByFolio);
router.get('/qr/image/:folio', getQrImageByFolio);

// Generar tarjetas PDF
router.get('/card/download/:id_alumno', protect, authorize(['admin']), downloadCardPdf);
router.get('/card/download-all', protect, authorize(['admin']), downloadAllCardsPdf);


module.exports = router;
