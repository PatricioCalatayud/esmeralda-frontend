import { IUserProps } from "@/interfaces/IUser";

export function validateRegisterUserForm(values: IUserProps): IUserProps {
  let errors: IUserProps = {
    name: "",
    email: "",
    password: "",
    //address: "",
    phone: "",
  };

  if (!values.name.trim()) {
    errors.name = "El campo nombre y apellido es requerido";
  }

  if (!values.email.trim()) {
    errors.email = "El campo email es requerido";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "El email es inválido";
  }


  if (!values.phone) {
    errors.phone = "El campo teléfono es requerido";
  } else if (values.phone.startsWith("0")) {
    errors.phone = "El número de teléfono no puede empezar con 0";
  }

  if (!values.password.trim()) {
    errors.password = "El campo password es requerido";
  } else if (values.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  return errors;
}
