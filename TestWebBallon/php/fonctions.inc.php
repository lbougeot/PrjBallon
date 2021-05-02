<?php

define("SERVEURBD", "127.0.0.1");
define("LOGIN", "root");
define("MOTDEPASSE", "");
define("NOMDELABASE", "ballon2021");

/**
 * @brief crée la connexion avec la base de donnée et retourne l'objet PDO pour manipuler la base
 * @return \PDO
 */
function connexionBdd() {
    try {
        
        $pdOptions = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);
        $bdd = new PDO('mysql:host=' . SERVEURBD . ';dbname=' . NOMDELABASE, LOGIN, MOTDEPASSE, $pdOptions);
        $bdd->exec('set names utf8');
        return $bdd;
        //si erreur on tue le processus et on affiche le message d'erreur    
    } catch (PDOException $e) {
        print "Erreur connexion bdd !: " . $e->getMessage() . "<br/>";
        die();
    }
}

/**
 * @brief retourne l'ensemble des positions sous forme de tableau json
 */
function getCourbes() {
    try {
        
        // connexion BDD
        $bdd = connexionBdd();
        
        $requete = $bdd->query("select horodatage, pression, temperature, altitude from ballon;") or die(print_r($requete->errorInfo()));

        $tabCourbes = array();

        while ($ligne = $requete->fetch()) {
            // ajout d'une case dans le tableau
            // la case est elle-même un tableau contenant 4 champs : date, pression, temperature, altitude.
            array_push($tabCourbes, array(
                'date' => $ligne['horodatage'],
                'pression' => $ligne['pression'],
                'temperature' => $ligne['temperature'],
                'altitude' => $ligne['altitude']));
        }

        $requete->closeCursor();
        return $tabCourbes;
    } catch (PDOException $ex) {
        print "Erreur get courbes: " . $ex->getMessage() . "<br/>";
        die();
    }
}

/**
 * @brief retourne l'ensemble des positions sous forme de tableau json
 */

function getPositions() {
    try {
         // connexion BDD
        $bdd = connexionBdd();
        
        $requete = $bdd->query("select longitude, latitude, altitude from ballon order by horodatage;");
        
        $tabPosition = array();

        while ($tab = $requete->fetch()) {
            // ajout d'une case dans le tableau
            // la case est elle-même un tableau contenant 3 champs : longitude, latitude, height.
            array_push($tabPosition, array(
                'longitude' => $tab['longitude'],
                'latitude' => $tab['latitude'], 
                'height' => $tab['altitude']));
        }
        
        $requete->closeCursor();
        return $tabPosition;
    } catch (PDOException $ex) {
        print "Erreur : " . $ex->getMessage() . "<br/>";
        die();
    }
}





/**
 * @brief retourne les informations pour mon tableau sous forme de tableau json
 */

function getInformations() {
    try {
         // connexion BDD
        $bdd = connexionBdd();
        
        $requete = $bdd->query("SELECT horodatage, altitude, temperature, pression, radiation FROM ballon order by horodatage;") or die(print_r($requete->errorInfo()));
        
        $tabTableau = array();

        while ($ligne = $requete->fetch()) {
            // ajout d'une case dans le tableau
            // la case est elle-même un tableau contenant 4 champs : date, altitude, temperature, pression, radiation.
            array_push($tabTableau, array(
                $ligne['horodatage'],
                $ligne['altitude'],
                $ligne['temperature'],
                $ligne['pression'],
                $ligne['radiation']));
        }
        
        $requete->closeCursor();
        return $tabTableau;
    } catch (PDOException $ex) {
        print "Erreur : " . $ex->getMessage() . "<br/>";
        die();
    }
}