import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";

const Calle = () => {
    const [datos, setDatos] = useState([]);
    const { REACT_APP_API } = process.env;

    const toast = useRef(null);
    const navigate = useNavigate();

    const getDatos = async () => {
        setDatos([]);
        const response = await fetch(`http://${REACT_APP_API}datosCalleLista`);
        const data = await response.json();
        setDatos(data);
    };

    useEffect(() => {
        getDatos();
    }, []);

    const columns = [
        { field: "calle", header: "Calle" },
        { field: "ciudad", header: "Ciudad" },
        { field: "provincia", header: "Provincia" },
        { field: "region", header: "Region" },
    ];

    const dynamicColumns = columns.map((col, i) => {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });

    const deleteCalle = (idC) => {
        fetch(`http://${REACT_APP_API}calles/${idC}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }).then((response) => {
            if (response.status === 204) {
                toast.current.show({
                    severity: "success",
                    summary: "Calle eliminada con exito",
                    life: 1000,
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error al eliminar la calle",
                    life: 1000,
                });
            }
        });
    };
    const confirm2 = (idC) => {
        confirmDialog({
            message: "¿Seguro que quieres eliminar esta calle?",
            header: "Confirmar eliminación",
            icon: "pi pi-exclamation-triangle",
            position: "top",
            acceptClassName: "p-button-outlined p-button-danger",
            rejectClassName: "p-button-outlined",
            accept: () => deleteCalle(idC),
        });
    };

    const buttonEdit = (rowData) => {
        return (
            <Button
                label="Editar Calle"
                className="p-button-outlined"
                style={{ width: "100%" }}
                onClick={() => navigate(`/editar/${rowData.idCalle}`)}
            />
        );
    };

    const buttonRemove = (rowData) => {
        return (
            <Button
                label="Eliminar Calle"
                className="p-button-outlined p-button-danger"
                style={{ width: "100%" }}
                onClick={() => confirm2(rowData.idCalle)}
            />
        );
    };

    const tituloCard = () => {
        return (
            <div>
                Lista de Calles
                <Button
                    label="Agregar Calle"
                    className="p-button-outlined p-button-success"
                    onClick={() => navigate(`/agregar`)}
                    style={{
                        width: "20%",
                        marginLeft: "62%",
                    }}
                />
            </div>
        );
    };

    return (
        <div>
            <Toast ref={toast} onHide={() => getDatos()} />
            <Card
                title={tituloCard}
                style={{
                    width: "80%",
                    margin: "4% 10% 0",
                    boxShadow:
                        "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                }}
            >
                <DataTable
                    value={datos}
                    size="small"
                    responsiveLayout="scroll"
                    showGridlines
                >
                    {dynamicColumns}
                    <Column
                        field=""
                        header="Editar"
                        body={buttonEdit}
                        style={{ width: "15%" }}
                    ></Column>
                    <Column
                        field=""
                        header="Eliminar"
                        body={buttonRemove}
                        style={{ width: "15%" }}
                    ></Column>
                </DataTable>
            </Card>
        </div>
    );
};
export default Calle;
