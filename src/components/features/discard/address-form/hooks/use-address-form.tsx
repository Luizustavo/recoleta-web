import React from "react";
import { useState } from "react";
import { Schema } from "../address-form.schema";

function UseAddressForm() {
  const [address, setAddress] = useState<Schema>({
    zipCode: "",
    city: "",
    neighborhood: "",
    number: "",
    street: "",
    uf: "",
  });

  const [errors, setErros] = useState(false);

}
