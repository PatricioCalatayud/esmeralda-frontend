"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  FormHelperText,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Image from "next/image";
import Swal from "sweetalert2";

const theme = createTheme();

const ResetPassword: React.FC = () => {
  const Router = useRouter();
  const searchParams = useSearchParams(); 
  const token = searchParams.get('token'); 
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/update-password`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (response.ok) {
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
          text: result.message || "No se pudo cambiar la contraseña. Inténtalo de nuevo.",
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
                {passwordMismatch && (
                  <FormHelperText error>Las contraseñas no coinciden</FormHelperText>
                )}
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