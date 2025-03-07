import React from "react";

/**
 * Função para alterar estado da visivilidade da caixa de texto.
 *
 * @returns passwordVisibility        - Estado da Visibilidade
 * @returns rightIcon                 - O Icon
 * @returns handlePasswordVisibility  - Metodo que altera a Visibilidade
 */
export const useTogglePasswordVisibility = () => {
  const [passwordVisibility, setPasswordVisibility] = React.useState(true);
  const [rightIcon, setRightIcon] = React.useState("eye");

  // Muda o estado do se esta visibel ou não
  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  return {
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility,
  };
};
