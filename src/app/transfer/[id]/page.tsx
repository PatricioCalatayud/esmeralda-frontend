"use client";
import DashboardAddModifyComponent from "@/components/DashboardComponent/DashboardAdd&ModifyComponent";
import { useAuthContext } from "@/context/auth.context";
import { useCartContext } from "@/context/cart.context";
import { getOrder, putOrderTransaction } from "@/helpers/Order.helper";
import { Modal } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { LoginUser } from "@/helpers/Autenticacion.helper";
import { ILogin, ILoginErrorProps } from "@/interfaces/ILogin";
import { validateLoginForm } from "@/utils/loginFormValidation";
const theme = createTheme();
import Link from "next/link"; 



import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { IconButton } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import {signInWithGoogle} from "@/utils/singGoogle";
import { signInWithFacebook } from "@/utils/singFacebook";

import { jwtDecode } from "jwt-decode";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Transfer = ({ params }: { params: { id: string } }) => {
    const [receiptId, setReceiptId] = useState("");
    const router = useRouter();
    const { token, session, authLoading } = useAuthContext();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
  const {setCartItemCount} = useCartContext();
  const [openModal, setOpenModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState("");
  //! Estado para almacenar los datos del producto


  //! Estado para almacenar los errores
  const [errors, setErrors] = useState({
    imgUrl: "",
  });
  console.log(session);
  useEffect(() => {
    if (!authLoading) {
    if( !session) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes iniciar sesión primero!",
      })
      setTimeout(() => {
        setOpenModal(true);
      }, 2000);
      
    }else{
      setOpenModal(false);
    }}
    const fetchProduct = async () => {
      const response = await getOrder(params.id, token);
      if (response && response.receipt) {
        console.log(response);
        setTotalPrice(response.orderDetail.totalPrice);
        setReceiptId(response.receipt.id);
      }
    };
    fetchProduct();
    
  }, [authLoading]);

  //! Función para manejar los cambios en la imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileType(selectedFile.type);

      // Crear URL de previsualización
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(fileUrl);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      Swal.fire("Error", "Debes seleccionar un archivo.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("id", receiptId);
    formData.append("file", file);

    //! Mostrar alerta de carga mientras se procesa la solicitud
    Swal.fire({
      title: "Agregando comprobante...",
      text: "Por favor espera.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await putOrderTransaction( formData, token);
    console.log(response);
          if (response && ( response.status === 201 || response.status === 200)) {
            Swal.fire({
              icon: "success",
              title: "¡Comprobante agregado!",
              text: "El comprobante ha sido agregado con éxito.",
            }).then(() => {
              localStorage.removeItem("cart");
              setCartItemCount(0);
              router.push("../../dashboard/cliente/order");
            });
          
          // Mostrar alerta de éxito
          
        } else {
          // Mostrar alerta de error
          Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Ha ocurrido un error al agregar el comprobante.",
          });
        }
  };
  //!Validar formulario
  useEffect(() => {
    if (!file) {
      errors.imgUrl = "La imagen es obligatoria";
    } else {
      errors.imgUrl = "";
    }

    // Actualizar los errores del producto en el estado
    setErrors(errors);
  }, []);

  
    const initialUserData: ILogin = {
      email: "",
      password: "",
    };
    const initialErrorState: ILoginErrorProps = {
      email: "",
      password: "",
    };
  
    const [dataUser, setDataUser] = useState<ILogin>(initialUserData);
    const [error, setError] = useState<ILoginErrorProps>(initialErrorState);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [touched, setTouched] = useState<
      Record<keyof ILoginErrorProps, boolean>
    >({
      email: false,
      password: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const{setSession,setUserId,setToken} = useAuthContext();
  
    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const { name, value } = e.target;
  
      setDataUser((prevDataUser) => ({
        ...prevDataUser,
        [name]: value,
      }));
  
      if (!touched[name as keyof ILoginErrorProps]) {
        setTouched((prevTouched) => ({
          ...prevTouched,
          [name]: true,
        }));
      }
  
      const fieldErrors = validateLoginForm({
        ...dataUser,
        [name]: value,
      });
  
      setError((prevError) => ({
        ...prevError,
        [name]: fieldErrors[name as keyof ILoginErrorProps] || "",
      }));
    };
  
    const handleSubmitLogin = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const errors = validateLoginForm(dataUser);
      setError(errors);
  
      setTouched({
        email: true,
        password: true,
      });
  
      if (Object.values(errors).some((x) => x !== "")) {
        return;
      }
  
      setSubmitError(null);
      setLoading(true);
  
      try {
        const response = await LoginUser(dataUser);
        const responseData = response?.data;
        if (response) {
          const decodedToken: any = jwtDecode(responseData.accessToken as string);
          setSession({
            id: decodedToken.sub,
            name: decodedToken.name,
            email: decodedToken.email,
            image: undefined,
            role: decodedToken.roles[0],
            phone: decodedToken.phone,
          })
          setUserId(decodedToken.sub);
          responseData.accessToken && setToken(responseData.accessToken);
          
        }
  
        if (responseData) {
          localStorage.setItem("userSession", JSON.stringify(responseData));
  
          Swal.fire({
            icon: "success",
            title: "¡Bienvenido a La Esmeralda !",
            showConfirmButton: false,
            timer: 1500,
          });
  
          setDataUser(initialUserData);
          setTouched({
            email: false,
            password: false,
          });
  
          setOpenModal(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Usuario o contraseña incorrecta",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error: any) {
        setSubmitError(`Error al iniciar sesión: ${error.message}`);
        toast.error(`Error al iniciar sesión: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
  

  return (
    <div className="p-8">
                  <Modal
              show={openModal}
              onClose={() => setOpenModal(false)}
              className="px-4 py-4 custom-modal-container"

            >

              <Modal.Body className="flex flex-col gap-4">
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
                Iniciar sesión
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmitLogin}
                noValidate
                sx={{ mt: 3 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Correo"
                  name="email"
                  autoComplete="email"
                  autoFocus
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
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  label="Contraseña"
                  name="password"
                  autoComplete="current-password"
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
                <div className="flex flex-wrap items-center gap-4 justify-between mt-4">
                  <div className="text-sm">
                    <Link href="/forgotPassword" className="text-teal-600 font-semibold hover:underline" passHref>
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
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
                >
                  Iniciar sesión
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
                           color:"white"
                         },
                         border: "1px solid black",
                         boxShadow: "none",
                         color: "black",
                       }}
                    >
                      <FontAwesomeIcon icon={faHouse}  style={{ marginRight: "10px", width: "20px", height: "20px"}}/>
                      Volver al Inicio
                    </Button>
                  </Link>
                
                <p className="text-sm mt-8 text-center font-semibold text-gray-800">
                  ¿No tienes cuenta?{" "}
                  <a
                    href="/register"
                    className="text-teal-900 font-bold tracking-wide hover:underline ml-1"
                  >
                    Regístrate Aquí
                  </a>
                </p>
                {submitError && (
                  <p className="text-red-500 mt-4">{submitError}</p>
                )}
                <div>
                  <hr className="border-gray-600 border-2 my-3" />
                </div>
                <div className="space-x-6 flex justify-center mt-2">
                  <button type="button" className="border-none outline-none" onClick={() => signInWithGoogle()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32px"
                      className="inline"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="#fbbd00"
                        d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                        data-original="#fbbd00"
                      />
                      <path
                        fill="#0f9d58"
                        d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                        data-original="#0f9d58"
                      />
                      <path
                        fill="#31aa52"
                        d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                        data-original="#31aa52"
                      />
                      <path
                        fill="#3c79e6"
                        d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                        data-original="#3c79e6"
                      />
                      <path
                        fill="#cf2d48"
                        d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                        data-original="#cf2d48"
                      />
                      <path
                        fill="#eb4132"
                        d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                        data-original="#eb4132"
                      />
                    </svg>
                  </button>
                  <button type="button" className="border-none outline-none" onClick={() => signInWithFacebook()}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32px"
                      fill="#007bff"
                      viewBox="0 0 167.657 167.657"
                    >
                      <path
                        d="M83.829.349C37.532.349 0 37.881 0 84.178c0 41.523 30.222 75.911 69.848 82.57v-65.081H49.626v-23.42h20.222V60.978c0-20.037 12.238-30.956 30.115-30.956 8.562 0 15.92.638 18.056.919v20.944l-12.399.006c-9.72 0-11.594 4.618-11.594 11.397v14.947h23.193l-3.025 23.42H94.026v65.653c41.476-5.048 73.631-40.312 73.631-83.154 0-46.273-37.532-83.805-83.828-83.805z"
                        data-original="#010002"
                      ></path>
                    </svg>
                  </button>
                </div>
                
              </Box>
            </Box>
          </Container>
        </div>
        <ToastContainer />
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
              </Modal.Body>
            </Modal>
      <DashboardAddModifyComponent
        disabled={errors.imgUrl === ""}
        titleDashboard="Agregar comprobante de transferencia"
        backLink="/dashboard/cliente/order"
        buttonSubmitText="Enviar comprobante"
        handleSubmit={handleSubmit}
      >
        <div className="grid gap-4 mb-4 sm:grid-cols-2">
          <div className="mb-4 col-span-full">
            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Comprobante de transferencia
            </span>
            <span className="block mb-2 text-sm font-semibold text-red-800 dark:text-white">
              Monto a transferir: $ {totalPrice}
            </span>
            <div className="flex justify-center items-center w-full ">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col justify-center items-center w-full h-18 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col justify-center items-center pt-5 pb-6 ">
                  <IoCloudUploadOutline />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      Click para subir comprobante
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, PNG, JPG or JPGE (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {!file ? (
              <span className="text-red-500">{errors.imgUrl}</span>
            ) : null}
             {/* Mostrar previsualización */}
        {previewUrl && (
          <div className="preview mt-4 w-full flex justify-center">
            {fileType?.includes("image") ? (
              <Image
                src={previewUrl}
                alt="Preview"
                width={300}
                height={300}
                className="object-contain"
              />
            ) : fileType?.includes("pdf") ? (
              <iframe
                src={previewUrl}
                width="300"
                height="400"
                title="PDF Preview"
                className="border"
              />
            ) : null}
          </div>
        )}
          </div>
        </div>
      </DashboardAddModifyComponent>
    </div>
  );
};
export default Transfer;
