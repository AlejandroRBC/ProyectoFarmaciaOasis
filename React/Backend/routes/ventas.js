const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventasController");


router.get("/", ventasController.getAllWithDetails);
router.get("/detalle", ventasController.getVentasDetalle); // NUEVA RUTA
router.get("/historial", ventasController.getHistorialIngresosEgresos);
router.get("/por-fecha", ventasController.getVentasPorFecha);
router.get("/:id", ventasController.getVentaDetails);
router.post("/", ventasController.create);

module.exports = router;