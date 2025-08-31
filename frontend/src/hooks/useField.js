import { useState } from "react";

const useField = (defaultText = "") => {
  const [data, setData] = useState(defaultText);
  const [showCaption, setShowCaption] = useState(false);

  const handleChange = (txt) => {
    setData(txt);
  };

  return [data, handleChange, showCaption, setShowCaption];
};

export default useField;
