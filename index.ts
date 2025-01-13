import express from "express";
import jobRoutes from "./routes/job.routes";

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express();

app.use(express.json());

//swagger ui
const swaggerDocument = YAML.load(path.join(__dirname, './openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1/jobs", jobRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


