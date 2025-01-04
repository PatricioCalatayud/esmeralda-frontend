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
import { IUserProps, IUserErrorProps } from "@/interfaces/IUser";

// Verificar si apiURL está definida correctamente
const apiURL = process.env.NEXT_PUBLIC_API_URL;
console.log("API URL:", apiURL);

const provinceMapping: Record<number, string> = {
  1: "Buenos Aires",
  2: "Córdoba",
  3: "Catamarca",
  4: "Chaco",
  5: "Chubut",
  6: "Corrientes",
  7: "Entre Ríos",
  8: "Formosa",
  9: "Jujuy",
  10: "La Pampa",
  11: "La Rioja",
  12: "Mendoza",
  13: "Misiones",
  14: "Neuquén",
  15: "Río Negro",
  16: "Salta",
  17: "San Juan",
  18: "San Luis",
  19: "Santa Cruz",
  20: "Santa Fe",
  21: "Santiago del Estero",
  22: "Tierra del Fuego",
  23: "Tucumán",
  24: "Ciudad Autónoma de Buenos Aires",
};
const arcaIdentificationsMapping = {
  "Inscripto responsable": "Inscripto responsable",
  "Inscripto no responsable": "Inscripto no responsable",
  "Consumidor final": "Consumidor final",
  "Monotributista": "Monotributista",
  "Exento": "Exento",
  "Sujeto no alcanzado": "Sujeto no alcanzado",

}

const RegisterUser = () => {
  const Router = useRouter();

  const initialUserData: IUserProps = {
    name: "",
    email: "",
    password: "",
    street: "",
    number: 0,
    zipCode: "",
    locality: "",
    province: "",
    arca_identification: "",
    cuit: 0,
    phone: "",
  };

  const initialErrorState: IUserErrorProps = {
    name: "",
    email: "",
    password: "",
    street: "",
    number: "",
    zipCode: "",
    locality: "",
    province: "",
    arca_identification: "",
    cuit: "",
    phone: "",
  };

  const [dataUser, setDataUser] = useState<IUserProps>(initialUserData);
  const [error, setError] = useState<IUserErrorProps>(initialErrorState);
  const [loading, setLoading] = useState(false);
  const [provinces] = useState(
    Object.keys(provinceMapping).map((key) => ({
      value: Number(key),
      label: provinceMapping[Number(key)],
    }))
  );
  const [arcaIdentifications] = useState(
    Object.keys(arcaIdentificationsMapping).map((key) => ({
      value:key,
      label: key,
    }))
  );
  const [localities, setLocalities] = useState<{ value: string; label: string }[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [loadingLocalities, setLoadingLocalities] = useState(false); // Estado de carga para localidades
  const [showPassword, setShowPassword] = useState(false);

  // Validación dinámica con useEffect
  useEffect(() => {
    const errors = validateRegisterUserForm(dataUser);
    setError(errors);
    console.log("Validando los datos del usuario en useEffect:", dataUser);
  }, [dataUser]);

  // Cargar localidades cuando se selecciona una provincia
  useEffect(() => {
    if (selectedProvince) {
      const fetchLocalities = async (provinceId: number) => {
        try {
          setLoadingLocalities(true); // Inicia el estado de carga
          const provinceName = provinceMapping[provinceId];

          const response = await axios.get(
            `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provinceName}&max=5000`
          );

          if (response.data && response.data.localidades.length > 0) {
            const localitiesList = response.data.localidades.map((locality: any) => ({
              value: locality.nombre,
              label: locality.nombre,
            }));
            setLocalities(localitiesList);
            console.log("Localidades cargadas:", localitiesList); // Verifica que las localidades se cargan correctamente
          } else {
            Swal.fire({
              icon: "info",
              title: "Sin localidades",
              text: "No se encontraron localidades para la provincia seleccionada.",
            });
          }
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Error en la solicitud",
            text: `Error: ${error.response?.data.message || error.message}`,
          });
        } finally {
          setLoadingLocalities(false); // Finaliza el estado de carga
        }
      };

      fetchLocalities(selectedProvince);
    }
  }, [selectedProvince]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleReset = (): void => {
    setDataUser(initialUserData);
    setError(initialErrorState);
    setSelectedProvince(null);
    setLocalities([]);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "province") {
      const provinceValue = Number(value);
  
      setSelectedProvince(provinceValue);
      setDataUser((prevDataUser) => ({
        ...prevDataUser,
        province: provinceMapping[provinceValue],
      }));
    } else if (name === "cuit") {
      // Si el campo es CUIT, convierte el valor a número
      setDataUser((prevDataUser) => ({
        ...prevDataUser,
        cuit: Number(value), // Conversión explícita a número
      }));
    }else if (name === "number") {
      // Si el campo es CUIT, convierte el valor a número
      setDataUser((prevDataUser) => ({
        ...prevDataUser,
        number: Number(value), // Conversión explícita a número
      }));
    } else {
      setDataUser((prevDataUser) => ({
        ...prevDataUser,
        [name]: value,
      }));
    }
  };

console.log(dataUser);

  const validateRegisterUserForm = (data: IUserProps): IUserErrorProps => {
    const errors: IUserErrorProps = {
      name: "",
      email: "",
      password: "",
      street: "",
      number: "",
      zipCode: "",
      locality: "",
      province: "",
      arca_identification: "",
      cuit: "",
      phone: "",
    };
  
    // Validación del nombre
    if (!data.name) {
      errors.name = "El nombre es obligatorio";
      console.log("Error en nombre:", errors.name);
    } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(data.name)) {
      errors.name = "El nombre solo puede contener letras y espacios";
      console.log("Error en nombre (formato):", errors.name);
    }
  
    // Validación del email
    if (!data.email) {
      errors.email = "El email es obligatorio";
      console.log("Error en email:", errors.email);
    } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(data.email)) {
      errors.email = "El email no es válido";
      console.log("Error en email (formato):", errors.email);
    }
  
    // Validación de la contraseña
    if (!data.password) {
      errors.password = "La contraseña es obligatoria";
      console.log("Error en contraseña:", errors.password);
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/.test(data.password)) {
      errors.password = "La contraseña debe tener entre 8 y 15 caracteres, incluyendo al menos una mayúscula, una minúscula y un número";
      console.log("Error en contraseña (formato):", errors.password);
    }
  
    // Validación del teléfono
    if (!data.phone) {
      errors.phone = "El teléfono es obligatorio";
      console.log("Error en teléfono:", errors.phone);
    } else if (!/^\d{7,14}$/.test(data.phone)) {
      errors.phone = "El teléfono debe tener entre 7 y 14 dígitos";
      console.log("Error en teléfono (formato):", errors.phone);
    }

    if (!data.number) {
      errors.number = "El número es obligatorio";
      console.log("Error en número:", errors.number);
    }

    if (!data.arca_identification) {
      errors.arca_identification = "La identificación ARCA es obligatoria";
      console.log("Error en identificación ARCA:", errors.arca_identification);
    }
  
    if (!data.cuit) {
      errors.cuit = "El CUIT es obligatorio";
      console.log("Error en CUIT:", errors.cuit);
    }
  
    // Validación de la dirección
    if (!data.street) {
      errors.street = "La dirección es obligatoria";
      console.log("Error en dirección:", errors.street);
    }
  
    if (!data.province) {
      errors.province = "La provincia es obligatoria";
      console.log("Error en provincia:", errors.province);
    }
  
    if (!data.locality) {
      errors.locality = "La localidad es obligatoria";
      console.log("Error en localidad:", errors.locality);
    }
  
    if (!data.zipCode) {
      errors.zipCode = "El código postal es obligatorio";
      console.log("Error en código postal:", errors.zipCode);
    }
  
    // Imprimir el objeto completo de errores para revisar
    console.log("Errores generados en la validación:", errors);
  
    return errors;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("Enviando datos del formulario");
    console.log("Datos del usuario antes de enviar:", dataUser);
  
    // Obtener errores después de validar
    const errors = validateRegisterUserForm(dataUser);
    setError(errors);
  
    // Verificar si hay errores en cualquier campo
    const hasErrors = Object.values(errors).some((errorValue) => {
      if (typeof errorValue === "object") {
        return Object.values(errorValue).some((fieldError) => fieldError !== "");
      }
      return errorValue !== "";
    });
  
    if (hasErrors) {
      console.log("Errores detectados. No se envía el formulario.");
      Swal.fire({
        icon: "error",
        title: "Error en el formulario",
        text: "Por favor, revisa los campos y corrige los errores.",
      });
      return;
    }
  
    Swal.fire({
      title: 'Procesando...',
      text: 'Estamos registrando tu cuenta, por favor espera.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    setLoading(true);
  
    try {
      console.log("Haciendo la petición POST a la API");
      const response = await axios.post(`${apiURL}/auth/signup`, dataUser, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      Swal.close();
  
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Tu cuenta se ha creado correctamente.",
        });
        localStorage.setItem("idUser", response.data.id);
        Router.push("/emailVerify");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: response.data.message || "Ha ocurrido un error inesperado.",
        });
      }
    } catch (error: any) {
      Swal.close();
      console.log("Error capturado en el catch:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: error.response?.data.message || "Ha ocurrido un error inesperado.",
      });
    } finally {
      setLoading(false);
    }
  };
  const isDisabled = error.name!=="" || error.email!=="" || error.password!=="" || error.phone!=="" || error.street!=="" || error.number!=="" || error.zipCode!=="" || error.locality!=="" || error.province!=="" || error.arca_identification!=="" || error.cuit!==""  
console.log(isDisabled);
  return (
    <>
      <div className="relative flex justify-center items-center font-sans h-full min-h-screen p-4">
        <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover">
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
              <form onSubmit={handleSubmit} noValidate>
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
                <div className="grid grid-cols-2 gap-4">
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
                  id="phone"
                  label="Teléfono"
                  name="phone"
                  value={dataUser.phone}
                  onChange={handleChange}
                  error={!!error.phone}
                  helperText={error.phone}
                  InputLabelProps={{ style: { color: "teal" } }}
                />
                </div>
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
                  autoComplete="current-password"
                />
                
                <div className="grid grid-cols-2 gap-4">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="street"
                  label="Dirección"
                  name="street"
                  value={dataUser.street}
                  onChange={handleChange}
                  error={!!error.street}
                  helperText={error.street}
                  InputLabelProps={{ style: { color: "teal" } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="number"
                  label="Número"
                  name="number"
                  value={dataUser.number===0 ? "" : dataUser.number}
                  onChange={handleChange}
                  error={!!error.number}
                  helperText={error.number}
                  InputLabelProps={{ style: { color: "teal" } }}
                />
                </div>
                <TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="province"
                  label="Provincia"
                  name="province"
                  value={selectedProvince}
                  onChange={handleChange}
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

                {/* Mostrar el spinner o las localidades */}
                {loadingLocalities ? (
                  <Typography align="center" sx={{ color: "teal" }}>
                    Cargando localidades...
                  </Typography>
                ) : (
                  selectedProvince && (
                    <div className="grid grid-cols-2 gap-4">
                    <TextField
                      select
                      margin="normal"
                      required
                      fullWidth
                      id="locality"
                      label="Localidad"
                      name="locality"
                      value={dataUser.locality}
                      onChange={handleChange}
                      error={!!error.locality}
                      helperText={error.locality}
                      InputLabelProps={{ style: { color: "teal" } }}
                    >
                      {localities.map((option, index) => (
                        <MenuItem key={`${option.value}-${index}`} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="zipCode"
                  label="Codigo Postal"
                  name="zipCode"
                  value={dataUser.zipCode}
                  onChange={handleChange}
                  error={!!error.zipCode}
                  helperText={error.zipCode}
                  InputLabelProps={{ style: { color: "teal" } }}
                />
                    </div>
                  )
                )}
                <div className="grid grid-cols-2 gap-4">
                <TextField
                
                  margin="normal"
                  required
                  fullWidth
                  id="cuit"
                  label="CUIL/CUIT"
                  name="cuit"
                  value={dataUser.cuit===0 ? "" :dataUser.cuit}
                  onChange={handleChange}
                  error={!!error.cuit}
                  helperText={error.cuit}
                  InputLabelProps={{ style: { color: "teal" } }}
                />
<TextField
                  select
                  margin="normal"
                  required
                  fullWidth
                  id="arca_identification"
                  label="condición frente al iva"
                  name="arca_identification"
                  value={dataUser.arca_identification}
                  onChange={handleChange}
                  error={!!error.arca_identification}
                  helperText={error.arca_identification}
                  InputLabelProps={{ style: { color: "teal" } }}
                >
                  {arcaIdentifications.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
</div>
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
                <Button onClick={handleReset} fullWidth sx={{ mt: 1, mb: 2, borderColor: "teal", color: "teal" }}>
                  Borrar Formulario
                </Button>
              </form>
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