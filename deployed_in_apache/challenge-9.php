<?php
    if (isset($_SERVER['HTTP_REFERER'])) {
        echo "You sent: " . $_SERVER['HTTP_REFERER'] . ' - ';
        if ($_SERVER['HTTP_REFERER'] == 'http://ctf.supersecurity.cf') {
            echo "You worked hard, this is your reward: cs101-ctf{CCB5F9FB76E06612C78C2AC8D80B27DF}";
        } else {
            echo "I only accept request coming from http://ctf.supersecurity.cf";
        }
    } else {
        echo "See if you can add the 'Referer' header in your HTTP GET request!";
    }
?>