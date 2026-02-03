import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./style.css";

const Calendario = ({ id_alumno }) => {
  const [value, setValue] = useState(new Date());
  const [asistencias, setAsistencias] = useState([]); // Guardará objetos con fecha y hora

  useEffect(() => {
    if (!id_alumno) {
      setAsistencias([]);
      return;
    }

    const obtenerAsistencias = async () => {
      try {
        setAsistencias([]);

        const response = await fetch(
          `http://localhost:3002/api/asistencias/${id_alumno}`
        );
        if (!response.ok) throw new Error("Error al obtener asistencias");

        const data = await response.json();

        // Guardamos los objetos { fecha, hora_entrada }
        const registros = data.map((item) => ({
          fecha: new Date(item.fecha).toISOString().split("T")[0],
          hora_entrada: item.hora_entrada,
        }));

        setAsistencias(registros);
      } catch (error) {
        console.error("Error al cargar asistencias:", error);
        setAsistencias([]);
      }
    };

    obtenerAsistencias();
  }, [id_alumno]);

  // 🔹 Determinar la clase CSS según la hora o ausencia
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const fechaActual = date.toISOString().split("T")[0];

      const registro = asistencias.find(
        (item) => item.fecha === fechaActual
      );

      if (registro) {
        const hora = registro.hora_entrada;

        // Comparar hora
        if (hora <= "07:00:00") return "asistencia-dia"; // Verde (puntual)
        if (hora > "07:00:00" && hora <= "08:00:00") return "retardo-dia"; // Amarillo (tarde)
      } else {
        // Si la fecha ya pasó y no hay registro => ausencia
        const hoy = new Date().toISOString().split("T")[0];
        if (fechaActual < hoy) return "ausencia-dia"; // Rojo (ausente)
      }
    }
    return null;
  };

  return (
    <div>
      <p className="text-center fs-4 mt-4">Calendario de Asistencias</p>

      {!id_alumno ? (
        <p className="text-center text-muted">
          Selecciona un alumno para ver su calendario.
        </p>
      ) : (
        <div className="d-flex justify-content-center">
          <Calendar
            onChange={setValue}
            value={value}
            tileClassName={tileClassName}
            locale="es-ES"
            className="calendario-grande"
          />
        </div>
      )}
      <p className="text-center text-success fs-6 mt-2">Asistio</p>
      <p className="text-center text-warning fs-6 mt-2">Retardo</p>
      <p className="text-center text-danger fs-6 mt-2">No asisitio</p>
    </div>
  );
};

export default Calendario;
