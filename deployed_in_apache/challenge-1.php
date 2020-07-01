<?php
    header('X-XSS-Protection:0');
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create connection
        $conn = new mysqli("localhost", "app_service", "app_service", "cs101_ctf");
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        $sql = "INSERT INTO ctf_xss_challenge_1 (display_value) values ('" . $conn->escape_string($_POST['value']) . "')";
        if ($conn->query($sql) === TRUE) {
            $last_id = $conn->insert_id;
            echo "New record created successfully <br>";
            echo 'You can visit your xss-attack <a href="?id=' . $last_id . '"> here</a>.';
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        $conn->close();
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
        $mysqli = new mysqli("localhost", "app_service", "app_service", "cs101_ctf");
        if ($mysqli->connect_error) {
            die("Connection failed: " . $mysqli->connect_error);
        }
        $sql = "select display_value from ctf_xss_challenge_1 where id = " . $_GET['id'];
        $stmt = $mysqli->prepare("select display_value from ctf_xss_challenge_1 where id = (?)");
        $stmt->bind_param("i",$_GET['id']);
        $stmt->execute();
        if ($stmt->execute()) {
            $result = $mysqli->query($sql);
            /* bind result variables */
            $stmt->bind_result($value);
            while ($stmt->fetch()) {
                echo $value;
            }
        }
        // Close connection
        mysqli_close($mysqli);
    } else {
        echo '<form action="" method="POST" >Value to inject: <input type="text" name="value"><br><input type="submit" value="Submit"></form>';
    }
?>