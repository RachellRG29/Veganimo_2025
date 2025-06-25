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
        $mail->CharSet = 'UTF-8';
        $mail->isHTML(true);

        // Incrustar imagen del logo
        $mail->addEmbeddedImage(__DIR__ . '/../images/logo_veganimoo.png', 'logoVeganimo');

        // Contenido personalizado según tipo
        if ($tipo === 'recuperacion') {
            $mail->Subject = 'Código para recuperar tu contraseña';
            $mail->Body = '
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    border: 2px solid #007848;
                ">
                    <img src="cid:logoVeganimo" alt="Veganimo" style="display: block; margin: auto; width: 100px; margin-bottom: 20px;">
                    <h2 style="color: #007848; text-align: center;">Solicitud de recuperación de contraseña</h2>
                    <p style="font-size: 16px; color: #333;">Has solicitado recuperar tu contraseña en <strong>Veganimo</strong>.</p>
                    <p style="
                        font-size: 18px;
                        font-weight: bold;
                        text-align: center;
                        background-color: #007848;
                        color: white;
                        padding: 15px 0;
                        border-radius: 5px;
                        letter-spacing: 4px;
                        margin: 20px 0;
                    ">
                        ' . $codigoDeVerificacion . '
                    </p>
                    <p style="font-size: 16px; color: #333;">Por favor ingresa este codigo para recuperar tu contraseña.</p>
                    <p style="font-size: 14px; color: #777;">Si no solicitaste esto, ignora este mensaje.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="font-size: 12px; color: #aaa; text-align: center;">Este correo fue enviado automáticamente. Por favor no respondas.</p>
                </div>
            ';
            $mail->AltBody = 'Código de recuperación: ' . $codigoDeVerificacion;

        } else {
            $mail->Subject = 'Código de Verificación para Veganimo';
            $mail->Body = '
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    border: 2px solid #007848;
                ">
                    <img src="cid:logoVeganimo" alt="Veganimo" style="display: block; margin: auto; width: 100px; margin-bottom: 20px;">
                    <h2 style="color: #007848; text-align: center;">¡Gracias por registrarte en Veganimo!</h2>
                    <p style="font-size: 16px; color: #333;">Tu código de verificación es:</p>
                    <p style="
                        font-size: 24px;
                        font-weight: bold;
                        text-align: center;
                        background-color: #007848;
                        color: white;
                        padding: 15px 0;
                        border-radius: 5px;
                        letter-spacing: 6px;
                        margin: 20px 0;
                    ">
                        ' . $codigoDeVerificacion . '
                    </p>
                    <p style="font-size: 16px; color: #333;">Por favor ingresa este código en la página de verificación para completar tu registro.</p>
                    <p style="font-size: 14px; color: #777;">Si no solicitaste este registro, por favor ignora este mensaje.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="font-size: 12px; color: #aaa; text-align: center;">Este correo fue enviado automáticamente. Por favor no respondas.</p>
                </div>
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