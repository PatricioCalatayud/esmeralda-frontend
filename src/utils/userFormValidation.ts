import { IUserProps, IUserErrorProps } from "@/interfaces/IUser";
export function validateRegisterUserForm(values: IUserProps): IUserErrorProps {
  let errors: IUserErrorProps = {
    name: "",
    email: "",
    password: "",
    phone: "",
    address: {
      province: "",
      localidad: "",
      deliveryNumber: "",
      address: ""
    }
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
  if (!values.address.province) {
    errors.address.province = "El campo provincia es requerido";
  }
  if (!values.address.localidad.trim()) {
    errors.address.localidad = "El campo localidad es requerido";
  }
  if (!values.address.address.trim()) {
    errors.address.address = "El campo dirección es requerido";
  }
  if (!values.address.deliveryNumber) {
    errors.address.deliveryNumber = "El campo número de entrega es requerido";
  }

  return errors;
}