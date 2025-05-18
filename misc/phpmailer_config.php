<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/../vendor/autoload.php';

function enviarCodigoVerificacion($email, $codigoDeVerificacion) {
    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'cuentapruebacorreo503@gmail.com';
        $mail->Password = 'pmmm mghv xyex djvy';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        // Configuración del correo
        $mail->setFrom('cuentapruebacorreo503@gmail.com', 'Veganimo');
        $mail->addAddress($email);
        
        // Contenido del correo
        $mail->isHTML(true);
        $mail->Subject = 'Código de Verificación para Veganimo';
        $mail->Body = '
            <h2>¡Gracias por registrarte en Veganimo!</h2>
            <p>Tu código de verificación es: <strong>' . $codigoDeVerificacion . '</strong></p>
            <p>Por favor ingresa este código en la página de verificación para completar tu registro.</p>
            <p>Si no solicitaste este registro, por favor ignora este mensaje.</p>
        ';
        $mail->AltBody = 'Tu código de verificación es: ' . $codigoDeVerificacion;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Error al enviar correo: " . $mail->ErrorInfo);
        return $mail->ErrorInfo;
    }
}
?>