"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import { IconButton } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Link from "next/link";
import { NewUser } from "@/helpers/Autenticacion.helper";
import { IUserProps } from "@/interfaces/IUser";
import { validateRegisterUserForm } from "@/utils/userFormValidation";
import axios from "axios";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

const RegisterUser = () => {
  const Router = useRouter();

  const initialUserData: IUserProps = {
    name: "",
    email: "",
    password: "",
    phone: "",
  };

  const initialErrorState: IUserProps = {
    name: "",
    email: "",
    password: "",
    phone: "",
  };

  const [dataUser, setDataUser] = useState<IUserProps>(initialUserData);
  const [error, setError] = useState<IUserProps>(initialErrorState);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<keyof IUserProps, boolean>>({
    name: false,
    email: false,
    password: false,
    phone: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleReset = (): void => {
    setDataUser(initialUserData);
    setError(initialErrorState);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;

    setDataUser((prevDataUser) => ({
      ...prevDataUser,
      [name]: value,
    }));

    if (!touched[name as keyof IUserProps]) {
      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));
    }

    // Validar el campo específico que se ha cambiado
    const fieldErrors = validateRegisterUserForm({
      ...dataUser,
      [name]: value,
    });

    setError((prevError) => ({
      ...prevError,
      [name]: fieldErrors[name as keyof IUserProps] || "", // Asegurar que siempre se asigna un string
    }));
  };

  const validateRegisterUserForm = (data: IUserProps): IUserProps => {
    const errors: IUserProps = {
      name: "",
      email: "",
      password: "",
      phone: "",
    };

    // Validación del nombre
    if (!data.name) {
      errors.name = "El nombre es obligatorio";
    } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(data.name)) {
      errors.name = "El nombre solo puede contener letras y espacios";
    }

    // Validación del email
    if (!data.email) {
      errors.email = "El email es obligatorio";
    } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(data.email)) {
      errors.email = "El email no es válido";
    }

    // Validación de la contraseña
    if (!data.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/.test(data.password)
    ) {
      errors.password =
        "La contraseña debe tener entre 8 y 15 caracteres, incluyendo al menos una mayúscula, una minúscula y un número";
    }

    // Validación del teléfono
    if (!data.phone) {
      errors.phone = "El teléfono es obligatorio";
    } else if (!/^\d{7,14}$/.test(data.phone)) {
      errors.phone = "El teléfono debe tener entre 7 y 14 dígitos";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateRegisterUserForm(dataUser);
    setError(errors);

    // Mark all fields as touched to show errors
    setTouched({
      name: true,
      email: true,
      password: true,
      phone: true,
    });

    // If there are errors, don't proceed with the submission
    if (Object.values(errors).some((x) => x !== "")) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiURL}/auth/signup`, dataUser, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta se ha creado correctamente.',
        });
  
        // Redirigir al usuario o realizar otras acciones después del registro exitoso
        Router.push('/login');
      } else {
        // Manejar respuestas no exitosas del servidor
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: response.data.message || 'Ha ocurrido un error inesperado.',
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // Manejar errores de Axios con respuesta del servidor
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: error.response.data.message || 'Ha ocurrido un error inesperado.',
        });
      } else {
        // Manejar otros tipos de errores
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = Object.values(error).some((x) => x !== "");

  return (
    <>
      <div className="relative flex justify-center items-center font-sans h-full min-h-screen p-4">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/back.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 font-sans max-w-7xl mx-auto">
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.7)", // Más transparente
                padding: 4,
                borderRadius: 2,
                boxShadow: "0 2px 16px -3px rgba(6, 81, 237, 0.3)",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "teal" }}></Avatar>
              <Typography component="h1" variant="h5" color="teal">
                Registro
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Nombre y Apellido"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={dataUser.name}
                  onChange={handleChange}
                  error={!!error.name}
                  helperText={error.name}
                  InputLabelProps={{ style: { color: "teal" } }} // Color teal
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={dataUser.email}
                  onChange={handleChange}
                  error={!!error.email}
                  helperText={error.email}
                  InputLabelProps={{ style: { color: "teal" } }} // Color teal
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Contraseña"
                  name="password"
                  autoComplete="new-password"
                  value={dataUser.password}
                  onChange={handleChange}
                  error={!!error.password}
                  helperText={error.password}
                  InputLabelProps={{ style: { color: "teal" } }} // Color teal
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <MdVisibilityOff />
                          ) : (
                            <MdVisibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  label="Teléfono"
                  name="phone"
                  autoComplete="phone"
                  value={dataUser.phone}
                  onChange={handleChange}
                  error={!!error.phone}
                  helperText={error.phone}
                  InputLabelProps={{ style: { color: "teal" } }} // Color teal
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 1,
                    backgroundColor: "teal",
                    "&:hover": {
                      backgroundColor: "darkslategray", // Color teal más oscuro en hover
                    },
                  }}
                  disabled={isDisabled || loading}
                >
                  {loading ? "Registrando..." : "Registrarse"}
                </Button>
                <Link href="/" passHref>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 1,
                      mb: 2,
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "gray",
                        border: "1px solid gray",
                        color: "white",
                      },
                      border: "1px solid black",
                      boxShadow: "none",
                      color: "black",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faHouse}
                      style={{
                        marginRight: "10px",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    Volver al Inicio
                  </Button>
                </Link>
                <Button
                  onClick={handleReset}
                  fullWidth
                  sx={{ mt: 1, mb: 2, borderColor: "teal", color: "teal" }}
                >
                  Borrar Formulario
                </Button>
              </Box>
            </Box>
          </Container>
        </div>
        <div className="absolute bottom-1 left-1">
          <Image src="/logoblanco.png" alt="Logo" width={300} height={300} />{" "}
          {/* Ajusta el tamaño según sea necesario */}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default RegisterUser;