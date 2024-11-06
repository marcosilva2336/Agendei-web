import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/navbar.jsx";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";

function DoctorAdd() {

    const navigate = useNavigate();
    const { id_doctor } = useParams();
    const [name, setName] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [icon, setIcon] = useState("");
    const [services, setServices] = useState([{ id_service: "", price: "" }]);
    const [availableServices, setAvailableServices] = useState([]);

    useEffect(() => {
        if (id_doctor) {
            LoadDoctor(id_doctor);
        }
        LoadAvailableServices();
    }, [id_doctor]);

    async function LoadDoctor(id) {
        try {
            const response = await api.get("/admin/doctors/" + id);
            if (response.data) {
                setName(response.data.name);
                setSpecialty(response.data.specialty);
                setIcon(response.data.icon);
                LoadServices(id);
            }
        } catch (error) {
            handleError(error);
        }
    }

    async function LoadServices(id) {
        try {
            const response = await api.get("/admin/doctors/" + id + "/services");
            if (response.data) {
                setServices(response.data);
            }
        } catch (error) {
            handleError(error);
        }
    }

    async function LoadAvailableServices() {
        try {
            const response = await api.get("/services");
            if (response.data) {
                setAvailableServices(response.data);
            }
        } catch (error) {
            handleError(error);
        }
    }

    async function SaveDoctorAndServices() {
        const doctorData = { name, specialty, icon };
        try {
            const response = id_doctor
                ? await api.put("/admin/doctors/" + id_doctor, doctorData)
                : await api.post("/admin/doctors", doctorData);

            if (response.data) {
                const doctorId = id_doctor || response.data.id_doctor;
                await SaveServices(doctorId);
                navigate("/doctors");
            }
        } catch (error) {
            handleError(error);
        }
    }

    async function SaveServices(doctorId) {
        for (const service of services) {
            try {
                await api.post(`/admin/doctors/${doctorId}/services`, {
                    id_service: service.id_service,
                    price: service.price
                });
            } catch (error) {
                handleError(error);
            }
        }
    }

    function handleError(error) {
        if (error.response?.data.error) {
            alert(error.response?.data.error);
        } else {
            alert("Erro ao processar a solicitação");
        }
    }

    function handleServiceChange(index, field, value) {
        const updatedServices = [...services];
        updatedServices[index][field] = value;
        setServices(updatedServices);
    }

    function handleServiceSelect(index, value) {
        const updatedServices = [...services];
        updatedServices[index] = { ...updatedServices[index], id_service: value };
        setServices(updatedServices);
    }

    function addService() {
        setServices([...services, { id_service: "", price: "" }]);
    }

    return (
        <>
            <Navbar />
            <div className="container-fluid mt-page">
                <div className="row col-lg-4 offset-lg-4">
                    <div className="col-12 mt-2">
                        <h2>{id_doctor ? "Editar Médico" : "Novo Médico"}</h2>
                    </div>

                    <div className="col-12 mt-4">
                        <label htmlFor="name" className="form-label">Nome</label>
                        <input type="text" className="form-control" name="name" id="name"
                            value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="col-12 mt-4">
                        <label htmlFor="specialty" className="form-label">Especialidade</label>
                        <input type="text" className="form-control" name="specialty" id="specialty"
                            value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
                    </div>

                    <div className="col-12 mt-4">
                        <label className="form-label">Gênero</label>
                        <div className="d-flex">
                            <div className="form-check me-3">
                                <input className="form-check-input" type="radio" name="icon" id="male" value="M"
                                    checked={icon === "M"} onChange={(e) => setIcon(e.target.value)} />
                                <label className="form-check-label" htmlFor="male">
                                    Masculino
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="icon" id="female" value="F"
                                    checked={icon === "F"} onChange={(e) => setIcon(e.target.value)} />
                                <label className="form-check-label" htmlFor="female">
                                    Feminino
                                </label>
                            </div>
                        </div>
                    </div>

                    {services.map((service, index) => (
                        <div key={index} className="col-12 mt-4">
                            <label htmlFor={`service-${index}`} className="form-label">Serviço</label>
                            <select className="form-control" name={`service-${index}`} id={`service-${index}`}
                                value={service.id_service} onChange={(e) => handleServiceSelect(index, e.target.value)}>
                                <option value="">Selecione um serviço</option>
                                {availableServices.map(s => (
                                    <option key={s.id_service} value={s.id_service}>{s.description}</option>
                                ))}
                            </select>
                            <label htmlFor={`price-${index}`} className="form-label mt-2">Preço</label>
                            <input type="text" className="form-control" name={`price-${index}`} id={`price-${index}`}
                                value={service.price} onChange={(e) => handleServiceChange(index, 'price', e.target.value)} />
                        </div>
                    ))}

                    <div className="col-12 mt-4">
                        <div className="d-flex justify-content-end">
                            <Link to="/doctors" className="btn btn-outline-primary me-3">Cancelar</Link>
                            <button onClick={addService} className="btn btn-secondary me-3">Adicionar Serviço</button>
                            <button onClick={SaveDoctorAndServices} className="btn btn-primary">Salvar Dados</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DoctorAdd;