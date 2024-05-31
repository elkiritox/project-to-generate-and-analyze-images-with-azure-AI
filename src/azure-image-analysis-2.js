import React, { useState } from 'react';
import axios from 'axios';


console.log("APIKEY: ", process.env.REACT_APP_AZURE_SUBSCRIPTION_KEY)
const ComputerVisionAnalyzer = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [configError, setConfigError] = useState(false);

  const isConfigured = () => {
    // Verifica si las variables de entorno están configuradas correctamente
    return process.env.REACT_APP_AZURE_SUBSCRIPTION_KEY && process.env.REACT_APP_AZURE_ENDPOINT;
  };

  const analyzeImage = async () => {
    if (!isConfigured()) {
      setConfigError(true);
      return;
    }
    const subscriptionKey = process.env.REACT_APP_AZURE_SUBSCRIPTION_KEY;
    //const subscriptionKey = 'ce3c2e371ac74767b3c8c6dc2564665d';
    //const endpoint = 'https://analyze2.cognitiveservices.azure.com/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects&language=es&gender-neutral-caption=False'; // Ejemplo: 'https://tu-servicio.cognitiveservices.azure.com/vision/v4.0/analyze';
    const endpoint = process.env.REACT_APP_AZURE_ENDPOINT;

    try {
      const response = await axios.post(
        `${endpoint}`,
        { url: imageUrl },
        {
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
          },
        }
      );

      setAnalysisResult(response.data);
      setConfigError(false);
    } catch (error) {
      console.error('Error al analizar la imagen:', error);
      setConfigError(false);
    }
  };

  return (
    <div>
      {configError && (
        <div style={{ color: 'red' }}>
          ¡Error de configuración! Asegúrate de establecer las variables de entorno.
        </div>
      )}
      <input
        type="text"
        placeholder="URL de la imagen"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <br/>
      <br/>
      <button onClick={analyzeImage}>Analizar Imagen</button>
      {analysisResult && (
        <div>
          <h2>Resultado del análisis:</h2>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ComputerVisionAnalyzer;
