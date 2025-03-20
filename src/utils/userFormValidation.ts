import { IUserProps, IUserErrorProps } from "@/interfaces/IUser";
export function validateRegisterUserForm(values: IUserProps): IUserErrorProps {
  let errors: IUserErrorProps = {
    name: "",
    email: "",
    password: "",
    phone: "",
    lastname: "",
      province: "",
      locality: "",
      street: "",
      number: "",
zipCode: "",
arca_identification: "",
cuit: "",
  };

  // Validaciones del nombre
  if (!values.name.trim()) {
    errors.name = "El campo nombre y apellido es requerido";
  }

  // Validaciones del email
  if (!values.email.trim()) {
    errors.email = "El campo email es requerido";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "El email es inválido";
  }

  // Validaciones del teléfono
  if (!values.phone) {
    errors.phone = "El campo teléfono es requerido";
  } else if (values.phone.startsWith("0")) {
    errors.phone = "El número de teléfono no puede empezar con 0";
  }

  // Validaciones de la contraseña
  if (!values.password.trim()) {
    errors.password = "El campo password es requerido";
  } else if (values.password.length < 6) {
    errors.password = "La contraseña debe tener al menos 6 caracteres";
  }

  // Validaciones de la dirección
  if (!values.province) {
    errors.province = "El campo provincia es requerido";
  }
  if (!values.locality.trim()) {
    errors.locality = "El campo localidad es requerido";
  }
  if (!values.street.trim()) {
    errors.street = "El campo dirección es requerido";
  }
 

  return errors;
}