import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';

export default function AlumnoCard({ alumno, token }) {
  const cardRef = useRef();

  // 👉 Ver QR en nueva pestaña
  const viewQr = () => {
    const url = `http://localhost:3001/alumnos/qr/image/${alumno.folio}`;
    window.open(url, "_blank");
  };

  // 👉 Descargar PDF desde el cliente usando html2canvas (opcional)
  const downloadPdfClient = async () => {
    const element = cardRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({ unit: 'mm', format: 'a6' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`tarjeta_${alumno.folio}.pdf`);
    } catch (err) {
      console.error("Error generando PDF en cliente:", err);
    }
  };

  // 👉 Descargar PDF directamente desde el servidor (recomendado)
  const downloadPdfServer = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/alumnos/card/download/${alumno.id_alumno}`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `tarjeta_${alumno.folio}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error descargando PDF del servidor:", err);
      alert("No se pudo descargar el PDF desde el servidor.");
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '1rem' }}>
      <div
        ref={cardRef}
        style={{
          width: 300,
          padding: 12,
          border: '1px solid #ddd',
          borderRadius: 8,
          background: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h3>{alumno.nombre_alumno}</h3>
        <p>Grado: {alumno.id_grado}</p>

        {/* 📸 QR generado por backend */}
        <img
          src={`http://localhost:3001/alumnos/qr/image/${alumno.folio}`}
          alt={`QR de ${alumno.nombre_alumno}`}
          loading="lazy"
          style={{ width: 150, height: 150, margin: '10px 0' }}
        />

        <p>Folio: <b>{alumno.folio}</b></p>
      </div>

      {/* 🔘 Acciones */}
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button onClick={downloadPdfServer}>Descargar PDF (Alumno)</button>
      </div>
    </div>
  );
}
