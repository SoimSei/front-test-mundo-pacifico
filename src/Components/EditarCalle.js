import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

const EditarCalle = () => {
    const { id } = useParams();
    const [calle, setCalle] = useState("");
    const [regiones, setRegiones] = useState([]);
    const [region, setRegion] = useState();
    const [provincias, setProvincias] = useState([]);
    const [provincia, setProvincia] = useState();
    const [ciudades, setCiudades] = useState([]);
    const [ciudad, setCiudad] = useState();
    const navigate = useNavigate();
    const toastGuardar = useRef(null);
    const toastError = useRef(null);
    const { REACT_APP_API } = process.env;

    const updateRegiones = async () => {
        const response = await fetch(`http://${REACT_APP_API}regiones`);
        const data = await response.json();
        Object.keys(data).map(function (key) {
            setRegiones((regiones) => [
                ...regiones,
                {
                    label: data[key].nombreRegion,
                    value: data[key].id,
                },
            ]);
        });
    };

    const updateProvincias = async (id) => {
        const response = await fetch(
            `http://${REACT_APP_API}regiones/provincias/${id}`
        );
        const data = await response.json();
        Object.keys(data).map(function (key) {
            setProvincias((provincias) => [
                ...provincias,
                {
                    label: data[key].nombreProvincia,
                    value: data[key].id,
                },
            ]);
        });
    };
    const updateCiudades = async (id) => {
        const response = await fetch(
            `http://${REACT_APP_API}provincias/ciudades/${id}`
        );
        const data = await response.json();
        Object.keys(data).map(function (key) {
            setCiudades((ciudades) => [
                ...ciudades,
                {
                    label: data[key].nombreCiudad,
                    value: data[key].id,
                },
            ]);
        });
    };

    const updateCalle = () => {
        fetch(`http://${REACT_APP_API}calles/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                idCiudad: ciudad,
                nombreCalle: calle,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((response) => {
            if (response.status === 201) {
                toastGuardar.current.show({
                    severity: "success",
                    summary: "Calle editada con exito",
                    life: 1500,
                });
            } else {
                toastError.current.show({
                    severity: "error",
                    summary: "Error al editar la calle",
                    life: 1500,
                });
            }
        });
    };

    const agregarCalle = () => {
        fetch(`http://${REACT_APP_API}calles`, {
            method: "POST",
            body: JSON.stringify({
                idCiudad: ciudad,
                nombreCalle: calle,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        }).then((response) => {
            if (response.status === 201) {
                toastGuardar.current.show({
                    severity: "success",
                    summary: "Calle guardada con exito",
                    life: 1500,
                });
            } else {
                toastError.current.show({
                    severity: "error",
                    summary: "Error al guardar la calle",
                    life: 1500,
                });
            }
        });
    };

    const regionesHandler = (e) => {
        setRegion(e.value);
        setProvincias([]);
        setCiudades([]);
        updateProvincias(e.value);
    };

    const provinciasHandler = (e) => {
        setProvincia(e.value);
        setCiudades([]);
        updateCiudades(e.value);
    };

    const footer = (
        <span>
            <Button
                label={id === undefined ? "Guardar" : "Editar"}
                icon="pi pi-check"
                className="p-button-outlined p-button-success"
                onClick={id === undefined ? agregarCalle : updateCalle}
                style={{ width: "45%", marginRight: "3%" }}
            />
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-outlined p-button-danger"
                onClick={() => navigate(`/`)}
                style={{ width: "45%", marginLeft: "3%" }}
            />
        </span>
    );

    useEffect(() => {
        const getDatos = async () => {
            const response = await fetch(
                `http://${REACT_APP_API}datosCalleLista/${id}`
            );
            const data = await response.json();
            setCalle(data.calle);
            setRegion(data.idRegion);
            updateProvincias(data.idRegion);
            setProvincia(data.idProvincia);
            updateCiudades(data.idProvincia);
            setCiudad(data.idCiudad);
        };
        if (id !== undefined) {
            getDatos();
        }
        updateRegiones();
    }, []);

    return (
        <div>
            <Toast ref={toastGuardar} onHide={() => navigate(`/`)} />
            <Toast ref={toastError} />
            <Card
                title={id === undefined ? "Agregar Calle" : "Editar Calle"}
                style={{
                    width: "25%",
                    margin: "5% 37%",
                    boxShadow:
                        "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                    textAlign: "center",
                }}
                footer={footer}
            >
                <h5 style={{ textAlign: "left" }}>Nombre Calle</h5>
                <InputText
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                    style={{ width: "80%", margin: "0 10%", textAlign: "left" }}
                />
                <h5 style={{ textAlign: "left" }}>Región</h5>
                <Dropdown
                    value={region}
                    options={regiones}
                    onChange={regionesHandler}
                    placeholder="Elige una región"
                    style={{ width: "80%", margin: "0 10%", textAlign: "left" }}
                />
                <h5 style={{ textAlign: "left" }}>Provincia</h5>
                <Dropdown
                    value={provincia}
                    options={provincias}
                    onChange={provinciasHandler}
                    placeholder="Elige una provincia"
                    style={{ width: "80%", margin: "0 10%", textAlign: "left" }}
                />
                <h5 style={{ textAlign: "left" }}>Ciudad</h5>
                <Dropdown
                    value={ciudad}
                    options={ciudades}
                    onChange={(e) => setCiudad(e.value)}
                    placeholder="Elige una ciudad"
                    style={{ width: "80%", margin: "0 10%", textAlign: "left" }}
                />
            </Card>
        </div>
    );
};

export default EditarCalle;
