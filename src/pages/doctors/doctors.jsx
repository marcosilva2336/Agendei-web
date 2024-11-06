import 'react-confirm-alert/src/react-confirm-alert.css'; 
import "./doctors.css";
import Navbar from "../../components/navbar/navbar.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import { confirmAlert } from "react-confirm-alert";
import Doctor from "../../components/doctor/doctor.jsx";

function Doctors() {

    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    function ClickEdit(id_doctor) {
        navigate("/doctors/edit/" + id_doctor);
    }

    function ClickDelete(id_doctor) {
        confirmAlert({
            title: "Exclusão",
            message: "Confirma exclusão desse médico?",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => DeleteDoctor(id_doctor)
                },
                {
                    label: "Não",
                    onClick: () => { }
                }
            ]
        });
    }

    async function DeleteDoctor(id) {
        try {
            const response = await api.delete("/doctors/" + id);

            if (response.data) {
                LoadDoctors();
            }

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401)
                    return navigate("/");

                alert(error.response?.data.error);
            }
            else
                alert("Erro ao excluir dados");
        }
    }

    async function LoadDoctors() {
        try {
            const response = await api.get("/doctors", {
                params: {
                    name: searchTerm
                }
            });

            if (response.data) {
                setDoctors(response.data);
            }

        } catch (error) {
            if (error.response?.data.error) {
                if (error.response.status == 401)
                    return navigate("/");

                alert(error.response?.data.error);
            }
            else
                alert("Erro ao listar médicos.");
        }
    }

    useEffect(() => {
        LoadDoctors();
    }, []);

    return <div className="container-fluid mt-page">
        <Navbar />

        <div className="d-flex justify-content-between align-items-center">
            <div>
                <h2 className="d-inline">Médicos</h2>
                <Link to="/doctors/add"
                    className="btn btn-outline-primary ms-5 mb-2">
                    Novo Médico
                </Link>
            </div>

            <div className="d-flex justify-content-end">
                <input id="searchTerm" className="form-control" type="text"
                    placeholder="Buscar médico por nome"
                    onChange={(e) => setSearchTerm(e.target.value)} />

                <button onClick={LoadDoctors} className="btn btn-primary ms-3" type="button">Filtrar</button>
            </div>
        </div>

        <div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Especialidade</th>
                        <th scope="col" className="col-buttons"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        doctors.map((doc) => {
                            return <Doctor key={doc.id_doctor}
                                id_doctor={doc.id_doctor}
                                name={doc.name}
                                specialty={doc.specialty}
                                clickEdit={ClickEdit}
                                clickDelete={ClickDelete}
                            />
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
}

export default Doctors;