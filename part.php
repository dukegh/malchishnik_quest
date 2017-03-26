<?php
include "core.php";

$quest = getCurrentQuest();
$questId = $quest['id'];

$sql = "UPDATE quests SET part=2 WHERE id=$questId";
dbExec($sql);
echo "Quest $questId part 2.";


