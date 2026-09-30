# Mise en service du CMS

Le panneau d'administration est disponible à `/admin/`. Il utilise Decap CMS avec Decap Turbo pour l'authentification et l'accès au dépôt GitHub. Les enregistrements publiés modifient les fichiers du dépôt ; Vercel redéploie ensuite le site.

## Autorisations et première connexion

1. Dans [Decap Turbo](https://turbo.decapcms.org/), ouvrir le site déjà créé dont le Site ID est `d2b47249-5c72-4720-9ee2-74ad28666ab2`. Ne pas en créer un second.
2. Dans **Git connection** sur l’organisation, installer l'application GitHub avec l'accès limité au dépôt `Adjaho-Samson/TRINAHOOK`, plutôt qu'à tous les dépôts.
3. Dans les paramètres du site Turbo, vérifier le dépôt `Adjaho-Samson/TRINAHOOK`, la branche `main` et le chemin `admin/config.yml`.
4. Dans **Admin interface URL(s)**, ajouter exactement `https://trinahook.vercel.app/admin/`.
5. Dans les membres du site, donner l'accès au compte Decap Turbo du propriétaire. Un compte Turbo sans accès à ce site ne peut pas modifier le contenu.
6. Publier les changements du dépôt sur GitHub. Après le déploiement Vercel, ouvrir `https://trinahook.vercel.app/admin/` et choisir **Login with Turbo**.

L'identifiant Turbo, `site_url` et `display_url` sont déjà renseignés dans `admin/config.yml`. La liste **Admin interface URL(s)** et les droits GitHub se règlent dans Decap Turbo, pas dans ce fichier.

## Gestion du contenu

Dans **Créations**, le propriétaire peut ajouter, supprimer ou réordonner les fiches, changer les photos, les noms, les catégories et les descriptions, et choisir les quatre pièces mises en avant sur l'accueil. Dans **Textes du site**, il peut modifier les textes des deux pages et les étapes du savoir-faire.

Le backend Decap Turbo est actuellement en bêta. Ne partagez jamais un jeton GitHub dans les fichiers du site.
