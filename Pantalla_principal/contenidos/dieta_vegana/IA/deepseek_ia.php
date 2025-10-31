<?php
// ===============================================
// 🧠 Asistente de Nutrición con DeepSeek + Imágenes Relativas
// ===============================================
ini_set('max_execution_time', 180);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { 
    http_response_code(405); 
    echo json_encode(["error"=>"Método no permitido. Usa POST."]); 
    exit; 
}

// --- Recibir datos del frontend ---
$input = json_decode(file_get_contents("php://input"), true);
if (!$input) { echo json_encode(["error"=>"No se recibieron datos válidos."]); exit; }

$nombre       = $input['nombre'] ?? 'Usuario';
$genero       = $input['genero'] ?? 'No especificado';
$edad         = $input['edad'] ?? '';
$peso         = $input['peso'] ?? '';
$altura       = $input['altura'] ?? '';
$dieta_actual = $input['dieta_actual'] ?? 'No especificada';
$objetivo     = $input['objetivo'] ?? 'Mantener peso';
$nivel_meta   = $input['nivel_meta'] ?? '';
$descripcion  = $input['descripcion_dieta'] ?? '';
$patologicos  = $input['patologicos'] ?? '';
$familiares   = $input['familiares'] ?? '';
$quirurgicos  = $input['quirurgicos'] ?? '';
$intolerancias= $input['intolerancias'] ?? '';
$alergias     = $input['alergias'] ?? '';
$sintomas     = $input['sintomas'] ?? '';

$apiKey = "sk-a83bdcd5aaa1460485ffe051711dbe93";

// --- Obtener recetas disponibles ---
ob_start();
include(__DIR__ . "/obtener_recetas.php");
$recetasData = ob_get_clean();
$recetasJson = json_decode($recetasData, true);

$recetasText = "";
if ($recetasJson && $recetasJson['success'] && !empty($recetasJson['data'])) {
    foreach ($recetasJson['data'] as $r) {
        $nombreReceta = $r['nombre_receta'] ?? 'Sin nombre';
        $imagenLimpia = ltrim($r['imagen'] ?? '', '/');
        $imagenURL = !empty($imagenLimpia) ? (strpos($imagenLimpia,'uploads/')===0 ? '/'.$imagenLimpia : '/uploads/'.$imagenLimpia) : '';
        
        $recetasText .= "Nombre: " . $nombreReceta . "\n";
        $recetasText .= "Tipo: " . ($r['tipo_receta'] ?? 'Sin tipo') . "\n";
        $recetasText .= "Imagen: " . $imagenURL . "\n";
        $recetasText .= "Calorías: " . ($r['valor_nutricional'] ?? 'N/A') . "\n";
        $recetasText .= "Dificultad: " . ($r['dificultad'] ?? 'N/A') . "\n\n";
    }
} else {
    $recetasText = "No hay recetas disponibles.";
}

// --- Prompt para la IA ---
$prompt = "
Eres un nutricionista profesional. Analiza los datos del usuario y crea un plan de dieta personalizado.
Incluye:

### 🔍 Análisis del usuario:
- Resume en 3-4 oraciones el perfil nutricional del usuario.
- Identifica posibles necesidades nutricionales o precauciones dietéticas.

### 🍽️ Plan de dieta:
Usa **solo las recetas disponibles** para crear un plan equilibrado con:
1. Desayuno, almuerzo y cena.
2. Explicación de por qué cada receta es adecuada.
3. Horarios sugeridos.
4. Porciones recomendadas.
5. Incluye **la ruta relativa de la imagen** para cada comida.

Datos del usuario:
Nombre: $nombre
Género: $genero
Edad: $edad años
Peso: $peso kg
Altura: $altura cm
Dieta actual: $dieta_actual
Objetivo: $objetivo
Nivel meta: $nivel_meta
Condiciones patológicas: $patologicos
Antecedentes familiares: $familiares
Quirúrgicos: $quirurgicos
Intolerancias: $intolerancias
Alergias: $alergias
Síntomas: $sintomas
Descripción de dieta: $descripcion

Recetas disponibles:
$recetasText

### 📋 Instrucciones para la respuesta:
- Devuelve **solo JSON válido** con esta estructura:
{
  \"analisis\": \"Texto breve sobre el usuario\",
  \"plan\": {
    \"desayuno\": {\"nombre\":\"\",\"imagen\":\"\",\"calorias\":\"\",\"hora\":\"\",\"explicacion\":\"\"},
    \"almuerzo\": {\"nombre\":\"\",\"imagen\":\"\",\"calorias\":\"\",\"hora\":\"\",\"explicacion\":\"\"},
    \"cena\": {\"nombre\":\"\",\"imagen\":\"\",\"calorias\":\"\",\"hora\":\"\",\"explicacion\":\"\"}
  }
}
";

// --- Solicitud a la API ---
$data = [
    "model" => "deepseek-chat",
    "messages" => [
        ["role"=>"system","content"=>"Eres un nutricionista experto y preciso. Responde solo JSON válido."],
        ["role"=>"user","content"=>$prompt]
    ],
    "max_tokens"=>2000,
    "temperature"=>0.7
];

$context = stream_context_create([
    "http" => [
        "method"=>"POST",
        "header"=>"Content-Type: application/json\r\nAuthorization: Bearer $apiKey\r\n",
        "content"=>json_encode($data),
        "ignore_errors"=>true
    ]
]);

$response = @file_get_contents("https://api.deepseek.com/v1/chat/completions", false, $context);
file_put_contents(__DIR__."/debug_deepseek_plan.json", $response);

if ($response === FALSE) {
    $error = error_get_last();
    echo json_encode(["error"=>"❌ No se pudo conectar con DeepSeek","detalles"=>$error]);
    exit;
}

// --- Procesar respuesta JSON ---
$result = json_decode($response, true);
$content = $result['choices'][0]['message']['content'] ?? ($result['choices'][0]['text'] ?? '');
$content = trim(preg_replace('/^[^{]*({.*})[^}]*$/s', '$1', $content));
$planJson = json_decode($content, true);

$planDefecto = [
    "desayuno"=>["nombre"=>"No disponible","imagen"=>"","calorias"=>"N/A","hora"=>"","explicacion"=>""],
    "almuerzo"=>["nombre"=>"No disponible","imagen"=>"","calorias"=>"N/A","hora"=>"","explicacion"=>""],
    "cena"=>["nombre"=>"No disponible","imagen"=>"","calorias"=>"N/A","hora"=>"","explicacion"=>""]
];

$planFinal = isset($planJson['plan']) ? array_merge($planDefecto, $planJson['plan']) : $planDefecto;

// --- Devolver respuesta ---
echo json_encode([
    "success"=>true,
    "message"=>"✅ Plan generado correctamente.",
    "analisis"=>$planJson['analisis'] ?? '',
    "plan"=>$planFinal
]);
?>
