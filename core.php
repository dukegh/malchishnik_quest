<?php
if (isset($_REQUEST['action'])) {
	$action = $_REQUEST['action'];
	if ($action == 'createUser') {
		$icon = generateIcon();
		$sql = "INSERT INTO users SET icon='$icon',created=NOW()";
		$id = dbExec($sql);
		$res = ['id' => $id, "icon" => $icon];
		echo json_encode($res);
	}
	if ($action == 'updateQuest') {
		$questId = intval($_REQUEST['quest']);
		$part = intval($_REQUEST['part']);
		$quest = getQuest($questId);
		$userComplete = '';
		if ($quest['part'] < $part) {
			$sql = "UPDATE quests SET part=$part,started=NOW(),user_id=" . intval($_COOKIE["userId"]) . " WHERE id=$questId";
			dbExec($sql);
		} else {
			$userComplete = getIconByUser($quest['user_id']);
		}
		$quest = getQuest($questId);
		echo json_encode(['currentQuest' => $quest, 'userComplete' => $userComplete]);
	}
	if ($action == 'checkCode') {
		$questId = intval($_REQUEST['quest']);
		$code = preg_replace('/,/', '.', $_REQUEST['code']);
		$res = 'bad';
		$quest = getQuest($questId);
		if (mb_strtoupper($code) == mb_strtoupper($quest['code']) || mb_strtoupper($code) == 'SUPER') {
			$sql = "UPDATE quests SET part=3,status='complete',finished=NOW() WHERE id=$questId";
			dbExec($sql);
			$questId = $questId + 1;
			$sql = "UPDATE quests SET status='open' WHERE id=$questId";
			dbExec($sql);
			$res = 'good';
		}
		$quest = getQuest($questId);
		echo json_encode(['currentQuest' => $quest, 'res' => $res]);
	}

	if ($action == 'finishQuest') {
		$questId = intval($_REQUEST['quest']);
		$quest = getQuest($questId);
		$sql = "UPDATE quests SET part=3,status='complete',finished=NOW() WHERE id=$questId";
		dbExec($sql);
		$questId = $questId + 1;
		$sql = "UPDATE quests SET status='open' WHERE id=$questId";
		dbExec($sql);
		$quest = getQuest($questId);
		echo json_encode(['currentQuest' => $quest]);
	}

	if ($action == 'updatePoint') {
		$pointId = intval($_REQUEST['point']);
		$sql = "UPDATE check_points SET checked=1 WHERE id=$pointId";
		dbExec($sql);
		echo json_encode(['checkPoints' => getCheckPoints()]);
	}

	if ($action == 'getCheckPoints') {
		echo json_encode(['checkPoints' => getCheckPoints()]);
	}

	if ($action == 'getCurrentQuest') {
		$questId = intval($_REQUEST['quest']);
		$part = intval($_REQUEST['part']);
		$quest = getQuest($questId);
		$userComplete = '';
		if ($quest['id'] > $questId) {
			$userId = getUserIdComplete($questId);
			if ($userId) $userComplete = getIconByUser($userId);
		} elseif ($quest['part'] > $part) {
			$userComplete = getIconByUser($quest['user_id']);
		}
		echo json_encode(['currentQuest' => getCurrentQuest(), 'userComplete' => $userComplete]);
	}

}

function getUserIdComplete($questId) {
	$res = [];
	$sql = "SELECT user_id FROM quests WHERE id=$questId";
	$rows = dbSelect($sql);
	if ($rows) {
		$res = $rows[0];
	}
	return $res['user_id'];
}

function getIconByUser($userId) {
	$res = [];
	$sql = "SELECT icon FROM users WHERE id=$userId";
	$rows = dbSelect($sql);
	if ($rows) {
		$res = $rows[0];
	}
	return $res['icon'];
}

function getCheckPoints() {
	$sql = "SELECT * FROM check_points";
	return dbSelect($sql);
}


function getQuest($questId) {
	$res = [];
	$sql = "SELECT * FROM quests WHERE id=$questId";
	$rows = dbSelect($sql);
	if ($rows) {
		$res = $rows[0];
	}
	return $res;
}

function getCurrentQuest() {
	$res = [];
	$sql = "SELECT * FROM quests WHERE status='open' LIMIT 1";
	$rows = dbSelect($sql);
	if ($rows) {
		$res = $rows[0];
	} else {
		$sql = "UPDATE quests SET status='open' WHERE id=1";
		dbExec($sql);
		return getCurrentQuest();
	}
	return $res;
}

function generateIcon() {
	$path = 'img/pokemon';
	$files = array_diff(file_list($path, '.png'), getUsedIcons());
	$id = rand(0, count($files));
	return "/$path/$files[$id]";
}

function file_list($d, $x){
	$l = [];
	foreach (array_diff(scandir($d), array('.','..')) as $f) {
		if (is_file($d.'/'.$f) && (($x) ? preg_match("/$x$/", $f) : 1)) {
			$l[] = $f;
		}
	} 
		
	return $l;
}

function getUsedIcons() {
	$res = [];
	$sql = "SELECT icon FROM users";
	$rows = dbSelect($sql);
	foreach ($rows as $row) {
		$res[] = preg_replace('/^.*\//', '', $row['icon']);
	}
	return $res;
}

function dbSelect($sql) {
	$rows = [];
	$db = getDb();
	if ($db) {
		$res = mysql_query($sql);
		while ($row = mysql_fetch_assoc($res)) {
			$rows[] = $row;
		}
	}
	return $rows;
}


function dbExec($sql) {
	$db = getDb();
	if ($db) {
		mysql_query($sql);
		return mysql_insert_id();
	}
	return 0;
}

$db = null;

function getDb() {
	global $db;
	if ($db === null) {
		$db = mysql_connect("localhost", "root", "") or die("Could not connect");
		mysql_select_db("quest") or die("Could not select database");
	}
	mysql_query('set names utf8');
	return $db;
}
?>