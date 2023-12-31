const settings = {
  "security_center": [
    {
      "id": 2,
      "name": "email",
      "email": [
        {
          "id": 1,
          "name": "email",
          "label": "Correo electrónico",
          "description": "Confirma tu correo electrónico como respaldo en caso de pérdida de tu contraseña, éste podrá ser utilizado para recuperar el acceso de tu cuenta.",
          "verify": false,
          "cta_primary": "Verificar",
          "cta_secondary": "Verificado",
          "tree": false,
          "available": true
        }
      ]
    },
    {
      "id": 1,
      "name": "identity",
      "identity": [
        {
          "id": 1,
          "name": "identity",
          "label": "Verificación de identidad",
          "description": "La verificación de identidad es obligatoria para cumplir con las normativas vigentes",
          "verify": true,
          "cta_primary": "Verificar",
          "cta_secondary": "Verificado",
          "tree": false,
          "available": true,
          "type": "identity"
        }
      ]
    },
    {
      "id": 3,
      "name": "2auth",
      "2auth": [
        {
          "id": 1,
          "name": "2auth",
          "label": "Segundo factor de autenticación 2FA",
          "description": "Protege tu cuenta agregando una capa de seguridad adicional con tu dispositivo móvil",
          "verify": true,
          "cta_primary": "Habilitar",
          "cta_secondary": "Deshabilitar",
          "tree": false,
          "available": true
        }
      ]
    }
  ],
  "global_settings": [
    {
      "id": 1,
      "country": [
        {
          "id": 1,
          "name": "country",
          "label": "País actual",
          "description": "Selecciona el país desde el que estas operando actualmente.",
          "verify": true,
          "cta_primary": "Colombia",
          "cta_secondary": "Cambiar",
          "tree": true,
          "available": true,
          "treeButton": true,
          "classic_view": true
        }
      ]
    },
    {
      "id": 2,
      "languaje": [
        {
          "id": 2,
          "name": "languaje",
          "label": "Idioma",
          "description": "Selecciona el idioma con el que deseas comunicarte en coinsenda.",
          "verify": true,
          "cta_primary": "Español",
          "cta_secondary": "Cambiar",
          "tree": true,
          "available": false,
          "treeButton": true,
          "classic_view": true
        }
      ]
    },
    {
      "id": 3,
      "currency": [
        {
          "id": 3,
          "name": "currency",
          "label": "Moneda de cotización",
          "description": "Selecciona en cual divisa ver las cotizaciones en coinsenda (Moneda local / USD / BTC)",
          "verify": true,
          "cta_primary": "COP",
          "cta_secondary": "Cambiar",
          "tree": true,
          "available": true,
          "treeButton": true,
          "classic_view": true
        }
      ]
    },
    {
      "id": 4,
      "phone": [
        {
          "id": 4,
          "name": "phone",
          "label": "Número Móvil",
          "description": "Agregalo como metodo de respaldo adicional y monitoréa tu cuenta por medio de SMS desde tu telefono movil.",
          "verify": true,
          "cta_primary": "+57 315 608 44 66",
          "cta_secondary": "Cambiar",
          "tree": true,
          "available": true,
          "treeButton": true,
          "classic_view": true
        }
      ]
    },
    {
      "id": 5,
      "pass": [
        {
          "id": 5,
          "name": "pass",
          "label": "Contraseña",
          "description": "Cambia y administra tu constraseña de acceso",
          "verify": true,
          "cta_primary": "Cambiar",
          "cta_secondary": "Nuevo",
          "tree": true,
          "available": true,
          "treeButton": true,
          "classic_view": true
        }
      ]
    },
    {
      "id": 6,
      "payment": [
        {
          "id": 6,
          "name": "payment",
          "label": "Metodos de pago",
          "description": "Gestiona multiples medios de pago",
          "verify": true,
          "cta_primary": "Inhabilitado",
          "cta_secondary": "Inhabilitado",
          "tree": true,
          "available": false,
          "treeButton": true,
          "classic_view": true
        }
      ]
    },
    {
      "id": 7,
      "address_book": [
        {
          "id": 7,
          "name": "address_book",
          "label": "Agenda de direcciones",
          "description": "Gestiona y administra tu agenda de direcciones para hacer depositos y envíos crypto.",
          "verify": true,
          "cta_primary": "Inhabilitado",
          "cta_secondary": "Inhabilitado",
          "tree": true,
          "available": false,
          "treeButton": true,
          "classic_view": true
        }
      ]
    },
    {
      "id": 8,
      "theme": [
        {
          "id": 8,
          "name": "theme",
          "label": "Tema Gráfico",
          "description": "Selecciona el tema visual para tu interfaz coinsenda.",
          "verify": true,
          "cta_primary": "Inhabilitado",
          "cta_secondary": "Cambiar",
          "tree": true,
          "available": false,
          "treeButton": true,
          "classic_view": true
        }
      ]
    }
  ]
}

export default settings