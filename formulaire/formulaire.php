<?php
define("SERVEURBD", "172.18.58.63");
define("LOGIN", "root");
define("MOTDEPASSE", "toto");
define("NOMDELABASE", "ballon2021");


$horodatage= $_POST["horodatage"];
$latitude= $_POST["latitude"];
$longitude= $_POST["longitude"];
$altitude= $_POST["altitude"];
$pression= $_POST["pression"];
$temperature= $_POST["temperature"];
$radiation= $_POST["radiation"]; 


/**
 * @brief crée la connexion avec la base de donnée et retourne l'objet PDO pour manipuler la base
 * @return \PDO
 */

    try {
        
        $pdOptions = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);
        $bdd = new PDO('mysql:host=' . SERVEURBD . ';dbname=' . NOMDELABASE, LOGIN, MOTDEPASSE, $pdOptions);
        $bdd->exec('set names utf8');
        
        
        //On insère les données reçues
        $sth = $bdd->prepare("
            INSERT INTO ballon(horodatage, latitude, longitude, altitude, pression, temperature, radiation)
            VALUES(:horodatage, :latitude, :longitude, :altitude, :pression, :temperature, :radiation)");
        $sth->bindParam(':horodatage',$horodatage);
        $sth->bindParam(':latitude',$latitude);
        $sth->bindParam(':longitude',$longitude);
        $sth->bindParam(':altitude',$altitude);
        $sth->bindParam(':pression',$pression);
        $sth->bindParam(':temperature',$temperature);
        $sth->bindParam(':radiation',$radiation);
        $sth->execute();
        
        //On renvoie l'utilisateur vers la page de remerciement
        header("Location:formulairesucces.html");

        
        
        //si erreur on tue le processus et on affiche le message d'erreur    
    } catch (PDOException $e) {
        print "Erreur connexion bdd !: " . $e->getMessage() . "<br/>";
        die();
    }

?>
