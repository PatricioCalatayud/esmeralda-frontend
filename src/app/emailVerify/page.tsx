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
  const [verification_code, setVerification_code] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const idUserString = localStorage.getItem("idUser");
    const userId = idUserString ? Number(idUserString) : null; //
    if (!verification_code) {
      setCodeError("Por favor, introduce un código válido.");
      return;
    } else {
      setCodeError(""); // Limpia el mensaje de error si el correo es válido
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ verification_code, userId }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Código válido",
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(() => {
          Router.push("/login");
        }, 1500);
        localStorage.setItem("idUser", "");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El código no es válido",
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
  const handleResetCode = async (e: React.FormEvent) => {
    e.preventDefault();

    const idUserString = localStorage.getItem("idUser");
    const userId = idUserString ? Number(idUserString) : null;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );


      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "El código ha sido enviado",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El código no puede ser enviado",
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
                Verificar correo electrónico
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
                  id="code"
                  label="Codigo de verificación"
                  name="code"
                  autoFocus
                  value={verification_code}
                  onChange={(e) => setVerification_code(e.target.value)}
                  error={!!codeError}
                  helperText={codeError}
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
                  Enviar codigo de verificación
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
                  onClick={handleResetCode}
                >
                  Volver a enviar el codigo
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
