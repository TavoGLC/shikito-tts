# Shikito-TTS 

Shikito-TTS es el sintetizador de voz más pequeño del mundo el cual sintetiza directamente la señal de audio palabra por palabra. Su arquitectura le permite generar la señal de audio sin la necesidad de recurrir a capas recurrentes. Además de codificar el texto sin la necesidad de algún tipo de capa de tipo transformer. Su pequeño tamaño le permite realizar la inferencia sin la necesidad de bibliotecas especializadas. Solo las mínimas para el uso y entrenamiento de redes neuronales convoluciones.

Los datos para el entrenamiento del modelo fueron generados a partir del modelo MeloTTS-spanish que puede encontrarse en huggingface. 

https://huggingface.co/myshell-ai/MeloTTS-Spanish