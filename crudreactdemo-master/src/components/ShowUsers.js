import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import UserForm from './UserForm';
import UserTable from './UserTable';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const ShowUsers = () => {
    const url = 'http://localhost:7000/api/users';
    const [user, setUser] = useState([]);
    const [formValues, setFormValues] = useState({ id: '', nombre: '', email: '', password: '' });
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('Registrar Usuario');
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    
    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const response = await axios.get(url);
            setUser(response.data);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    const openModal = (op, id = '', nombre = '', email = '', password = '') => {
        setFormValues({ id, nombre, email, password });
        setOperation(op);
        setTitle(op === 1 ? 'Registrar Usuario' : 'Editar Usuario');
        setModalOpen(true);
    };

    const validar = () => {
        const { nombre, email, password } = formValues;
        if (nombre.trim() === '') {
            show_alerta('Escribe el nombre del usuario', 'warning');
        } else if (email.trim() === '') {
            show_alerta('Escribe el email del usuario', 'warning');
        } else if (password.trim() === '') {
            show_alerta('Escribe la contraseña del usuario', 'warning');
        } else {
            const parametros = { nombre: nombre.trim(), email: email.trim(), password: password.trim() };
            if (operation === 1) {
                enviarSolicitud('POST', parametros);
            } else {
                enviarSolicitud('PUT', parametros, formValues.id);
            }
        }
    };

    const enviarSolicitud = async (metodo, parametros, userId = null) => {
        const requestUrl = userId ? `${url}/${userId}` : url;
        try {
            const response = await axios({ method: metodo, url: requestUrl, data: parametros });
            show_alerta(response.statusText || 'Operación exitosa', 'success');
            if (response.status === 201) {
                setUser((prevUsers) => [...prevUsers, response.data.user]);
            } else if (response.status === 200) {
                await getUser();
            }
        } catch (error) {
            show_alerta('Error en la solicitud', 'error');
            console.error(error);
        }
    };

    const deleteUser = (id, nombre) => {
        Swal.fire({
            title: `¿Seguro de eliminar el usuario ${nombre}?`,
            icon: 'question',
            text: 'No se podrá dar marcha atrás',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                enviarSolicitud('DELETE', {}, id);
            } else {
                show_alerta('El usuario NO fue eliminado', 'info');
            }
        });
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setFormValues({ id: '', nombre: '', email: '', password: '' });
    };

    const show_alerta = (mensaje, icon) => {
        Swal.fire({
            title: mensaje,
            icon: icon,
            confirmButtonText: 'OK'
        });
    };

    const searcher = (e) => {
        setSearch(e.target.value); 
    };

    const filteredUsers = user.filter((u) =>
        u.nombre.toLowerCase().includes(search.toLowerCase())
    );

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/products');
      };
  
    return (
        <>
            {/* Navbar */}
            <AppBar position="static">
                <Toolbar sx={{margin: 2}}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Mis Usuarios
                    </Typography>
                    <input value={search} onChange={searcher} type='text' placeholder='Busca tu usuario'/>
                    <Button sx={{margin: 2}} variant="contained" color="secondary" onClick={() => openModal(1)}>
                        Añadir Usuario
                    </Button>
                    <Button variant="contained" color="warning" onClick={handleClick}>Ver Productos</Button>
                </Toolbar>
            </AppBar>

            {/* Contenido principal */}
            <Container sx={{ mt: 4 }}>
                <UserTable
                    user={filteredUsers} 
                    openModal={openModal}
                    deleteUser={deleteUser}
                />
            </Container>

            {/* Modal para editar producto */}
            <UserForm
                title={title}
                formValues={formValues}
                setFormValues={setFormValues}
                validar={validar}
                modalOpen={modalOpen}
                cerrarModal={cerrarModal}
            />


        </>
    );
};

export default ShowUsers;

