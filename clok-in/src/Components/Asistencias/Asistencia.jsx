
import React, { useState } from "react";
import QrScanner from "react-qr-scanner";

const Asistencia = () => {
  const [data, setData] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // 🔹 Convierte texto QR a objeto, aceptando distintos formatos
  const parseQRText = (qrText) => {
    const result = {};

    // Limpiar y reemplazar separadores raros
    qrText = qrText
      .replace(/\r|\n|\t/g, "") // quitar saltos o espacios raros
      .replace(/¿/g, "=")       // convertir "¿" en "="
      .replace(/]/g, "|")       // convertir "]" en "|"
      .trim();

    qrText.split("|").forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key && value) result[key.trim().toUpperCase()] = value.trim();
    });

    return result;
  };

  // 🔹 Cuando el lector detecta un QR
  const handleScan = async (result) => {
    if (!result || !result.text) return;

    try {
      let qrData = result.text.trim();
      let alumno = {};

      // Detectar si es JSON o texto plano
      if (qrData.startsWith("{") && qrData.endsWith("}")) {
        alumno = JSON.parse(qrData);
      } else {
        alumno = parseQRText(qrData);
      }

      // Normalizar campos
      const id_alumno = alumno.id_alumno || alumno.ID;
      const nombre_alumno = alumno.nombre_alumno || alumno.NOMBRE;
      const folio = alumno.folio || alumno.FOLIO || "Sin folio";
      const id_grado = alumno.id_grado || alumno.GRADO || "-";
      const no_lista = alumno.no_lista || alumno.LISTA || "-";

      if (!id_alumno || !nombre_alumno) {
        setMensaje("⚠️ Código QR incompleto o inválido.");
        return;
      }

      const payload = {
        id_alumno,
        nombre_alumno,
        folio,
        id_grado,
        no_lista,
        hora: new Date().toLocaleTimeString(),
      };

      setData(payload);

      // Enviar al backend
      const res = await fetch("http://localhost:3001/asistencia/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const response = await res.json();
      setMensaje(response.message || "✅ Asistencia registrada correctamente");
    } catch (error) {
      console.error("Error al procesar QR:", error);
      setMensaje("❌ Error al procesar el código QR");
    }
  };

  const handleError = (err) => {
    console.error("Error del escáner:", err);
    setMensaje("No se pudo acceder a la cámara");
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">📸 Escáner de Asistencia</h2>

      {/* Componente del lector de QR */}
      <div className="d-flex justify-content-center">
        <div style={{ width: 350 }}>
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%" }}
            facingMode="environment" // Usa cámara trasera del teléfono
          />
        </div>
      </div>

      {/* Resultado */}
      {data && (
        <div className="mt-4 alert alert-success text-start">
          <h5>✅ Alumno detectado</h5>
          <p><strong>Nombre:</strong> {data.nombre_alumno}</p>
          <p><strong>Folio:</strong> {data.folio}</p>
          <p><strong>Grado:</strong> {data.id_grado}</p>
          <p><strong>Hora:</strong> {data.hora}</p>
        </div>
      )}

      {mensaje && <p className="mt-3 fw-bold text-primary">{mensaje}</p>}
    </div>
  );
};

export default Asistencia;
