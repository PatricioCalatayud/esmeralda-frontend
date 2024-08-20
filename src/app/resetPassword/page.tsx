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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Image from "next/image";
import Swal from "sweetalert2";

const theme = createTheme();

const ResetPassword: React.FC = () => {
  const Router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí iría la lógica para manejar la solicitud de restablecimiento de contraseña
    // Añade aquí tu llamada al helper o al endpoint
    try {
      // const response = await yourApiHelper.post('/reset-password', { password, confirmPassword });

      // Simulación de respuesta exitosa
      const response = { success: true }; // Cambia esto según la respuesta real de tu API

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "¡Contraseña cambiada con éxito!",
          text: "Tu contraseña ha sido cambiada exitosamente.",
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
          text: "No se pudo cambiar la contraseña. Inténtalo de nuevo.",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con la solicitud. Inténtalo de nuevo.",
        showConfirmButton: true,
      });
    }
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
                  id="password"
                  label="Contraseña"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputLabelProps={{ style: { color: "teal" } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirm-password"
                  label="Confirmar Contraseña"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputLabelProps={{ style: { color: "teal" } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                  Cambiar Contraseña
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

export default ResetPassword;