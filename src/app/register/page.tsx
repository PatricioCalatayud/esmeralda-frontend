"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { IconButton, InputAdornment } from "@mui/material";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Link from "next/link";
import axios from "axios";
import { IUserProps } from "@/interfaces/IUser";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const RegisterUser = () => {
  const Router = useRouter();

  const initialUserData: IUserProps = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    province: "",
    locality: "",
  };

  const initialErrorState: IUserProps = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    province: "",
    locality: "",
  };

  const [dataUser, setDataUser] = useState<IUserProps>(initialUserData);
  const [error, setError] = useState<IUserProps>(initialErrorState);
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([]);
  const [localities, setLocalities] = useState<{ value: string; label: string }[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    phone: false,
    address: false,
    province: false,
    locality: false,
    account: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Fetch provinces from the API
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://apis.datos.gob.ar/georef/api/provincias");
        const provincesList = response.data.provincias.map((province: any) => ({
          value: province.id,
          label: province.nombre,
        }));
        setProvinces(provincesList);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleReset = (): void => {
    setDataUser(initialUserData);
    setError(initialErrorState);
    setSelectedProvince(null); // Reset province and locality fields
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const fieldErrors = validateRegisterUserForm({
      ...dataUser,
      [name]: value,
    });

    setError((prevError) => ({
      ...prevError,
      [name]: fieldErrors[name as keyof IUserProps] || "",
    }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProvince(e.target.value);
    setDataUser({
      ...dataUser,
      province: e.target.value,
      locality: "", // Reset locality when province changes
    });

    const fetchLocalities = async (provinceId: string) => {
      try {
        const response = await axios.get(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${provinceId}&max=5000`);
        const localitiesList = response.data.localidades.map((locality: any) => ({
          value: locality.id,
          label: locality.nombre,
        }));
        setLocalities(localitiesList);
      } catch (error) {
        console.error("Error fetching localities:", error);
      }
    };

    fetchLocalities(e.target.value);
  };

  const handleLocalityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataUser({
      ...dataUser,
      locality: e.target.value,
    });
  };

  const validateRegisterUserForm = (data: IUserProps): IUserProps => {
    const errors: IUserProps = {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      province: "",
      locality: "",
    };

    if (!data.name) {
      errors.name = "El nombre es obligatorio";
    } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(data.name)) {
      errors.name = "El nombre solo puede contener letras y espacios";
    }

    if (!data.email) {
      errors.email = "El email es obligatorio";
    } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(data.email)) {
      errors.email = "El email no es válido";
    }

    if (!data.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/.test(data.password)) {
      errors.password =
        "La contraseña debe tener entre 8 y 15 caracteres, incluyendo al menos una mayúscula, una minúscula y un número";
    }

    if (!data.phone) {
      errors.phone = "El teléfono es obligatorio";
    } else if (!/^\d{7,14}$/.test(data.phone)) {
      errors.phone = "El teléfono debe tener entre 7 y 14 dígitos";
    }

    if (!data.address) {
      errors.address = "La dirección es obligatoria";
    }

    if (!data.province) {
      errors.province = "La provincia es obligatoria";
    }

    if (!data.locality) {
      errors.locality = "La localidad es obligatoria";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateRegisterUserForm(dataUser);
    setError(errors);

    setTouched({
      name: true,
      email: true,
      password: true,
      phone: true,
      address: true,
      province: true,
      locality: true,
      account: true,
    });

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
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Tu cuenta se ha creado correctamente.",
        });

        Router.push("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: response.data.message || "Ha ocurrido un error inesperado.",
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: error.response?.data.message || "Ha ocurrido un error inesperado.",
      });
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
                Registro
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Nombre y Apellido"
                  name="name"
                  value={dataUser.name}
                  onChange={handleChange}
                  error={!!error.name}
                  helperText={error.name}
                  InputLabelProps={{ style: { color: "teal" } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  value={dataUser.email}
                  onChange={handleChange}
                  error={!!error.email}
                  helperText={error.email}
                  InputLabelProps={{ style: { color: "teal" } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Contraseña"
                  name="password"
                  value={dataUser.password}
                  onChange={handleChange}
                  error={!!error.password}
                  helperText={error.password}
                  InputLabelProps={{ style: { color: "teal" } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
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
                  value={dataUser.phone}
                  onChange={handleChange}
                  error={!!error.phone}
                  helperText={error.phone}
                  InputLabelProps={{ style: { color: "teal" } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="address"
                  label="Dirección"
                  name="address"
                  value={dataUser.address}
                  onChange={handleChange}
                  error={!!error.address}
                  helperText={error.address}
                  InputLabelProps={{ style: { color: "teal" } }}
                />
                <TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="province"
                  label="Provincia"
                  name="province"
                  value={dataUser.province}
                  onChange={handleProvinceChange}
                  error={!!error.province}
                  helperText={error.province}
                  InputLabelProps={{ style: { color: "teal" } }}
                >
                  {provinces.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                {selectedProvince && (
                  <TextField
                    select
                    margin="normal"
                    required
                    fullWidth
                    id="locality"
                    label="Localidad"
                    name="locality"
                    value={dataUser.locality}
                    onChange={handleLocalityChange}
                    error={!!error.locality}
                    helperText={error.locality}
                    InputLabelProps={{ style: { color: "teal" } }}
                  >
                    {localities.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 1,
                    backgroundColor: "teal",
                    "&:hover": {
                      backgroundColor: "darkslategray",
                    },
                  }}
                  disabled={isDisabled || loading}
                >
                  {loading ? "Registrando..." : "Registrarse"}
                </Button>
                <Link href="/" passHref>
                  <Button
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
          <Image src="/logoblanco.png" alt="Logo" width={300} height={300} />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default RegisterUser;