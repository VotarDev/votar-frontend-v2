import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { omit } from "lodash";

interface Data {
  [key: string]: string | number;
}

const useForm = (callback: any) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState<Data>({});

  const validate = (
    event: FormEvent<HTMLFormElement>,
    name: string,
    value: string
  ) => {
    switch (name) {
      case "name":
        if (!value.length) {
          setErrors({ ...errors, firstname: "Fistname is required" });
        } else {
          let newObj = omit(errors, "firstname");
          setErrors(newObj);
        }
        break;
      case "username":
        if (!value.length) {
          setErrors({ ...errors, username: "Username is required" });
        } else {
          let newObj = omit(errors, "username");
          setErrors(newObj);
        }
        break;
      case "lastname":
        if (!value.length) {
          setErrors({ ...errors, lastname: "Lastname is required" });
        } else {
          let newObj = omit(errors, "lastname");
          setErrors(newObj);
        }
        break;
      case "phoneNumber":
        if (!value.length) {
          setErrors({ ...errors, phoneNumber: "Phone number is required" });
        } else {
          let newObj = omit(errors, "phoneNumber");
          setErrors(newObj);
        }
        break;
      case "email":
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!value.length) {
          setErrors({ ...errors, email: "Email is required" });
        } else if (!regex.test(value)) {
          setErrors({ ...errors, email: "This is not a valid email format!" });
        } else {
          let newObj = omit(errors, "email");
          setErrors(newObj);
        }
        break;
      case "password":
        if (!value.length) {
          setErrors({ ...errors, password: "Password is required" });
        } else if (value.length < 4) {
          setErrors({
            ...errors,
            password: "Password must be more than 4 characters",
          });
        } else {
          let newObj = omit(errors, "password");
          setErrors(newObj);
        }
        break;
      case "confirmPassword":
        if (!value.length) {
          setErrors({ ...errors, confirmPassword: "Password is required" });
          //@ts-ignore
        } else if (value !== values.password) {
          setErrors({
            ...errors,
            confirmPassword: "Password do not match",
          });
        } else {
          let newObj = omit(errors, "confirmPassword");
          setErrors(newObj);
        }
        break;
      default:
        break;
    }
  };
  const handleChange = (event: any) => {
    const target = event.target as HTMLInputElement;
    let name = target.name;
    let val = target.value;

    validate(event, name, val);

    setValues({
      ...values,
      [name]: val,
    });
  };
  const handleSubmit = (event: any) => {
    if (event) event.preventDefault();
    console.log(Object.keys(errors).length, Object.keys(values).length);
    if (Object.keys(errors).length === 0 && Object.keys(values).length !== 0) {
      callback();
      // const target = event.target as HTMLFormElement;
      // target.reset();
    } else {
      toast.error(
        "There is an Error! Check that all required details are correctly inputed."
      );
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
};

export default useForm;
