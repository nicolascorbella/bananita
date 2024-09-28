import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago"; // Mantengo Mercado Pago sin cambios

// Agrega credenciales de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: "TEST-1935091980734919-092313-fb425d565ca6bfba87ca53cc21b75e8c-229579824",
});

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const app = express();
const port = process.env.PORT || 3000; // Puerto dinámico, ideal para Vercel

app.use(cors()); // Para permitir peticiones desde diferentes orígenes
app.use(express.json()); // Para interpretar el cuerpo de las solicitudes en formato JSON

// Configuración para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo 'index.html'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/../index.html')); // Sirve 'index.html' de la carpeta raíz
});

// Ruta para crear la preferencia de Mercado Pago
app.post("/create_preference", async (req, res) => {
  try {
    // Se crean los parámetros para la preferencia
    const body = {
      items: [
        {
          title: req.body.title, // Título del artículo desde la solicitud
          quantity: Number(req.body.quantity), // Cantidad del artículo desde la solicitud
          unit_price: Number(req.body.price), // Precio del artículo desde la solicitud
          currency_id: "ARS", // Moneda en pesos argentinos
        },
      ],
      back_urls: {
        success: "https://www.youtube.com/@onthecode", // URLs de retorno (debes ajustarlas según tu proyecto)
        failure: "https://www.youtube.com/@onthecode",
        pending: "https://www.youtube.com/@onthecode",
      },
      auto_return: "approved", // Retorno automático cuando el pago es aprobado
    };

    // Creación de la preferencia de Mercado Pago
    const preference = new Preference(client);
    const result = await preference.create({ body });

    // Respuesta con el ID de la preferencia
    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia :(",
    });
  }
});

// Inicia el servidor en el puerto configurado
app.listen(port, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
