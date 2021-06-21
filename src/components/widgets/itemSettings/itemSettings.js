import React, { Component } from "react";
import SubItemSC from "./subItemSc";
import "./settings.css";
// import Switcher from './settingsSwitch'

class ItemSettings extends Component {
  state = {
    current_item: [],
    lastVerify: null,
  };

  componentDidMount() {
    this.initItem();
  }

  initItem = async () => {
    const { item } = this.props;
    // console.log('||||||||| initItem', item)
    Object.keys(item).forEach(async (item_id) => {
      if (item_id !== "id" && item_id !== "name") {
        let items = item[item_id];
        let lastVerify;

        let items_updated = await this.update_items(items);

        // Encontramos si hay un elemtento verificado en un indice superior, si hay varios solos retornaremos el ultimo verificado que es el que nos interesa para validar estilos.
        for (let i = 0; i < items_updated.length; i++) {
          if (items_updated[i].verify === true) {
            lastVerify = i;
          }
        }

        // console.log('items_updated', this.props)

        await this.setState({
          current_item: items_updated,
          lastVerify: lastVerify,
        });
        // console.log('|||||||||||||||||||||||||||||||||||||||||||||items_updated', this.state)
      }
    });
  };

  update_items = async (items) => {

    const { update_state } = this.props;

    let resul = [];
    // console.log('ITEM SETTINGS items', items)
    items.map(async (item) => {
      let res = await update_state(item);
      // console.log('||||||||| res', res)
      let new_item = {
        ...item,
        ...res,
      };
      // console.log('||||||||| item', new_item)
      return resul.push(new_item);
    });
    return resul;
  };

//   componentDidUpdate(prevProps) {
//   if (prevProps.user.levels !== this.props.user.levels) {
//     this.initItem();
//   }
// }

  render() {
    const { item_action, update_state } = this.props;

    const { current_item, lastVerify } = this.state;

    let index = 0;
    // console.log('||||ItemSecurityCenter', this.props.name)

    return (
      <div
        name={this.props.name}
        className="itemSecurityCenter"
        style={{
          padding:
            current_item[0] && current_item[0].classic_view
              ? "0"
              : "20px 0 20px 0",
        }}
      >
        {current_item.length > 0 &&
          current_item.map((subItem) => {
            index++;
            return (
              <SubItemSC
                subItem={subItem}
                item_action={item_action}
                key={subItem.id}
                index={index}
                totalIndex={current_item.length}
                lastVerify={lastVerify}
                nextVerify={current_item[index] && current_item[index].verify}
                update_state={update_state}
              />
            );
          })}
      </div>
    );
  }
}

export default ItemSettings;
