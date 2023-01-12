import React, { Component } from "react";
import CopyLayout from "./copyLayout";
import { copy } from "utils";
 
import "./copyStyle.css";

class CopyContainer extends Component {
  // @Params
  // valueToCopy => string
  // color => string
  // max_width => number

  render() {
    const { valueToCopy, color, max_width, onlyIcon } = this.props;

    return (
      <CopyLayout
        valor={valueToCopy}
        copy={copy}
        color={color}
        max_width={max_width}
        onlyIcon={onlyIcon}
      />
    );
  }
}

export default CopyContainer;
