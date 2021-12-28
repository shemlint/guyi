<?php
header('Access-Control-Allow-Origin:*');

//$con = mysqli_connect('localhost', 'root', '', 'guyiback');
$db = '257899';
$con = mysqli_connect('localhost',$db, 'Teddy6910', $db);

$connected = true;
if (mysqli_connect_error()) {
    $result['error'] = 'connect error';
    $connected = false;
    $req['do'] = 'nothing';
}

$result = array('status' => 'notok', 'error' => '', 'data' => '');
$rawdata = file_get_contents('php://input');
$req = json_decode($rawdata, true);

function upload()
{
    global $con, $result, $req;


    $name = $req['name'];
    $data = $req['data'];
    $creator = $req['creator'];
    $doc = $req['doc'];
    $deps = $req['deps'];
    $files = $req['files'];

    $existsquery = "SELECT * FROM modules where name='{$name}'";
    $res = mysqli_query($con, $existsquery);
    if (mysqli_error($con)) {
        $result['error'] = 'exits error';
        return;
    }
    $row = mysqli_fetch_assoc($res); // mysqli_fetch_row($res,MYSQLI_ASSOC);

    if ($row == null) {
        $result['exits'] = false;
    } else {
        $result['exits'] = true;
        $email = json_decode($row['creator'])->email; //$email;
        if (!(json_decode($creator)->email == $email)) {
            $result['deleted'] = false;
        } else {
            $result['deleted'] = true;
            mysqli_query($con, "DELETE FROM modules WHERE name='{$name}'");
        }
    }
    if (!$result['exits'] || ($result['exits'] && $result['deleted'])) {
        $query = "INSERT INTO modules (name,creator,doc,data,deps,files) VALUES (?,?,?,?,?,?)"; //('{$name}','{$creator}','{$doc}' ,'{$data}','{$deps}')";
        $stmt = mysqli_prepare($con, $query);
        $stmt->bind_param('ssssss', $name, $creator, $doc, $data, $deps, $files);
        $res = $stmt->execute();
        if (mysqli_error($con)) {
            $result['error'] = mysqli_error($con);
        } else {
            $result['data'] = $res;
            $result['status'] = 'ok';
        }
    }
}

function download()
{
    global $con, $result, $req;
    $id = $req['id'];
    $query = "SELECT data,deps,files FROM modules WHERE id={$id} ";
    $res = mysqli_query($con, $query);
    if (mysqli_error($con)) {
        $result['error'] = mysqli_error($con);
        return;
    }
    $rows = mysqli_fetch_all($res, MYSQLI_ASSOC);
    $result['data'] = $rows;
    $result['status'] = 'ok';
}
function search()
{
    global $con, $result, $req;

    $qry = $req['query'];
    $query = "SELECT id,name,creator,doc FROM modules WHERE creator LIKE '%{$qry}%' OR name LIKE '%${qry}%' LIMIT 50 ";
    $res = mysqli_query($con, $query);
    if (mysqli_error($con)) {
        $result['error'] = mysqli_error($con);
        return;
    }
    $rows = mysqli_fetch_all($res, MYSQLI_ASSOC);
    $result['data'] = $rows;
    $result['status'] = 'ok';
}

if ($req['do'] == 'upload') {
    upload();
}
if ($req['do'] == 'download') {
    download();
}
if ($req['do'] == 'search') {
    search();
}


echo json_encode($result);
