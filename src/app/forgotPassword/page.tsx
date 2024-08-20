"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button, CssBaseline, TextField, Typography, Container, Box, Avatar } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "next/image";
import Swal from "sweetalert2";
import { useState } from "react";

const theme = createTheme();

const ForgotPassword: React.FC = () => {
  const Router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría la lógica para manejar la solicitud de restablecimiento de contraseña
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
    backgroundColor: "teal", // Cambiado a backgroundColor
    color: "white", // Establece el color del texto a blanco
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