"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  CssBaseline,
  TextField,
  Typography,
  Container,
  Box,
  Avatar,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";
import Swal from "sweetalert2";

const theme = createTheme();

const ForgotPassword: React.FC = () => {
  const Router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Por favor, introduce un correo electrónico válido.");
      return;
    } else {
      setEmailError(""); // Limpia el mensaje de error si el correo es válido
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Correo enviado!",
          text: "Revisa tu correo electrónico para restablecer tu contraseña.",
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          Router.push("/login");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo enviar el correo. Por favor, intenta de nuevo.",
        });
      }
    } catch (error) {
      console.error("Error during fetch:", error); // Verifica si hay errores en la petición
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
      });
    }
  };

  // Ocultar Navbar y Footer
  const showHeaderFooter = false;

  return (
    <ThemeProvider theme={theme}>
      <div className="relative flex justify-center items-center font-sans h-full min-h-screen p-4">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/roaster.mp4" type="video/mp4" />
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
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                padding: 4,
                borderRadius: 2,
                boxShadow: "0 2px 16px -3px rgba(6, 81, 237, 0.3)",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "teal" }}></Avatar>
              <Typography component="h1" variant="h5" color="teal">
                Restablecer Contraseña
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
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  InputLabelProps={{ style: { color: "teal" } }}
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
                      backgroundColor: "darkslategray",
                    },
                  }}
                >
                  Enviar Enlace de Restablecimiento
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "teal",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "darkslategray",
                    },
                  }}
                  onClick={() => Router.push("/login")}
                >
                  Volver a Iniciar Sesión
                </Button>
              </Box>
            </Box>
          </Container>
        </div>
      </div>
      <div className="absolute bottom-1 left-1 hidden md:block">
        <Image
          src="/logoblanco.png"
          alt="Logo"
          width={300}
          height={300}
          className="w-[300px] h-[300px]"
        />
      </div>
    </ThemeProvider>
  );
};

export default ForgotPassword;