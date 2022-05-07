import React from "react";

const DropDownLayout = (props) => {
  const { elements, label, open, active, placeholder, value } = props;
  // console.log('eeeeeeeeeeeeeeste es el    -- D R O P _ D O W N --', props
  return (
    <div className="containerInputComponent" >
      <p className="labelText fuente">{label}</p>
      <div 
      className={`inputContainer2 inputDropDown_ ${active ? "inputActivado" : ""}`} 
      data-drop_down 
      data-value={value}
      onClick={props.abrir}>
        <div
          className={`InputDropDown ${active ? "activeText" : ""}`}>
          {placeholder}
          <div
            className={`InputDesplegable ${open ? "Idesplegado" : ""}`}
            style={{ height: open ? `${elements.length * 45}px` : "0px" }}
          >
            {elements.map((element, id) => {
                      console.log('-- D R O P _ D O W N -- elements ==>', element)
              return (
                <p
                  key={id}
                  data-value={element.value}
                  data-ui_name={element.ui_name}
                  onClick={props.selectItem}
                  className={`${element?.enabled ? 'enabledEl' : 'disabledEl'}`}
                >
                  {element.ui_name}{" "}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDownLayout;
