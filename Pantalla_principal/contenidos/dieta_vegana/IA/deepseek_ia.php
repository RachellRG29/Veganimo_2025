<?php
// ===============================================
// 🧠 Asistente de Nutrición con DeepSeek (PHP)
// ===============================================
ini_set('max_execution_time', 120);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// --- Manejar preflight ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- Aceptar solo POST ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido. Usa POST."]);
    exit;
}

// --- Leer datos JSON enviados desde el formulario ---
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["error" => "No se recibieron datos válidos."]);
    exit;
}

// --- Variables recibidas ---
$nombre       = $input['nombre'] ?? 'Usuario';
$genero       = $input['genero'] ?? 'No especificado';
$edad         = $input['edad'] ?? '';
$peso         = $input['peso'] ?? '';
$altura       = $input['altura'] ?? '';
$dieta_actual = $input['dieta_actual'] ?? 'No especificada';
$objetivo     = $input['objetivo'] ?? 'Mantener peso';
$nivel_meta   = $input['nivel_meta'] ?? '';
$descripcion  = $input['descripcion_dieta'] ?? '';
$plan         = $input['plan'] ?? '';
$patologicos  = $input['patologicos'] ?? '';
$familiares   = $input['familiares'] ?? '';
$quirurgicos  = $input['quirurgicos'] ?? '';
$intolerancias= $input['intolerancias'] ?? '';
$alergias     = $input['alergias'] ?? '';
$sintomas     = $input['sintomas'] ?? '';

// --- 🔑 API Key DeepSeek ---
$apiKey = "sk-a83bdcd5aaa1460485ffe051711dbe93"; // tu clave válida

// --- 🧠 Prompt personalizado ---
$prompt = "
Eres un nutricionista profesional. Crea un plan de dieta personalizado para el usuario con base en estos datos:

👤 Nombre: $nombre
⚧ Género: $genero
🎂 Edad: $edad años
⚖️ Peso: $peso kg
📏 Altura: $altura cm
🥗 Dieta actual: $dieta_actual
🎯 Objetivo: $objetivo
📈 Nivel meta: $nivel_meta
🩺 Condiciones patológicas: $patologicos
👨‍👩‍👧‍👦 Antecedentes familiares: $familiares
🏥 Quirúrgicos: $quirurgicos
🚫 Intolerancias: $intolerancias
⚠️ Alergias: $alergias
🤢 Síntomas: $sintomas
📝 Descripción de dieta: $descripcion
💎 Plan actual: $plan

Responde con un plan de dieta completo y detallado que incluya:
1. Desayuno, almuerzo, cena y snacks.
2. Porciones y horarios recomendados.
3. Alimentos sugeridos y los que debe evitar.
4. Consejos de hidratación, descanso y actividad física.
5. Ajustes personalizados según su condición y objetivo.
";

// --- Datos para la API ---
$data = [
    "model" => "deepseek-chat",
    "messages" => [
        ["role" => "system", "content" => "Eres un nutricionista experto y preciso."],
        ["role" => "user", "content" => $prompt]
    ],
    "max_tokens" => 1200,
    "temperature" => 0.7
];

// --- Solicitud HTTP ---
$options = [
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\nAuthorization: Bearer $apiKey\r\n",
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];

$context = stream_context_create($options);
$response = @file_get_contents("https://api.deepseek.com/v1/chat/completions", false, $context);

// --- Guardar debug ---
file_put_contents("debug_deepseek.json", $response);

if ($response === FALSE) {
    echo json_encode(["error" => "❌ No se pudo conectar con la API de DeepSeek."]);
    exit;
}

// --- Procesar respuesta ---
$result = json_decode($response, true);

if (isset($result['choices'][0]['message']['content'])) {
    $recomendacion = $result['choices'][0]['message']['content'];
    echo json_encode(["success" => true, "recomendacion" => $recomendacion], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} else {
    $errorMsg = $result['error']['message'] ?? "Respuesta inválida de la API";
    echo json_encode(["error" => $errorMsg, "debug" => $result]);
}
?>
