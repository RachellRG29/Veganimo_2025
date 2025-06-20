<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/../vendor/autoload.php';

function enviarCodigoVerificacion($email, $codigoDeVerificacion, $tipo = 'registro') {
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

        // Remitente y destinatario
        $mail->setFrom('cuentapruebacorreo503@gmail.com', 'Veganimo');
        $mail->addAddress($email);

        // Correo en formato HTML
        $mail->isHTML(true);

        // Contenido personalizado según tipo
        if ($tipo === 'recuperacion') {
            $mail->Subject = 'Código para recuperar tu contraseña';
            $mail->Body = '
                <h2>Solicitud de recuperación de contraseña</h2>
                <p>Has solicitado recuperar tu contraseña en Veganimo.</p>
                <p>Tu código es: <strong>' . $codigoDeVerificacion . '</strong></p>
                <p>Si no solicitaste esto, ignora este mensaje.</p>
            ';
            $mail->AltBody = 'Código de recuperación: ' . $codigoDeVerificacion;
        } else {
            $mail->Subject = 'Código de Verificación para Veganimo';
            $mail->Body = '
                <h2>¡Gracias por registrarte en Veganimo!</h2>
                <p>Tu código de verificación es: <strong>' . $codigoDeVerificacion . '</strong></p>
                <p>Por favor ingresa este código en la página de verificación para completar tu registro.</p>
                <p>Si no solicitaste este registro, por favor ignora este mensaje.</p>
            ';
            $mail->AltBody = 'Tu código de verificación es: ' . $codigoDeVerificacion;
        }

        // Enviar correo
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Error al enviar correo: " . $mail->ErrorInfo);
        return $mail->ErrorInfo;
    }
}
?>
