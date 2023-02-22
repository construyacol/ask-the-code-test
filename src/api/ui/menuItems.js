
export const MENU_LABELS = {
  withdraw:"Enviar"
}


const menuItems = {
  "navigation_components": {
    "wallets": {
      "items_menu": [
        {
          "title": "Actividad",
          "func": "goTo",
          "link": "activity",
          "available": true,
          "id": 1
        },
        {
          "title": "Depositar",
          "func": "goTo",
          "link": "deposit",
          "available": true,
          "id": 2
        },
        {
          "title": MENU_LABELS?.withdraw,
          "func": "goTo",
          "link": "withdraw",
          "available": true,
          "id": 3
        },
        {
          "title": "Intercambiar",
          "func": "goTo",
          "link": "swap",
          "available": true,
          "id": 4
        }
      ]
    },
    "withdraw_accounts": {
      "items_menu": [
        {
          "title": "Actividad",
          "func": "goTo",
          "link": "activity",
          "available": true,
          "id": 1
        }
      ]
    }
  },
  "menuPrincipal": [
    {
      "text": "Billeteras",
      "icon": "wallet",
      "clave": "wallets",
      "active": true,
      "visible": true,
      "subfix": "B",
      "keyCode": 98,
      "id": "2",
      "device": "desktop"
    },
    {
      "text": "Cuentas de retiro",
      "icon": "withdraw_accounts",
      "clave": "withdraw_accounts",
      "active": true,
      "visible": true,
      "subfix": "C",
      "keyCode": 99,
      "id": "3",
      "device": "desktop"
    },
    {
      "text": "Referidos",
      "icon": "referral",
      "clave": "referral",
      "active": true,
      "visible": true,
      "subfix": "R",
      "keyCode": 114,
      "id": "4",
      "device": "desktop"
    },
    {
      "text": "Ajustes",
      "icon": "settings",
      "clave": "settings",
      "active": true,
      "visible": true,
      "subfix": "S",
      "keyCode": 115,
      "id": "5",
      "device": "desktop"
    },
    {
      "text": "Precios",
      "icon": "prices",
      "clave": "prices",
      "active": true,
      "visible": true,
      "subfix": "P",
      "id": "6",
      "device": "mobile"
    }
  ],
  "menuSuperior": [
    {
      "text": "CERRAR SESIÓN",
      "title": "close",
      "link": "/",
      "icon": "fas fa-sign-out-alt",
      "active": true,
      "visible": true,
      "id": "7"
    },
    {
      "text": "Notificaciones",
      "title": "notification",
      "link": "/",
      "icon": "notification",
      "active": true,
      "visible": true,
      "id": "8"
    },
    {
      "text": "Help",
      "title": "help",
      "link": "/",
      "icon": "far fa-question-circle",
      "active": true,
      "visible": true,
      "id": "9"
    }
  ],
  "coins": [
    {
      "id": 1,
      "type": "coins",
      "name": "bitcoin",
      "code": "btc",
      "type_currency": "crypto",
      "selection": false
    },
    {
      "id": 2,
      "type": "coins",
      "name": "ethereum",
      "code": "eth",
      "type_currency": "crypto",
      "selection": false
    },
    {
      "id": 3,
      "type": "coins",
      "name": "litecoin",
      "code": "ltc",
      "type_currency": "crypto",
      "selection": false
    },
    {
      "id": 4,
      "type": "coins",
      "name": "dash",
      "code": "dash",
      "type_currency": "crypto",
      "selection": false
    },
    {
      "id": 5,
      "type": "coins",
      "name": "pesos colombianos",
      "code": "cop",
      "type_currency": "fiat",
      "selection": false
    },
    {
      "id": 6,
      "type": "coins",
      "name": "usd",
      "code": "usd",
      "type_currency": "fiat",
      "selection": false
    }
  ]
}

export const settingsMenu = {
  kyc:{
    uiName:"Verificación de cuenta",
    value:"kyc"
  },
  // referral:{
  //   uiName:"Referidos",
  //   value:"referral"
  // },
  security:{
    uiName:"Seguridad",
    value:"security"
  }
   
}


export default menuItems