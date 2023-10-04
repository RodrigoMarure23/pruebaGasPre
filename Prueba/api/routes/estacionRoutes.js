import express from "express"
import mysql from "mysql"
const router = express.Router()

const port = 3001;

const dbCon = {
  host: 'precios-1.c0f6dm2ucnlg.us-east-2.rds.amazonaws.com',
  port: 3306,
  user: 'candidatoPrueba',
  password: 'gaspre21.M',
  database: 'prueba',
}

const conectarbd = async () => {
  const conexion = await mysql.createConnection(dbCon)

  conexion.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
    }
    console.log('Conexión a la base de datos establecida');
  });
  router.get('/estaciones', (req, res) => {





    // endpoint para obtener todas las estaciones cercanas
    const competidoresQuery = `SELECT * FROM stations`;

    conexion.query(competidoresQuery, (err, competidoresResults) => {
      if (err) {
        console.error('Error al obtener información de los competidores:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }




      res.json({
        competidoresResults
      });
    });

  });

  router.get('/estacionesInfo', (req, res) => {
    const { estacionId } = req.body;

    // Iniciar una transacción
    conexion.beginTransaction((err) => {
      if (err) {
        console.error('Error al iniciar la transacción:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      // Consulta SQL para obtener información de la estación
      const estacionQuery = `SELECT name FROM stations WHERE cre_id='${estacionId}'`;

      conexion.query(estacionQuery, (err, estacionResult) => {
        if (err) {
          console.error('Error al obtener información de la estación:', err);

          // Hacer un rollback de la transacción en caso de error
          conexion.rollback(() => {
            res.status(500).json({ error: 'Error interno del servidor' });
          });

          return;
        }

        // Consulta SQL para obtener información de los competidores
        const competidoresQuery = `SELECT * FROM stations_competitors WHERE cre_id='${estacionId}'`;

        conexion.query(competidoresQuery, (err, competidoresResult) => {
          console.log(competidoresResult)
          if (err) {
            console.error('Error al obtener información de los competidores:', err);

            // Hacer un rollback de la transacción en caso de error
            conexion.rollback(() => {
              res.status(500).json({ error: 'Error interno del servidor' });
            });

            return;
          }

          // Confirmar la transacción
          conexion.commit((err) => {
            if (err) {
              console.error('Error al confirmar la transacción:', err);
              res.status(500).json({ error: 'Error interno del servidor' });
              return;
            }

            res.json({
              nombreEstacion: estacionResult[0].name,
              competidoresInfo: competidoresResult,
            });
          });
        });
      });
    });
  });

}

export { router, conectarbd, port }