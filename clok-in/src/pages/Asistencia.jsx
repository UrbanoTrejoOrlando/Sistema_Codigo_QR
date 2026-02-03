import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Asistencia = () => {
  const [ultimaLectura, setUltimaLectura] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const inputRef = useRef(null);

  // Función para obtener la fecha del día actual
  const hoy = () => new Date().toISOString().split("T")[0];

  // Cargar registros del día al montar
  useEffect(() => {
    const registrosDelDia = JSON.parse(localStorage.getItem(`asistencia-${hoy()}`)) || [];
    setAsistencias(registrosDelDia);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // 🔹 Convierte texto QR a objeto
  const parseQRText = (qrText) => {
    const data = {};
    qrText = qrText.replace(/[\r\n\t]/g, "").trim();
    qrText.split("]").forEach((pair) => {
      const [key, value] = pair.split("¿");
      if (key && value) data[key.trim().toLowerCase()] = value.trim();
    });
    return data;
  };

  // 🔹 Maneja la lectura del QR
  const handleQRInput = async (e) => {
    if (e.key !== "Enter") return;
    const raw = e.target.value.trim();
    e.target.value = "";
    inputRef.current.focus();

    try {
      const data = parseQRText(raw);
      const id = data.id_alumno || data.id;
      const nombre = data.nombre_alumno || data.nombre;
      const folio = data.folio || "Sin folio";

      if (!id || !nombre) {
        alert("⚠️ QR inválido o incompleto");
        return;
      }

      // Evitar duplicados en toda la lista del día
      if (asistencias.find((a) => a.id_alumno === id)) {
        alert(`⚠️ ${nombre} ya fue registrado hoy`);
        return;
      }

      const payload = {
        id_alumno: id,
        nombre_alumno: nombre,
        folio,
        id_grado: data.id_grado || data.grado || "-",
        no_lista: data.no_lista || data.lista || "-",
        hora: new Date().toLocaleTimeString(),
        tutor: data.tutor || "",
        direccion: data.direccion || "",
        telefono: data.telefono || "",
      };

      // Guardar en backend
      await axios.post("http://localhost:3001/asistencia/registrar", payload);

      // Guardar en localStorage
      const key = `asistencia-${hoy()}`;
      const registrosDelDia = JSON.parse(localStorage.getItem(key)) || [];
      registrosDelDia.push(payload);
      localStorage.setItem(key, JSON.stringify(registrosDelDia));

      // Actualizar UI
      setUltimaLectura(payload);
      setAsistencias(registrosDelDia);
    } catch (err) {
      console.error("❌ Error al registrar asistencia:", err);
      alert("❌ Error al registrar asistencia.");
    }
  };

  // 🔹 Descargar Excel
  const descargarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(asistencias);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `asistencia-${hoy()}.xlsx`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📋 Registro de Asistencia</h2>

      <button className="btn btn-success mb-3" onClick={descargarExcel}>
        📥 Descargar Excel
      </button>

      <input
        ref={inputRef}
        type="text"
        placeholder="Escanee el QR..."
        onKeyDown={handleQRInput}
        style={{ opacity: 0, height: 0, position: "absolute" }}
      />

      {ultimaLectura && (
        <div className="alert alert-success mt-3">
          <strong>Asistencia registrada:</strong> {ultimaLectura.nombre_alumno} ({ultimaLectura.folio})
        </div>
      )}

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Folio</th>
            <th>Grado</th>
            <th>Hora</th>
            <th>Tutor</th>
            <th>Dirección</th>
            <th>Teléfono</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((a, i) => (
            <tr key={i}>
              <td>{a.no_lista}</td>
              <td>{a.nombre_alumno}</td>
              <td>{a.folio}</td>
              <td>{a.id_grado}</td>
              <td>{a.hora}</td>
              <td>{a.tutor}</td>
              <td>{a.direccion}</td>
              <td>{a.telefono}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Asistencia;
