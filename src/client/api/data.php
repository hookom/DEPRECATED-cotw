<?php
    header("Access-Control-Allow-Origin: localhost:5555");
    header("Access-Control-Allow-Origin: http://localhost:5555");

    $config = parse_ini_file(__DIR__ . '/../../config.ini', true);
    $host = $config['database']['host'];
    $user = $config['database']['user'];
    $password = $config['database']['password'];
    $database = $config['database']['db'];

    mysql_connect($host,$user,$password);
    @mysql_select_db($database) or die("Unable to select database");

    $query = "SELECT * FROM locations";
    $result = mysql_query($query);
    $num = mysql_numrows($result);

    mysql_close();

    $locations = array();

    $i=0;
    while ($i < $num) {
        $from_name     = mysql_result($result,$i,"NAME");
        $from_lat      = mysql_result($result,$i,"LAT");
        $from_long     = mysql_result($result,$i,"LONG");
        $from_verified = mysql_result($result,$i,"VERIFIED");

        $locations[$i] = array($from_name, $from_lat, $from_long, $from_verified);

        $i++;
    }

    echo json_encode($locations);

?>