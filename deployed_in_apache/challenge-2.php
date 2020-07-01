<?php
        $value = "Try to stick to the same HTML tag instead of simply closing it?";
        if (isset($_REQUEST['name'])) {
                $value = str_replace('<', '', $_REQUEST['name']);
                $value = str_replace('>', '', $value);
        }
?>
<html>
    <body>
            <input type="text" size="35" name="name" value="<?php echo $value; ?>">
            <br>
            Use the "name" URL parameter!
    </body>
</html>