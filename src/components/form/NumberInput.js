import React, { useRef, useState, useEffect } from "react";

const removeCommas = (value) => {
  return value ? value.replace(/,/g, "") : "";
};

const inputNumberFormat = (value) => {
  const parts = removeCommas(value).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export default function NumberInput(props) {
  const inputRef = useRef();
  const [value, setValue] = useState(inputNumberFormat(props.value) || "");
  const [caretPos, setCaretPos] = useState([0, 0]);

  const handleChange = (event) => {
    const value = String(event.target.value);
    const isValid = /^[0-9,.]*$/.test(value);
    if (!isValid) {
      return;
    }
    const cursor = event.target.selectionEnd || 0;

    let newValue = value || "";
    newValue = inputNumberFormat(newValue);
    if (props.onChange) {
      props.onChange(event);
    }

    setValueAndCaretPos(newValue, value, cursor);
  };

  const setValueAndCaretPos = (value, prevValue, cursorPos) => {
    const rightCharsCount = prevValue.length - cursorPos;
    const toSetPosition = Math.max(value.length - rightCharsCount, 0);
    setValue(value);
    setCaretPos([toSetPosition, toSetPosition]);
  };

  const keyDownHandler = (event) => {
    if (event.keyCode === 8 || event.key === "Backspace") {
      const currentValue = event.currentTarget.value;
      const cursor = event.currentTarget.selectionStart || 0;
      const newPosition = Math.max(cursor - 1, 0);

      if (
        currentValue[newPosition] &&
        currentValue[newPosition].includes(",")
      ) {
        setValueAndCaretPos(currentValue, currentValue, newPosition);
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(...caretPos);
    }
  }, [caretPos]);

  return (
    <input
      ref={inputRef}
      {...props}
      value={value}
      onChange={handleChange}
      onKeyDown={keyDownHandler}
    />
  );
}
