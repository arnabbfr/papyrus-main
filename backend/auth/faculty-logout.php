<?php
session_start();

$_SESSION = array();

session_destroy();

header("Location: facultylogin.html");
exit();
?>