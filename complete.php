<?php
include "core.php";

$quest = getCurrentQuest();
$questId = $quest['id'];

$sql = "UPDATE quests SET part=3,status='complete',finished=NOW() WHERE id=$questId";
dbExec($sql);
echo "Quest $questId comleted.";
$questId = $questId + 1;
$sql = "UPDATE quests SET status='open' WHERE id=$questId";
dbExec($sql);


