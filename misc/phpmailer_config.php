<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';


function enviarCodigoVerificacion($email, $codigoDeVerificacion) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'cuentapruebacorreo503@gmail.com';
        $mail->Password = 'pmmm mghv xyex djvy';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('cuentapruebacorreo503@gmail.com', 'Veganimo');
        $mail->addAddress($email, 'Usuario nuevo');

        $mail->isHTML(true);
        $mail->Subject = 'Código de Verificación';
        $mail->Body    = 'Aquí va el código de verificación de 4 dígitos: <strong>' . $codigoDeVerificacion . '</strong>';
        $mail->AltBody = 'Código de Verificación: ' . $codigoDeVerificacion;

        $mail->send();
        return true;
    } catch (Exception $e) {
        return "❌ Error al enviar el correo: {$mail->ErrorInfo}";
    }
}
