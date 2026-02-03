import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Calendario = () => {
    const [value, setValue] = useState(new Date());

    // Simulación de datos (esto luego lo jalas de tu BD)
    const diasConAsistencia = ["2025-10-01", "2025-09-30"];
    const diasSinAsistencia = ["2025-09-29"];

    // Función para pintar días
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const fecha = date.toISOString().split("T")[0];

            if (diasConAsistencia.includes(fecha)) {
                return "asistencia-si"; // clase CSS
            }
            if (diasSinAsistencia.includes(fecha)) {
                return "asistencia-no";
            }
            if (fecha === new Date().toISOString().split("T")[0]) {
                return "hoy";
            }
        }
        return null;
    };

    // Opciones para español
    const locale = "es-ES";

    return (
        <div>
            <div className="d-flex justify-content-start w-100 mt-4">
                <div style={{ maxWidth: 500, width: "100%" }}>
                    <Calendar
                        onChange={setValue}
                        value={value}
                        tileClassName={tileClassName}
                        locale={locale}
                        className="calendario-grande"
                    />
                </div>
            </div>
        </div>
    );
};

export default Calendario;