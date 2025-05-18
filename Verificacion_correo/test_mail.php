<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';
 // Ajusta la ruta si es necesario

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'cuentapruebacorreo503@gmail.com'; // <- CAMBIA ESTO
    $mail->Password = 'pmmm mghv xyex djvy'; // <- TU APP PASSWORD
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('cuentapruebacorreo503@gmail.com', 'Prueba Veganimo'); // <- CAMBIA SI QUIERES
    $mail->addAddress('kaneki783832@gmail.com'); // <- A QUÉ CORREO QUIERES ENVIAR

    $mail->isHTML(true);
    $mail->Subject = 'Correo de prueba desde PHPMailer';
    $mail->Body    = '<h2>¡Hola! Este es un correo de prueba desde tu proyecto Veganimo 🎉</h2>';

    $mail->send();
    echo '✅ Correo enviado correctamente.';
} catch (Exception $e) {
    echo "❌ Error al enviar el correo: {$mail->ErrorInfo}";
}
