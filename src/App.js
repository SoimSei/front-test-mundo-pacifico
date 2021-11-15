import React from "react";
import Calle from "./Components/Calle";
import EditarCalle from "./Components/EditarCalle";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-purple/theme.css";
import "./Styles/estiloPrincipal.css";
import "primeicons/primeicons.css";

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Calle />} />
                <Route exact path="/editar/:id" element={<EditarCalle />} />
                <Route exact path="/agregar" element={<EditarCalle />} />
            </Routes>
        </Router>
    );
}

export default App;
