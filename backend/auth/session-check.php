<?php

session_start();

function is_logged_in() {
    return isset($_SESSION['user_id']);
}
in
function redirect_if_not_logged_in($redirect_to = 'login.html') {
    if (!is_logged_in()) {
        header("Location: $redirect_to");
        exit();
    }
}

function get_user_data() {
    if (is_logged_in()) {
        return [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'email' => $_SESSION['user_email']
        ];
    }
    return null;
}
?>