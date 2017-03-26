<?php
include "core.php";

$sql = "update check_points set checked=0";
dbExec($sql);
echo "All check_points reseted.";


