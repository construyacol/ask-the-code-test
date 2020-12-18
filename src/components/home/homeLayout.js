import React from "react";
import "./home.css";

// const selectIsSomeModalRendered = createSelector(
//   state => state.ui,
//   state => state.form,
//   state => state.isLoading,
//   (ui, form, isLoading) => {
//     return form.isModalVisible || ui.modal_confirmation.visible || ui.otherModal || ui.modal.render
//   }
// )

const HomeLayout = (props) => {
  // const isSomeModalRendered = useSelector(state => selectIsSomeModalRendered(state))

  return (
    <div className={`HomeLayout`}>
      {/* <div className={`HomeLayout ${isSomeModalRendered ? 'conFirmationM' : ''}`}> */}
      {props.children}
    </div>
  );
};

export default HomeLayout;
