<?php
include "core.php";

$sql = "update quests set status='block',part=1";
dbExec($sql);
echo "All quests reseted.";


