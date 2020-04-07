Először a node modulokat kell installálnunk az

    npm install

paranccsal. Utána ha fut emulátor, vagy a géphez van csatlakoztatva a telefonunk, akkor a

    react-native run-android

paranccsal buildelhetjük és futtathatjuk a programot.

FONTOS:

A database-api programnak futnia kell, enélkül nem fogunk tudni belépni (database-apiból szedi ki az adatokat). Ehhez kelleni fog majd a gépünk IP címe is amit az

    ipconfig 

paranccsal kapunk meg. (Ethernet-adapter Helyi kapcsolatnál az IPv4 cím kell)


Illetve fontos, hogy a térkép menüpontot sem lehet használni APIkey nélkül.
Instrukció, hogy hogyan generáljunk magunknak:

    https://developers.google.com/maps/documentation/android-sdk/get-api-key

A generált keyt az android/app/src/main/AndroidManifest.xml - ba kell belerakni a "android:name="com.google.android.geo.API_KEY" sor alá (81.sor)