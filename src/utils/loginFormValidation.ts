import { ILoginErrorProps, ILoginProps } from "@/interfaces/ILogin";

export function validateLoginForm(values: ILoginProps): ILoginErrorProps {
  let errors: ILoginProps = {
    email: "",
    password: "",
  };

  if (!values.email.trim()) {
    errors.email = "El campo correo es requerido";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "El correo es inválido";
  }

  if (!values.password.trim()) {
    errors.password = "El campo contraseña es requerido";
  } else if (values.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  return errors;
}
