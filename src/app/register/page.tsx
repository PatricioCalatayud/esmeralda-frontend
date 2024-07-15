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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from "sweetalert2";
import Image from "next/image"; // Importación del componente Image

const theme = createTheme();

interface UserState {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
}

const Register = (): JSX.Element => {
  const initialState: UserState = {
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  };

  const [user, setUser] = useState<UserState>(initialState);
  const [errors, setErrors] = useState<Partial<UserState>>({});
  const router = useRouter();

  const validateUser = (userData: UserState): Partial<UserState> => {
    const errors: Partial<UserState> = {};
    const nameRegExp = /^[A-Za-z\s]+$/;
    const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const addressRegExp = /^[a-zA-Z0-9\s,.'-]{3,}$/;
    const phoneRegExp = /^(\+\d{1,2}\s)?\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/;

    if (!userData.name) errors.name = "Ingresar nombre";
    else if (!nameRegExp.test(userData.name))
      errors.name = "Nombre solo puede incluir letras y espacios.";

    if (!userData.email) errors.email = "Ingresar email";
    else if (!emailRegExp.test(userData.email))
      errors.email = "Ingresa un correo electrónico válido, ejemplo: usuario@dominio.com.";

    if (!userData.password) errors.password = "Ingresar contraseña";
    else if (!passwordRegExp.test(userData.password))
      errors.password =
        "Contraseña necesita 8 caracteres, incluyendo símbolos y números.";

    if (!userData.address) errors.address = "Ingresar dirección";
    else if (!addressRegExp.test(userData.address))
      errors.address =
        "Dirección debe tener mínimo 3 caracteres, usando letras, números y signos.";

    if (!userData.phone) errors.phone = "Ingresar teléfono";
    else if (!phoneRegExp.test(userData.phone))
      errors.phone =
        "Teléfono: mínimo 10 dígitos, solo números y guiones.";

    return errors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
    const newErrors = validateUser({ ...user, [name]: value });
    setErrors(newErrors);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const validationErrors = validateUser(user);
    if (Object.keys(validationErrors).length === 0) {
      Swal.fire({
        icon: "success",
        title: "Usuario validado exitosamente!",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleReset = (): void => {
    setUser(initialState);
    setErrors({});
  };

  return (
    <ThemeProvider theme={theme}>
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
                backgroundColor: "rgba(255, 255, 255, 0.6)", // Más transparente
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
                  label="Nombre"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={user.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputLabelProps={{ style: { color: 'teal' } }} // Color teal
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={user.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputLabelProps={{ style: { color: 'teal' } }} // Color teal
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Contraseña"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={user.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputLabelProps={{ style: { color: 'teal' } }} // Color teal
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="address"
                  label="Dirección"
                  name="address"
                  autoComplete="address"
                  value={user.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  InputLabelProps={{ style: { color: 'teal' } }} // Color teal
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  label="Teléfono"
                  name="phone"
                  autoComplete="phone"
                  value={user.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputLabelProps={{ style: { color: 'teal' } }} // Color teal
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "teal",
                    "&:hover": {
                      backgroundColor: "darkslategray", // Color teal más oscuro en hover
                    },
                  }}
                >
                  Registrarse
                </Button>
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
        <div className="absolute top-1 left-1">
          <Image src="/logoblanco.png" alt="Logo" width={300} height={300} /> {/* Ajusta el tamaño según sea necesario */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Register;